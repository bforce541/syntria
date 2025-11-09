import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Audit() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Audit Trail</h1>
        <p className="text-muted-foreground">Immutable event log for compliance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No audit events yet</p>
        </CardContent>
      </Card>
    </div>
  );
}
