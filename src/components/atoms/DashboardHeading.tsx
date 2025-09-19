import { Badge } from "../ui/badge";
import { ElementType } from "react";

interface DashboardHeadingProps {
  icon: ElementType;
  title: string;
  description: string;
  badgeClass: string;
  badgeText: string;
  iconClass?: string;
}

const DashboardHeading = ({
  icon: Icon,
  title,
  description,
  badgeClass,
  badgeText,
  iconClass = "bg-gradient-to-br from-green-500 to-emerald-600",
}: DashboardHeadingProps) => {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClass}`}
        >
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 text-xs">{description}</p>
        </div>
      </div>
      <Badge variant="secondary" className={`${badgeClass} border-0`}>
        {badgeText}
      </Badge>
    </div>
  );
};

export default DashboardHeading;
