import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Target, Search, ListChecks, Megaphone, Zap, Download } from "lucide-react";
import { runStrategyAgent, runResearchAgent, runPlanningAgent } from "@/lib/api";

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

  // Planning inputs
  const [requirements, setRequirements] = useState("");
  const [planningConstraints, setPlanningConstraints] = useState("");

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
      toast({
        title: "Strategy Generated",
        description: "Your product strategy brief is ready",
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

  const handlePlanning = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await runPlanningAgent({
        requirements: requirements.split('\n').filter(Boolean),
        constraints: planningConstraints.split('\n').filter(Boolean),
        sprintLength: 2,
      });
      setResult(response);
      toast({
        title: "Planning Complete",
        description: "Backlog and sprint plan generated",
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
          <TabsTrigger value="planning" className="flex items-center gap-2">
            <ListChecks className="w-4 h-4" />
            Planning
          </TabsTrigger>
          <TabsTrigger value="gtm" className="flex items-center gap-2">
            <Megaphone className="w-4 h-4" />
            GTM
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

        <TabsContent value="planning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Planning Agent</CardTitle>
              <CardDescription>
                Generate user stories, acceptance criteria, and prioritized backlog
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements (one per line)</Label>
                <Textarea
                  id="requirements"
                  placeholder="Users need to export data&#10;Add SSO authentication&#10;Improve dashboard performance"
                  className="min-h-[150px]"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="planning-constraints">Planning Constraints</Label>
                <Textarea
                  id="planning-constraints"
                  placeholder="2-week sprints&#10;3 engineers available&#10;Must ship by end of Q2"
                  value={planningConstraints}
                  onChange={(e) => setPlanningConstraints(e.target.value)}
                />
              </div>

              <Button onClick={handlePlanning} disabled={loading || !requirements}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Generate Plan
              </Button>
            </CardContent>
          </Card>

          {result && activeTab === "planning" && result.data && (
            <Card>
              <CardHeader>
                <CardTitle>Sprint Plan & Backlog</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">User Stories</h3>
                  {result.data.userStories?.map((story: any, idx: number) => (
                    <div key={idx} className="mb-4 p-4 bg-surface-2 rounded-lg">
                      <h4 className="font-medium mb-2">{story.title}</h4>
                      <p className="text-sm mb-2">{story.description}</p>
                      <div className="flex gap-2 mb-2">
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                          {story.priority}
                        </span>
                        <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">
                          {story.effort} points
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Acceptance Criteria:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {story.acceptanceCriteria?.map((criteria: string, i: number) => (
                          <li key={i} className="text-sm">{criteria}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Sprint Allocation</h3>
                  {result.data.sprints?.map((sprint: any, idx: number) => (
                    <div key={idx} className="mb-3 p-3 bg-surface-2 rounded-lg">
                      <h4 className="font-medium mb-1">{sprint.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Stories: {sprint.stories?.join(", ") || "None"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="gtm">
          <Card>
            <CardHeader>
              <CardTitle>GTM Agent</CardTitle>
              <CardDescription>Coming soon - Generate personas, messaging, and launch plans</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>Automation Agent</CardTitle>
              <CardDescription>Coming soon - Sync to Calendar, Notion, and export artifacts</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
