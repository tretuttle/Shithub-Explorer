import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Github } from 'lucide-react';
import '../types/dark-mode-toggle';
import { MultiTopicSearch } from './toolkit/MultiTopicSearch';
import { AssociatedOrgFinder } from './toolkit/AssociatedOrgFinder';
import { RepoExplorer } from './toolkit/RepoExplorer';

type TabType = 'multi-topic' | 'org-finder' | 'repo-explorer';

export const GitHubToolkit = () => {
  const [activeTab, setActiveTab] = useState<TabType>('multi-topic');

  // Set up dark mode toggle integration
  useEffect(() => {
    // Import the dark-mode-toggle web component
    import('dark-mode-toggle');
    
    // Set up event listener for color scheme changes
    const handleColorSchemeChange = (e: CustomEvent) => {
      const isDark = e.detail.colorScheme === 'dark';
      document.documentElement.classList.toggle('dark', isDark);
      document.documentElement.classList.toggle('light', !isDark);
    };

    document.addEventListener('colorschemechange', handleColorSchemeChange as EventListener);
    
    return () => {
      document.removeEventListener('colorschemechange', handleColorSchemeChange as EventListener);
    };
  }, []);

  const tabs = [
    { id: 'multi-topic', label: 'Multi-Topic Search', icon: Github },
    { id: 'org-finder', label: 'Associated Org Finder', icon: Github },
    { id: 'repo-explorer', label: 'Repo Explorer', icon: Github },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'multi-topic':
        return <MultiTopicSearch />;
      case 'org-finder':
        return <AssociatedOrgFinder />;
      case 'repo-explorer':
        return <RepoExplorer />;
      default:
        return <MultiTopicSearch />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg">
                <Github className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">GitHub Advanced Toolkit</h1>
                <p className="text-sm text-muted-foreground">Professional repository exploration tools</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <dark-mode-toggle
                id="github-toolkit-theme-toggle"
                appearance="switch"
                permanent
                light="Light"
                dark="Dark"
                style={{
                  '--dark-mode-toggle-color': 'hsl(var(--foreground))',
                  '--dark-mode-toggle-background-color': 'transparent',
                  '--dark-mode-toggle-active-mode-background-color': 'hsl(var(--accent))',
                  '--dark-mode-toggle-icon-size': '1rem'
                } as React.CSSProperties}
              ></dark-mode-toggle>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex space-x-0">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'tab-active' : 'tab'}
                size="tab"
                onClick={() => setActiveTab(tab.id as TabType)}
                className="flex items-center gap-2"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Card className="p-6 bg-gradient-surface border-border">
          {renderActiveTab()}
        </Card>
      </main>
    </div>
  );
};