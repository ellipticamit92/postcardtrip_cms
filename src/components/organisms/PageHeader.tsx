import { Plus } from "lucide-react";
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
}

const HeaderAction = <T,>({
  title,
  href,
  modalComponent: ModalComponent,
  modalProps,
  btnText,
}: PageHeaderProps<T>) => {
  if (ModalComponent && modalProps) {
    return <ModalComponent {...modalProps} />;
  }

  if (href) {
    return (
      <Link href={href}>
        <Button variant="gradient" className="shadow-glow">
          <Plus className="h-4 w-4" />
          {btnText ?? `Add ${title}`}
        </Button>
      </Link>
    );
  }

  return null;
};

const PageHeader = <T,>(props: PageHeaderProps<T>) => {
  const { title, description, Icon } = props;
  return (
    <div className="flex items-center justify-between">
      <PageHeaderLeft title={title} description={description} Icon={Icon} />
      <HeaderAction {...props} />
    </div>
  );
};

export default PageHeader;
