import { MapPin, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { FC } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  btnText?: string;
}

const PageHeader: FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <MapPin className="h-8 w-8 text-primary" />
          {title}
        </h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      <Button
        variant="gradient"
        className="shadow-glow"
        //onClick={() => navigate("/destinations/add")}
      >
        <Plus className="h-4 w-4" />
        Add {title}
      </Button>
    </div>
  );
};

export default PageHeader;
