import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, ExternalLink, CheckCircle, XCircle, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Organization {
  id: number;
  login: string;
  description: string;
  html_url: string;
  blog?: string;
  verified?: boolean;
  shared_with_parent: boolean;
  shared_with_associated: boolean;
}

export const AssociatedOrgFinder = () => {
  const [parentOrg, setParentOrg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const searchOrganizations = async () => {
    if (!parentOrg.trim() || !searchTerm.trim()) {
      toast({
        title: 'Missing inputs',
        description: 'Please provide both parent organization and search term.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Search for organizations containing the search term
      const searchResponse = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(searchTerm)}+type:org&per_page=50`);
      
      if (!searchResponse.ok) {
        throw new Error('Failed to search organizations');
      }

      const searchData = await searchResponse.json();
      const foundOrgs = searchData.items;

      // Get parent org members
      const parentMembersResponse = await fetch(`https://api.github.com/orgs/${parentOrg}/members`);
      const parentMembers = parentMembersResponse.ok ? await parentMembersResponse.json() : [];
      const parentMemberIds = new Set(parentMembers.map((member: any) => member.id));

      // Process each found organization
      const processedOrgs: Organization[] = [];
      
      for (const org of foundOrgs) {
        try {
          // Get organization details
          const orgResponse = await fetch(`https://api.github.com/orgs/${org.login}`);
          const orgDetails = orgResponse.ok ? await orgResponse.json() : org;

          // Get organization members
          const membersResponse = await fetch(`https://api.github.com/orgs/${org.login}/members`);
          const members = membersResponse.ok ? await membersResponse.json() : [];
          const memberIds = new Set(members.map((member: any) => member.id));

          // Check for shared members with parent
          const sharedWithParent = Array.from(memberIds).some(id => parentMemberIds.has(id));

          // For now, we'll set shared_with_associated to false
          // In a full implementation, you'd check against verified organizations
          const sharedWithAssociated = false;

          processedOrgs.push({
            id: org.id,
            login: org.login,
            description: orgDetails.description || 'No description available',
            html_url: org.html_url,
            blog: orgDetails.blog,
            verified: orgDetails.verified || false,
            shared_with_parent: sharedWithParent,
            shared_with_associated: sharedWithAssociated,
          });
        } catch (error) {
          console.error(`Error processing org ${org.login}:`, error);
        }
      }

      setOrganizations(processedOrgs);
      
      toast({
        title: 'Search completed',
        description: `Found ${processedOrgs.length} organizations to analyze.`,
      });
    } catch (error) {
      toast({
        title: 'Search failed',
        description: 'An error occurred while searching organizations.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Associated Organization Finder</h2>
        <p className="text-muted-foreground">
          Discover potentially related GitHub organizations based on shared members and verified domains.
        </p>
      </div>

      {/* Input Section */}
      <Card className="p-4 bg-surface-elevated border-border">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Parent Organization</label>
              <Input
                type="text"
                placeholder="e.g., microsoft"
                value={parentOrg}
                onChange={(e) => setParentOrg(e.target.value)}
                className="bg-input border-border"
              />
              <p className="text-xs text-muted-foreground">The primary, known-official organization</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Search Term</label>
              <Input
                type="text"
                placeholder="e.g., Microsoft"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-input border-border"
              />
              <p className="text-xs text-muted-foreground">Term to search for in organization names</p>
            </div>
          </div>

          <Button 
            onClick={searchOrganizations} 
            disabled={loading || !parentOrg.trim() || !searchTerm.trim()}
            className="w-full"
            variant="github"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? 'Analyzing Organizations...' : 'Find Associated Organizations'}
          </Button>
        </div>
      </Card>

      {/* Results Table */}
      {organizations.length > 0 && (
        <Card className="p-4 bg-surface-elevated border-border">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Analysis Results ({organizations.length} organizations)
            </h3>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Shared with Parent</TableHead>
                    <TableHead>Shared with Associated</TableHead>
                    <TableHead>Domain & Verification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizations.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <a 
                            href={org.html_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
                          >
                            {org.login}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground max-w-xs truncate">
                          {org.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {org.shared_with_parent ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <XCircle className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="text-sm">
                            {org.shared_with_parent ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {org.shared_with_associated ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <XCircle className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="text-sm">
                            {org.shared_with_associated ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {org.blog && (
                            <div className="text-sm text-muted-foreground">
                              {org.blog}
                            </div>
                          )}
                          {org.verified && (
                            <Badge variant="secondary" className="text-xs flex items-center gap-1 w-fit">
                              <Shield className="w-3 h-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      )}

      {/* Info Card */}
      <Card className="p-4 bg-surface border-border">
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">How it works:</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Searches GitHub for all organizations containing your search term</li>
            <li>Checks if each organization shares members with your parent organization</li>
            <li>Identifies verified domains that might indicate official relationships</li>
            <li>Provides insights into potentially related organizational structures</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};