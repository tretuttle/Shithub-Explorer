import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Github } from 'lucide-react';
import { MultiTopicSearch } from './toolkit/MultiTopicSearch';
import { AssociatedOrgFinder } from './toolkit/AssociatedOrgFinder';
import { RepoExplorer } from './toolkit/RepoExplorer';
import { CustomThemeToggle } from './ui/custom-theme-toggle';

type TabType = 'multi-topic' | 'org-finder' | 'repo-explorer';

export const GitHubToolkit = () => {
  const [activeTab, setActiveTab] = useState<TabType>('multi-topic');

  // Just import dark-mode-toggle for any dependencies but let CustomThemeToggle handle theme switching
  useEffect(() => {
    import('dark-mode-toggle');
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
              <CustomThemeToggle />
              {/* Hidden dark-mode-toggle for logic only */}
              <dark-mode-toggle
                id="github-toolkit-theme-toggle"
                appearance="switch"
                permanent
                light="Light"
                dark="Dark"
                style={{
                  display: 'none'
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