import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DoctorCardProps {
  name: string;
  specialization: string;
  experienceYears: number;
  email?: string;
}

export function DoctorCard({ name, specialization, experienceYears, email }: DoctorCardProps) {
  return (
    <Card className="overflow-hidden border-border/70 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500" />
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>{specialization}</p>
        <p>{experienceYears} years experience</p>
        {email ? <p>{email}</p> : null}
      </CardContent>
    </Card>
  );
}
