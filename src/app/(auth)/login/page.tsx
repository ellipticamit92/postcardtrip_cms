"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });

    if (res?.error) alert(res.error);
  };

  return (

      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex flex-col md:flex-row">
          <div className="w-3/5 border-r-2">
            <div className="p-10">
              <div className="flex">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={160}
                  height={160}
                  className="object-contain mb-4"
                />
              </div>
              <div className="mb-8">
                <h3 className="text-2xl">Sign in</h3>
                <h6>to access your account</h6>
              </div>
              <div className="flex flex-col gap-2">
                <input
                  className="border p-2 w-full mb-4"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="border p-2 w-full mb-4"
                  placeholder="Password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="bg-blue-500 text-white p-2 w-full" onClick={handleLogin}>
                  Sign In
                </button>
              </div>
            </div>
          </div>
          <div className="w-2/5 flex flex-col items-center justify-center">
            <div className="p-4">
              <Image
                src="/crmright.jpg"
                alt="Logo"
                width={160}
                height={160}
                className="object-contain mb-4"
              />
            </div>
          </div>
        </div>
      </div>

  );
}
