import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiceCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
}

export function ServiceCard({ name, description, icon: Icon }: ServiceCardProps) {
  return (
    <Card className="group border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
          <Icon className="h-5 w-5" />
        </div>

        <CardTitle className="text-lg font-semibold text-gray-800">
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="text-sm leading-relaxed text-gray-600">
        {description}
      </CardContent>
    </Card>
  );
}