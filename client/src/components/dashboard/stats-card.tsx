import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  valueColor?: string;
  bgColor?: string;
  subtitle?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = "text-mia-navy",
  valueColor = "text-mia-navy",
  bgColor = "bg-mia-navy/10",
  subtitle 
}: StatsCardProps) {
  return (
    <Card className="border-mia-pink/20 hover:shadow-lg transition-shadow duration-200 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-mia-navy/70">{title}</p>
            <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
            {subtitle && <p className="text-xs text-mia-navy/50">{subtitle}</p>}
          </div>
          <div className={`${bgColor} rounded-xl p-3`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
