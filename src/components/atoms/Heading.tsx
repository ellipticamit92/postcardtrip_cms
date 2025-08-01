import React from "react";

export interface HeadingProps {
  text: string;
}

export function Heading({ text }: HeadingProps) {
  return <h2 className="text-xl font-semibold mt-5">{text}</h2>;
}
