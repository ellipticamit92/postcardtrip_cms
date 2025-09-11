import { Heading } from "@/components/atoms/Heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FC } from "react";

interface APIViewerProps {
  data: any;
  name: string;
}

const APIViewer: FC<APIViewerProps> = ({ data, name }) => {
  return (
    <div>
      <Heading href="/" text={`${name} API Viewer`} />
      <ScrollArea className="h-160 w-full rounded-md border p-2">
        <pre className="text-sm whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </ScrollArea>
    </div>
  );
};

export default APIViewer;
