import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, GitFork, ExternalLink, Calendar, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  topics: string[];
  archived: boolean;
  fork: boolean;
}

export const RepoExplorer = () => {
  const [username, setUsername] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [languageFilter, setLanguageFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('');
  const [starFilter, setStarFilter] = useState('0');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Available options
  const [languages, setLanguages] = useState<string[]>([]);
  const [allTopics, setAllTopics] = useState<string[]>([]);
  
  const { toast } = useToast();

  const fetchRepositories = async () => {
    if (!username.trim()) {
      toast({
        title: 'Username required',
        description: 'Please enter a GitHub username or organization.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      let allRepos: Repository[] = [];
      let page = 1;
      const perPage = 100;

      // Fetch all repositories (paginated)
      while (true) {
        const response = await fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}&sort=full_name`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User or organization not found');
          } else if (response.status === 403) {
            throw new Error('Rate limit exceeded');
          }
          throw new Error('Failed to fetch repositories');
        }

        const repos = await response.json();
        
        if (repos.length === 0) break;
        
        allRepos = [...allRepos, ...repos];
        page++;
        
        // Prevent infinite loops with a reasonable limit
        if (page > 10) break;
      }

      setRepositories(allRepos);
      setFilteredRepos(allRepos);
      
      // Extract unique languages and topics
      const uniqueLanguages = [...new Set(allRepos.map(repo => repo.language).filter(Boolean))];
      const uniqueTopics = [...new Set(allRepos.flatMap(repo => repo.topics || []))];
      
      setLanguages(uniqueLanguages);
      setAllTopics(uniqueTopics);
      
      toast({
        title: 'Repositories loaded',
        description: `Found ${allRepos.length} repositories for ${username}.`,
      });
    } catch (error) {
      toast({
        title: 'Fetch failed',
        description: error instanceof Error ? error.message : 'An error occurred while fetching repositories.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  React.useEffect(() => {
    let filtered = [...repositories];

    // Apply filters
    if (languageFilter !== 'all') {
      filtered = filtered.filter(repo => repo.language === languageFilter);
    }

    if (topicFilter) {
      filtered = filtered.filter(repo => 
        repo.topics?.some(topic => 
          topic.toLowerCase().includes(topicFilter.toLowerCase())
        )
      );
    }

    const minStars = parseInt(starFilter);
    if (minStars > 0) {
      filtered = filtered.filter(repo => repo.stargazers_count >= minStars);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'created':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'updated':
          aValue = new Date(a.updated_at);
          bValue = new Date(b.updated_at);
          break;
        case 'stars':
          aValue = a.stargazers_count;
          bValue = b.stargazers_count;
          break;
        case 'forks':
          aValue = a.forks_count;
          bValue = b.forks_count;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredRepos(filtered);
  }, [repositories, languageFilter, topicFilter, starFilter, sortBy, sortOrder]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Repository Explorer</h2>
        <p className="text-muted-foreground">
          Explore, filter, and sort all repositories for any GitHub user or organization.
        </p>
      </div>

      {/* Search Section */}
      <Card className="p-4 bg-surface-elevated border-border">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">GitHub Username or Organization</label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="e.g., octocat, microsoft, facebook"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-input border-border"
                onKeyPress={(e) => e.key === 'Enter' && fetchRepositories()}
              />
              <Button 
                onClick={fetchRepositories} 
                disabled={loading || !username.trim()}
                variant="github"
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? 'Loading...' : 'Explore'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Filters and Sorting */}
      {repositories.length > 0 && (
        <Card className="p-4 bg-surface-elevated border-border">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <h3 className="font-medium text-foreground">Filters & Sorting</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Language</label>
                <Select value={languageFilter} onValueChange={setLanguageFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Topic Filter</label>
                <Input
                  type="text"
                  placeholder="Filter by topic..."
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Min Stars</label>
                <Select value={starFilter} onValueChange={setStarFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="10">10+</SelectItem>
                    <SelectItem value="100">100+</SelectItem>
                    <SelectItem value="1000">1000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="created">Created Date</SelectItem>
                    <SelectItem value="updated">Updated Date</SelectItem>
                    <SelectItem value="stars">Stars</SelectItem>
                    <SelectItem value="forks">Forks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Order</label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Results</label>
                <div className="h-10 flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">
                  {filteredRepos.length} of {repositories.length}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Results */}
      {filteredRepos.length > 0 && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {filteredRepos.map((repo) => (
              <Card key={repo.id} className="p-4 bg-surface-elevated border-border hover:bg-surface-highlight transition-colors">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">
                          <a 
                            href={repo.html_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                          >
                            {repo.name}
                          </a>
                        </h4>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        {repo.fork && (
                          <Badge variant="outline" className="text-xs">Fork</Badge>
                        )}
                        {repo.archived && (
                          <Badge variant="destructive" className="text-xs">Archived</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {repo.description || 'No description available'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {repo.stargazers_count.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="w-4 h-4" />
                      {repo.forks_count.toLocaleString()}
                    </div>
                    {repo.language && (
                      <Badge variant="outline" className="text-xs">
                        {repo.language}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Updated {formatDate(repo.updated_at)}
                    </div>
                  </div>

                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {repo.topics.slice(0, 8).map((topic) => (
                        <Badge 
                          key={topic} 
                          variant="secondary"
                          className="text-xs"
                        >
                          {topic}
                        </Badge>
                      ))}
                      {repo.topics.length > 8 && (
                        <Badge variant="outline" className="text-xs">
                          +{repo.topics.length - 8} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};