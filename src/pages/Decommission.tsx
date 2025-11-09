import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Decommission() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Decommission Center</h1>
        <p className="text-muted-foreground">Secure vendor and client offboarding</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Decommission Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No candidates found</p>
        </CardContent>
      </Card>
    </div>
  );
}
