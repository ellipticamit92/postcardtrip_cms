import React from "react";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full p-8 bg-white rounded-lg shadow-md mt-10">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Settings</h1>
          <p className="text-gray-700">
            Settings content will appear here. Manage your account and
            preferences.
          </p>
        </div>
      </div>
    </div>
  );
}
