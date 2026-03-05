import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DoctorCardProps {
  name: string;
  specialization: string;
  experienceYears: number;
  email?: string;
}

export function DoctorCard({ name, specialization, experienceYears, email }: DoctorCardProps) {
  return (
    <Card className="overflow-hidden border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500" />

      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-1 text-sm text-gray-600">
        <p className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
          {specialization}
        </p>

        <p>{experienceYears} years experience</p>

        {email ? (
          <p className="text-gray-500">{email}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}