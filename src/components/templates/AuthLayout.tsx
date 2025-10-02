import { ReactNode } from "react";

export const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
    {/* Background Accent */}
    <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-10">
      <div className="h-[400px] w-[400px] rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-3xl" />
    </div>

    <div className="mx-auto w-[500px] rounded-2xl border border-gray-200 bg-white/80 shadow-2xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      <div className="flex flex-col items-center justify-center p-8 sm:p-10">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            🌍 TRAVEL AGNECY CMS
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back 👋
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please enter your credentials to sign in
          </p>
        </div>
        {children}
      </div>
    </div>
  </div>
);
