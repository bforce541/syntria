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
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
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

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Strategy Output</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-surface-2 p-4 rounded-lg overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
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

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Research Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-surface-2 p-4 rounded-lg overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
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

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Planning Output</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-surface-2 p-4 rounded-lg overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
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
