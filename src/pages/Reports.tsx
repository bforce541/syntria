import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function Reports() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Generate compliance and operational reports</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <FileText className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Onboarding Summary</CardTitle>
            <CardDescription>Monthly onboarding metrics and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Generate Report</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FileText className="w-8 h-8 text-accent mb-2" />
            <CardTitle>Compliance Gaps</CardTitle>
            <CardDescription>Outstanding compliance issues</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Generate Report</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FileText className="w-8 h-8 text-destructive mb-2" />
            <CardTitle>Decommission SLA</CardTitle>
            <CardDescription>Offboarding timeline analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Generate Report</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
