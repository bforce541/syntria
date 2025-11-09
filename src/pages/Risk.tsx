import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Risk() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Risk & Compliance</h1>
        <p className="text-muted-foreground">Entity risk scoring and compliance status</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entity List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No entities yet. Complete onboarding to see entities here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
