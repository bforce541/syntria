import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Target, Search, ListChecks, Megaphone, Zap, Download } from "lucide-react";
import { runStrategyAgent, runResearchAgent, runPlanningAgent, runGTMAgent, createCalendarEvents, syncToNotion } from "@/lib/api";

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

  // GTM inputs
  const [product, setProduct] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [valueProps, setValueProps] = useState("");
  const [gtmCompetitors, setGtmCompetitors] = useState("");
  const [timeline, setTimeline] = useState("");

  // Automation inputs
  const [automationType, setAutomationType] = useState<"calendar" | "notion">("calendar");
  const [notionWorkspace, setNotionWorkspace] = useState("");
  const [notionPage, setNotionPage] = useState("");

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

  const handleGTM = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await runGTMAgent({
        product,
        targetAudience,
        valueProps: valueProps.split('\n').filter(Boolean),
        competitors: gtmCompetitors.split('\n').filter(Boolean),
        timeline,
      });
      setResult(response);
      toast({
        title: "GTM Strategy Generated",
        description: "Personas, messaging, and launch plan ready",
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

  const handleAutomation = async () => {
    setLoading(true);
    try {
      if (automationType === "calendar") {
        const events = result?.data?.sprints?.map((sprint: any) => ({
          title: sprint.name,
          date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        })) || [];
        
        const response = await createCalendarEvents(events);
        toast({
          title: "Calendar Updated",
          description: response.data.message,
        });
      } else {
        const response = await syncToNotion({
          content: result?.data,
          workspace: notionWorkspace,
          page: notionPage,
        });
        toast({
          title: "Synced to Notion",
          description: response.data.message,
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

        <TabsContent value="gtm" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>GTM Agent</CardTitle>
              <CardDescription>
                Generate personas, positioning, messaging, and go-to-market launch plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Product Name</Label>
                  <Input
                    id="product"
                    placeholder="e.g., Syntria PM Suite"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-audience">Target Audience</Label>
                  <Input
                    id="target-audience"
                    placeholder="e.g., Enterprise Product Teams"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value-props">Value Propositions (one per line)</Label>
                <Textarea
                  id="value-props"
                  placeholder="Save 10+ hours per week&#10;Integrate in minutes&#10;Enterprise-grade security"
                  className="min-h-[100px]"
                  value={valueProps}
                  onChange={(e) => setValueProps(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gtm-competitors">Competitors (one per line)</Label>
                <Textarea
                  id="gtm-competitors"
                  placeholder="Competitor A&#10;Competitor B"
                  value={gtmCompetitors}
                  onChange={(e) => setGtmCompetitors(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Launch Timeline</Label>
                <Input
                  id="timeline"
                  placeholder="e.g., 4 weeks"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                />
              </div>

              <Button onClick={handleGTM} disabled={loading || !product}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Generate GTM Strategy
              </Button>
            </CardContent>
          </Card>

          {result && activeTab === "gtm" && result.data && (
            <Card>
              <CardHeader>
                <CardTitle>Go-To-Market Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Target Personas</h3>
                  {result.data.personas?.map((persona: any, idx: number) => (
                    <div key={idx} className="mb-4 p-4 bg-surface-2 rounded-lg">
                      <h4 className="font-medium mb-1">{persona.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{persona.role}</p>
                      
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="font-medium mb-1">Goals:</p>
                          <ul className="list-disc list-inside space-y-0.5">
                            {persona.goals?.map((goal: string, i: number) => (
                              <li key={i}>{goal}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Pain Points:</p>
                          <ul className="list-disc list-inside space-y-0.5">
                            {persona.painPoints?.map((pain: string, i: number) => (
                              <li key={i}>{pain}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-2">
                        <p className="font-medium text-sm mb-1">Channels:</p>
                        <div className="flex flex-wrap gap-1">
                          {persona.channels?.map((channel: string, i: number) => (
                            <span key={i} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                              {channel}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Positioning & Messaging</h3>
                  <div className="p-4 bg-surface-2 rounded-lg space-y-3">
                    <div>
                      <p className="font-medium mb-1">Headline:</p>
                      <p className="text-foreground">{result.data.positioning?.headline}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Tagline:</p>
                      <p className="text-muted-foreground">{result.data.positioning?.tagline}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Key Messages:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {result.data.positioning?.keyMessages?.map((msg: string, i: number) => (
                          <li key={i}>{msg}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Launch Plan</h3>
                  <p className="text-sm text-muted-foreground mb-3">Timeline: {result.data.launchPlan?.timeline}</p>
                  {result.data.launchPlan?.phases?.map((phase: any, idx: number) => (
                    <div key={idx} className="mb-3 p-4 bg-surface-2 rounded-lg">
                      <h4 className="font-medium mb-2">{phase.name}</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {phase.activities?.map((activity: string, i: number) => (
                          <li key={i}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Marketing Channels</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {result.data.channels?.map((channel: any, idx: number) => (
                      <div key={idx} className="p-3 bg-surface-2 rounded-lg">
                        <h4 className="font-medium mb-1">{channel.name}</h4>
                        <p className="text-sm text-muted-foreground mb-1">Budget: {channel.budget}</p>
                        <p className="text-sm">Expected: {channel.expected}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Competitive Positioning</h3>
                  <p className="text-foreground p-4 bg-surface-2 rounded-lg">
                    {result.data.competitivePosition}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation Agent</CardTitle>
              <CardDescription>
                Export and sync your PM artifacts to Calendar and Notion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Automation Type</Label>
                <div className="flex gap-4">
                  <Button
                    variant={automationType === "calendar" ? "default" : "outline"}
                    onClick={() => setAutomationType("calendar")}
                    className="flex-1"
                  >
                    Calendar Sync
                  </Button>
                  <Button
                    variant={automationType === "notion" ? "default" : "outline"}
                    onClick={() => setAutomationType("notion")}
                    className="flex-1"
                  >
                    Notion Export
                  </Button>
                </div>
              </div>

              {automationType === "notion" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="notion-workspace">Notion Workspace</Label>
                    <Input
                      id="notion-workspace"
                      placeholder="My Workspace"
                      value={notionWorkspace}
                      onChange={(e) => setNotionWorkspace(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notion-page">Parent Page (Optional)</Label>
                    <Input
                      id="notion-page"
                      placeholder="PM Docs"
                      value={notionPage}
                      onChange={(e) => setNotionPage(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="p-4 bg-surface-2 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {automationType === "calendar" 
                    ? "This will create calendar events for sprint milestones from your Planning results."
                    : "This will export your current workbench results to a Notion page."}
                </p>
              </div>

              <Button onClick={handleAutomation} disabled={loading || !result}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {automationType === "calendar" ? "Create Calendar Events" : "Export to Notion"}
              </Button>

              {!result && (
                <p className="text-sm text-muted-foreground">
                  Run a Strategy, Research, or Planning agent first to enable automation.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
