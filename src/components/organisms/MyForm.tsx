import { FC, ReactNode } from "react";

interface MyFormProps {
  children: ReactNode;
  title?: string;
}

const MyForm: FC<MyFormProps> = ({ children }) => {
  return <div className="w-full ">{children}</div>;
};

export default MyForm;
