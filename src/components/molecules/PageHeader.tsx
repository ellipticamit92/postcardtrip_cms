import { MapPin, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { FC, ReactNode } from "react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description: string;
  btnText?: string;
  Icon: React.ElementType;
  href: string;
}

const PageHeader: FC<PageHeaderProps> = ({
  title,
  description,
  Icon,
  href,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Icon className="h-8 w-8 text-primary" />
          {title}
        </h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      <Link href={href}>
        <Button variant="gradient" className="shadow-glow">
          <Plus className="h-4 w-4" />
          Add {title}
        </Button>
      </Link>
    </div>
  );
};

export default PageHeader;
