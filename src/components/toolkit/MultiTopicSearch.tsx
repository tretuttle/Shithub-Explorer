import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, Star, GitFork, ExternalLink, Calendar } from 'lucide-react';
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
  updated_at: string;
  topics: string[];
}

interface GitHubTopic {
  name: string;
  display_name?: string;
}

export const MultiTopicSearch = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [suggestedTopics, setSuggestedTopics] = useState<GitHubTopic[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('stars');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [languages, setLanguages] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch topic suggestions as user types
  useEffect(() => {
    if (searchInput.length > 2) {
      const timeoutId = setTimeout(async () => {
        try {
          const response = await fetch(`https://api.github.com/search/topics?q=${encodeURIComponent(searchInput)}`);
          if (response.ok) {
            const data = await response.json();
            setSuggestedTopics(data.items.slice(0, 10));
          }
        } catch (error) {
          console.error('Error fetching topics:', error);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSuggestedTopics([]);
    }
  }, [searchInput]);

  const addTopic = (topic: string) => {
    if (!selectedTopics.includes(topic)) {
      setSelectedTopics([...selectedTopics, topic]);
      setSearchInput('');
      setSuggestedTopics([]);
    }
  };

  const removeTopic = (topic: string) => {
    setSelectedTopics(selectedTopics.filter(t => t !== topic));
  };

  const searchRepositories = async () => {
    if (selectedTopics.length === 0) {
      toast({
        title: 'No topics selected',
        description: 'Please select at least one topic to search.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const topicsQuery = selectedTopics.map(topic => `topic:${topic}`).join('+');
      const response = await fetch(`https://api.github.com/search/repositories?q=${topicsQuery}&sort=${sortBy}&per_page=50`);
      
      if (response.ok) {
        const data = await response.json();
        setRepositories(data.items);
        
        // Extract unique languages for filtering
        const uniqueLanguages = [...new Set(data.items.map((repo: Repository) => repo.language).filter(Boolean))] as string[];
        setLanguages(uniqueLanguages);
        
        toast({
          title: 'Search completed',
          description: `Found ${data.items.length} repositories matching your criteria.`,
        });
      } else if (response.status === 403) {
        toast({
          title: 'Rate limit exceeded',
          description: 'GitHub API rate limit reached. Please try again later.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Search failed',
        description: 'An error occurred while searching repositories.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRepositories = repositories.filter(repo => 
    languageFilter === 'all' || repo.language === languageFilter
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Multi-Topic Repository Search</h2>
        <p className="text-muted-foreground">
          Find repositories that match multiple topics simultaneously for more precise discovery.
        </p>
      </div>

      {/* Topic Input Section */}
      <Card className="p-4 bg-surface-elevated border-border">
        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Type to search for topics..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-input border-border"
            />
            {suggestedTopics.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 bg-popover border border-border rounded-md mt-1 max-h-48 overflow-y-auto">
                {suggestedTopics.map((topic) => (
                  <button
                    key={topic.name}
                    className="w-full text-left px-3 py-2 hover:bg-accent text-foreground"
                    onClick={() => addTopic(topic.name)}
                  >
                    {topic.display_name || topic.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Topics */}
          {selectedTopics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTopics.map((topic) => (
                <Badge key={topic} variant="secondary" className="flex items-center gap-1">
                  {topic}
                  <button
                    onClick={() => removeTopic(topic)}
                    className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <Button 
            onClick={searchRepositories} 
            disabled={loading || selectedTopics.length === 0}
            className="w-full"
            variant="github"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? 'Searching...' : 'Search Repositories'}
          </Button>
        </div>
      </Card>

      {/* Filters and Sort */}
      {repositories.length > 0 && (
        <Card className="p-4 bg-surface-elevated border-border">
          <div className="flex gap-4 flex-wrap">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sort by:</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stars">Stars</SelectItem>
                  <SelectItem value="forks">Forks</SelectItem>
                  <SelectItem value="updated">Last Updated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Language:</label>
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger className="w-40">
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
          </div>
        </Card>
      )}

      {/* Results */}
      {filteredRepositories.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Found {filteredRepositories.length} repositories
          </h3>
          
          <div className="grid gap-4">
            {filteredRepositories.map((repo) => (
              <Card key={repo.id} className="p-4 bg-surface-elevated border-border hover:bg-surface-highlight transition-colors">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <a 
                          href={repo.html_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          {repo.full_name}
                        </a>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {repo.description || 'No description available'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                      {repo.topics.slice(0, 10).map((topic) => (
                        <Badge 
                          key={topic} 
                          variant={selectedTopics.includes(topic) ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {topic}
                        </Badge>
                      ))}
                      {repo.topics.length > 10 && (
                        <Badge variant="outline" className="text-xs">
                          +{repo.topics.length - 10} more
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