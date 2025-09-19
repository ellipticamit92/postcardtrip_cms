import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageHeaderLeft } from "../molecules/PageHeaderLeft";

export interface HeadingProps {
  text: string;
  subText?: string;
  href: string;
  Icon?: React.ElementType;
}

export function Heading({ text, subText, href, Icon }: HeadingProps) {
  return (
    <>
      <div className="flex items-center gap-4 mb-2">
        <Link href={href}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <PageHeaderLeft title={text} description={subText ?? ""} Icon={Icon} />
      </div>
    </>
  );
}
