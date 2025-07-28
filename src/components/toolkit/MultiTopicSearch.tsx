import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, Star, GitFork, ExternalLink, Calendar, Plus, Trash2 } from 'lucide-react';
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [expandedRepos, setExpandedRepos] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  // Load saved topics from localStorage on mount
  useEffect(() => {
    const savedTopics = localStorage.getItem('github-topics-history');
    if (savedTopics) {
      try {
        const topics = JSON.parse(savedTopics);
        // Don't auto-load topics, just keep them available for suggestions
      } catch (error) {
        console.error('Error loading saved topics:', error);
      }
    }
  }, []);

  // Fetch topic suggestions when input is focused and has content
  useEffect(() => {
    if (searchInput.length > 2 && showSuggestions) {
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
  }, [searchInput, showSuggestions]);

  const addTopic = (topic: string) => {
    const trimmedTopic = topic.trim();
    if (trimmedTopic && !selectedTopics.includes(trimmedTopic)) {
      const newTopics = [...selectedTopics, trimmedTopic];
      setSelectedTopics(newTopics);
      setSearchInput('');
      setSuggestedTopics([]);
      setShowSuggestions(false);
      
      // Save to localStorage history
      saveTopicToHistory(trimmedTopic);
      
      // Auto-search when topics are added
      setTimeout(() => searchRepositories(newTopics), 100);
    }
  };

  const addCurrentInput = () => {
    if (searchInput.trim()) {
      addTopic(searchInput);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCurrentInput();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const saveTopicToHistory = (topic: string) => {
    try {
      const savedTopics = localStorage.getItem('github-topics-history');
      const history = savedTopics ? JSON.parse(savedTopics) : [];
      const updatedHistory = [topic, ...history.filter((t: string) => t !== topic)].slice(0, 20);
      localStorage.setItem('github-topics-history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving topic to history:', error);
    }
  };

  const removeTopic = (topic: string) => {
    const newTopics = selectedTopics.filter(t => t !== topic);
    setSelectedTopics(newTopics);
    // Auto-search with remaining topics
    setTimeout(() => searchRepositories(newTopics), 100);
  };

  const clearAllTopics = () => {
    setSelectedTopics([]);
    setRepositories([]);
    setLanguages([]);
  };

  const searchRepositories = async (topicsToSearch: string[] = selectedTopics) => {
    if (topicsToSearch.length === 0) {
      setRepositories([]);
      setLanguages([]);
      return;
    }

    setLoading(true);
    try {
      const topicsQuery = topicsToSearch.map(topic => `topic:${topic}`).join('+');
      const response = await fetch(`https://api.github.com/search/repositories?q=${topicsQuery}&sort=${sortBy}&per_page=50`);
      
      if (response.ok) {
        const data = await response.json();
        setRepositories(data.items);
        
        // Extract unique languages for filtering
        const uniqueLanguages = [...new Set(data.items.map((repo: Repository) => repo.language).filter(Boolean))] as string[];
        setLanguages(uniqueLanguages);
        
        if (data.items.length > 0) {
          toast({
            title: 'Search completed',
            description: `Found ${data.items.length} repositories matching your criteria.`,
          });
        }
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

  const toggleRepoExpansion = (repoId: number) => {
    setExpandedRepos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(repoId)) {
        newSet.delete(repoId);
      } else {
        newSet.add(repoId);
      }
      return newSet;
    });
  };

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
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Add custom topic or search suggestions..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="bg-input border-border"
              />
              {suggestedTopics.length > 0 && showSuggestions && (
                <div className="absolute top-full left-0 right-0 z-10 bg-popover border border-border rounded-md mt-1 max-h-48 overflow-y-auto">
                  {suggestedTopics.map((topic) => (
                    <button
                      key={topic.name}
                      className="w-full text-left px-3 py-2 hover:bg-accent text-foreground"
                      onClick={() => addTopic(topic.name)}
                    >
                      <span className="font-medium">{topic.display_name || topic.name}</span>
                      <span className="text-xs text-muted-foreground block">Suggested</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button 
              onClick={addCurrentInput}
              disabled={!searchInput.trim()}
              variant="outline"
              size="icon"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Selected Topics */}
          <div className="space-y-3">
            {selectedTopics.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Selected Topics ({selectedTopics.length})
                  </span>
                  <Button 
                    onClick={clearAllTopics}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTopics.map((topic) => (
                    <Badge key={topic} variant="default" className="flex items-center gap-1">
                      {topic}
                      <button
                        onClick={() => removeTopic(topic)}
                        className="ml-1 hover:bg-primary-foreground hover:text-primary rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>

          {selectedTopics.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Add topics to start discovering repositories</p>
              <p className="text-xs mt-1">Type any topic name and press Enter or click the + button</p>
            </div>
          )}
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
                      {(expandedRepos.has(repo.id) ? repo.topics : repo.topics.slice(0, 10)).map((topic) => (
                        <Badge 
                          key={topic} 
                          variant={selectedTopics.includes(topic) ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {topic}
                        </Badge>
                      ))}
                      {repo.topics.length > 10 && (
                        <button
                          onClick={() => toggleRepoExpansion(repo.id)}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent">
                            {expandedRepos.has(repo.id) 
                              ? 'Show less' 
                              : `+${repo.topics.length - 10} more`
                            }
                          </Badge>
                        </button>
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