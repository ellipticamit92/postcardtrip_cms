"use client";
import { Editor } from "@tinymce/tinymce-react";
import { useState, useEffect } from "react";

interface TinyMCEEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  height?: number;
  placeholder?: string;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  content = "",
  onChange,
  height = 400,
  placeholder = "Start writing...",
}) => {
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="border rounded-md p-4 min-h-[200px] bg-gray-50">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    );
  }

  return (
    <Editor
      apiKey="ht5b3o09xvo44744yk8nop3iwlmpwts6nt0wjtkl7p4i3434"
      value={content}
      onEditorChange={(content: string) => onChange?.(content)}
      init={{
        height,
        menubar: true,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        content_style: `
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; 
            font-size: 14px;
            line-height: 1.6;
            padding: 10px;
          }
        `,
        placeholder,
        branding: false, // Remove "Powered by TinyMCE" if you have a paid plan
      }}
    />
  );
};

export default TinyMCEEditor;
