import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { FormInput } from "../atoms/FormInput";

const loginSchema = z.object({
  email: z.string().min(2, "Minimum 6 characters"),
  password: z.string().min(2, "Minimum 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const { email, password } = data;
    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });

    if (res?.error) alert(res.error);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormInput<LoginFormValues>
          name="email"
          control={form.control}
          label="Email"
          placeholder="Enter your email"
          type="email"
        />

        <FormInput<LoginFormValues>
          name="password"
          control={form.control}
          label="Password"
          placeholder="Enter your password"
          type="password"
        />

        <div className="text-right">
          <a
            href="/auth/forgot-password-simple"
            className="text-sm hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <Button type="submit" className="w-full h-12 rounded-xl">
          Sign In
        </Button>
      </form>
    </Form>
  );
};
