import { FC } from "react";
import { PageHeaderProps } from "../organisms/PageHeader";

export const PageHeaderLeft: FC<
  Pick<PageHeaderProps, "title" | "description" | "Icon">
> = ({ title, description, Icon }) => (
  <div>
    <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
      {Icon && <Icon className="h-7 w-7 text-primary" />}
      {title}
    </h1>
    {description && (
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    )}
  </div>
);
