import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const FormSection = ({
  title,
  icon,
  children,
  className,
}: FormSectionProps) => {
  return (
    <div
      className={`p-4 px-5 bg-white rounded-2xl shadow-md border border-gray-100 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        {icon && <span className="text-blue-500">{icon}</span>} {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
