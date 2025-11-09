import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Target, Search, Zap, Download } from "lucide-react";
import { runStrategyAgent, runResearchAgent } from "@/lib/api";

export default function Workbench() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("strategy");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Strategy inputs
  const [market, setMarket] = useState("");
  const [segment, setSegment] = useState("");
  const [goals, setGoals] = useState("");
  const [constraints, setConstraints] = useState("");

  // Research inputs
  const [feedback, setFeedback] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [trends, setTrends] = useState("");


  const handleStrategy = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await runStrategyAgent({
        market,
        segment,
        goals: goals.split('\n').filter(Boolean),
        constraints: constraints.split('\n').filter(Boolean),
      });
      setResult(response);
      
      // Automatically sync to calendar via n8n
      try {
        const syncResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-to-calendar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ strategyData: response.data }),
        });
        
        if (!syncResponse.ok) {
          throw new Error('Sync failed');
        }
        
        const syncData = await syncResponse.json();
        
        toast({
          title: "Strategy Generated & Synced",
          description: `Strategy created and ${syncData?.eventsCount || 0} events sent to your calendar`,
        });
      } catch (syncError: any) {
        console.error('Calendar sync error:', syncError);
        toast({
          title: "Strategy Generated",
          description: "Strategy created but calendar sync failed. Check your n8n webhook.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResearch = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await runResearchAgent({
        feedback,
        competitors: competitors.split('\n').filter(Boolean),
        trends: trends.split('\n').filter(Boolean),
      });
      setResult(response);
      toast({
        title: "Research Complete",
        description: "Insights and themes have been clustered",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualSync = async () => {
    if (!result?.data) {
      toast({
        title: "No Data",
        description: "Run Strategy or Research first to sync results",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const syncResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-to-calendar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ strategyData: result.data }),
      });
      
      if (!syncResponse.ok) {
        throw new Error('Sync failed');
      }
      
      const syncData = await syncResponse.json();
      
      toast({
        title: "Synced to Calendar",
        description: `${syncData?.eventsCount || 0} events sent to your n8n workflow`,
      });
    } catch (error: any) {
      console.error('Calendar sync error:', error);
      toast({
        title: "Sync Failed",
        description: "Check your n8n webhook URL configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">PM Workbench</h1>
          <p className="text-muted-foreground">AI agents for product strategy, research, and planning</p>
        </div>
        {result && (
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full flex flex-wrap">
          <TabsTrigger value="strategy" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Strategy
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Research
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Automation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="strategy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Agent</CardTitle>
              <CardDescription>
                Generate product brief, North Star metrics, and success criteria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="market">Target Market</Label>
                  <Input
                    id="market"
                    placeholder="e.g., Enterprise SaaS"
                    value={market}
                    onChange={(e) => setMarket(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="segment">Customer Segment</Label>
                  <Input
                    id="segment"
                    placeholder="e.g., Mid-market CFOs"
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goals">Goals (one per line)</Label>
                <Textarea
                  id="goals"
                  placeholder="Increase user retention&#10;Reduce time to value&#10;Expand into new verticals"
                  className="min-h-[100px]"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="constraints">Constraints (one per line)</Label>
                <Textarea
                  id="constraints"
                  placeholder="Must comply with SOC 2&#10;Limited engineering resources&#10;Q2 launch deadline"
                  className="min-h-[100px]"
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                />
              </div>

              <Button onClick={handleStrategy} disabled={loading || !market}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Generate Strategy
              </Button>
            </CardContent>
          </Card>

          {result && activeTab === "strategy" && result.data && (
            <Card>
              <CardHeader>
                <CardTitle>Product Strategy Brief</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">North Star</h3>
                  <p className="text-foreground">{result.data.northStar}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Ideal Customer Profiles (ICPs)</h3>
                  {result.data.icps?.map((icp: any, idx: number) => (
                    <div key={idx} className="mb-4 p-4 bg-surface-2 rounded-lg">
                      <h4 className="font-medium mb-2">{icp.segment}</h4>
                      <p className="text-sm text-muted-foreground mb-2">Pain Points:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {icp.painPoints?.map((pain: string, i: number) => (
                          <li key={i} className="text-sm">{pain}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Success Metrics</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {result.data.successMetrics?.map((metric: string, idx: number) => (
                      <li key={idx}>{metric}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Constraints</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {result.data.constraints?.map((constraint: string, idx: number) => (
                      <li key={idx}>{constraint}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Product Requirements Document</h3>
                  <pre className="text-sm bg-surface-2 p-4 rounded-lg whitespace-pre-wrap">
                    {result.data.prd}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="research" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Research Agent</CardTitle>
              <CardDescription>
                Synthesize feedback, cluster themes, and identify opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feedback">User Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Paste user feedback, survey responses, or interview notes..."
                  className="min-h-[150px]"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="competitors">Competitors (one per line)</Label>
                <Textarea
                  id="competitors"
                  placeholder="Competitor A&#10;Competitor B&#10;Competitor C"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trends">Market Trends (one per line)</Label>
                <Textarea
                  id="trends"
                  placeholder="AI automation increasing&#10;Remote work tools growing&#10;Privacy regulations tightening"
                  value={trends}
                  onChange={(e) => setTrends(e.target.value)}
                />
              </div>

              <Button onClick={handleResearch} disabled={loading || !feedback}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Analyze Research
              </Button>
            </CardContent>
          </Card>

          {result && activeTab === "research" && result.data && (
            <Card>
              <CardHeader>
                <CardTitle>Research Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Key Themes</h3>
                  {result.data.themes?.map((theme: any, idx: number) => (
                    <div key={idx} className="mb-4 p-4 bg-surface-2 rounded-lg">
                      <h4 className="font-medium mb-2">{theme.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">Supporting Feedback:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {theme.examples?.map((example: string, i: number) => (
                          <li key={i} className="text-sm">{example}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Opportunities</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {result.data.opportunities?.map((opp: string, idx: number) => (
                      <li key={idx}>{opp}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Competitive Insights</h3>
                  <p className="text-foreground whitespace-pre-wrap">{result.data.competitive}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation</CardTitle>
              <CardDescription>
                Sync your PM artifacts to external tools via n8n webhook
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-surface-2 rounded-lg">
                <h4 className="font-medium mb-2">Auto-Sync Enabled</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Strategy deliverables automatically sync to your n8n workflow when generated.
                </p>
                <p className="text-sm text-muted-foreground">
                  You can also manually trigger a sync below for any current results.
                </p>
              </div>

              <Button 
                onClick={handleManualSync} 
                disabled={loading || !result}
                className="w-full"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Zap className="w-4 h-4 mr-2" />
                Sync to Calendar Now
              </Button>

              {!result && (
                <p className="text-sm text-muted-foreground text-center">
                  Run Strategy or Research first to enable manual sync.
                </p>
              )}

              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <h4 className="font-medium mb-2 text-sm">Configuration</h4>
                <p className="text-xs text-muted-foreground">
                  Your n8n webhook URL is securely stored. Events will be sent as JSON with deliverables and dates.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
