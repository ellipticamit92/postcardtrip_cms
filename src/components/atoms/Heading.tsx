import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export interface HeadingProps {
  text: string;
  subText?: string;
  href: string;
}

export function Heading({ text, subText, href }: HeadingProps) {
  return (
    <>
      <div className="flex items-center gap-4">
        <Link href={href}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          {/* <MapPin className="h-6 w-6 text-primary" /> */}
          <div className="text-2xl font-bold flex gap-2 items-end">
            <h2 className="text-xl font-semibold">{text}</h2>
            {subText && <h5 className="text-sm"> - {subText}</h5>}
          </div>
        </div>
      </div>
    </>
  );
}
