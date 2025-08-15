import { ReactNode } from "react";

export const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className="page-container relative h-full flex flex-auto flex-col">
    <div className="h-full bg-white dark:bg-gray-800">
      <div className="container mx-auto flex flex-col items-center justify-center h-full">
        <div className="min-w-[320px] md:min-w-[400px] max-w-[400px] w-full">
          <div className="mb-8">
            <div className="logo mx-auto">LOGO Goes Here...</div>
          </div>
          <div className="mb-10 text-center">
            <h2 className="text-xl font-bold mb-2">Welcome back!</h2>
            <p className="text-muted-foreground">
              Please enter your credentials to sign in!
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  </div>
);
