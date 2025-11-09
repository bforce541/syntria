import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Onboarding() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Onboarding Hub</h1>
        <p className="text-muted-foreground">Vendor and client onboarding with AI risk scoring</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Onboarding</CardTitle>
          <CardDescription>4-step wizard with automated risk assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Start New Onboarding</Button>
        </CardContent>
      </Card>
    </div>
  );
}
