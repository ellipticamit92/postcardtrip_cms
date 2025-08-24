import { FC } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Heading } from "./Heading";

interface APIViewerProps {
  data: any;
  name: string;
}

const APIViewer: FC<APIViewerProps> = ({ data, name }) => {
  return (
    <div>
      <Heading text={`${name} API Viewer`} />
      <ScrollArea className="h-160 w-full rounded-md border p-2">
        <pre className="text-sm whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </ScrollArea>
    </div>
  );
};

export default APIViewer;
