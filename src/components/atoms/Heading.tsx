import React from "react";

export interface HeadingProps {
  text: string;
  subText?: string;
}

export function Heading({ text, subText }: HeadingProps) {
  return (
    <div className="flex items-center gap-2">
      <h2 className="text-xl font-semibold">{text}</h2>
      {subText && <h5 className="text-md italic"> - {subText}</h5>}
    </div>
  );
}
