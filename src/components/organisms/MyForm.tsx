import { FC, ReactNode } from "react";

interface MyFormProps {
  children: ReactNode;
  title?: string;
}

const MyForm: FC<MyFormProps> = ({ children, title = "Basic Information" }) => {
  return (
    <div className="w-full bg-white p-3">
      <h1 className="text-xl font-bold mb-5">{title}</h1>
      {children}
    </div>
  );
};

export default MyForm;
