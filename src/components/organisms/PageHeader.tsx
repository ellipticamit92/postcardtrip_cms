import { AirVent, Plus } from "lucide-react"; // Optional icon for AI button
import { Button } from "../ui/button";
import Link from "next/link";
import { PageHeaderLeft } from "../molecules/PageHeaderLeft";

export interface PageHeaderProps<T = any> {
  title: string;
  description: string;
  btnText?: string;
  Icon?: React.ElementType;
  href?: string;
  modalComponent?: React.ComponentType<T>;
  modalProps?: T;
  aiHref?: string;
  aiBtnText?: string; // optional custom text for AI button
}

const HeaderAction = <T,>({
  title,
  href,
  modalComponent: ModalComponent,
  modalProps,
  btnText,
  aiHref,
  aiBtnText,
}: PageHeaderProps<T>) => {
  return (
    <div className="flex flex-col md:flex-row gap-2">
      {/* Original Button / Modal */}
      {ModalComponent && modalProps ? (
        <ModalComponent {...modalProps} />
      ) : href ? (
        <Link href={href}>
          <Button size="sm" variant="cyan" className="shadow-glow">
            <Plus className="h-4 w-4" />
            {btnText ?? `Add ${title}`}
          </Button>
        </Link>
      ) : null}

      {/* Extra AI Button */}
      {aiHref && (
        <Link href={aiHref}>
          <Button size="sm" variant="cyan" className="shadow-glow">
            <AirVent className="h-4 w-4" />
            {aiBtnText ?? `Generate ${title}`}
          </Button>
        </Link>
      )}
    </div>
  );
};

const PageHeader = <T,>(props: PageHeaderProps<T>) => {
  const { title, description, Icon } = props;
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <PageHeaderLeft title={title} description={description} Icon={Icon} />
      <HeaderAction {...props} />
    </div>
  );
};

export default PageHeader;
