"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handleSignIn, handleSignUp } from "@/actions/auth.actions";
import { useToast } from "@/components/ui/use-toast";
import { Code } from "./code";
import Link from "next/link";

const signupSchema = z
  .object({
    name: z.string().min(5).max(20),
    email: z.string().email(),
    password: z.string().min(8).max(100),
    confirmPassword: z.string().min(8).max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

interface AuthFormProps {
  type: "signup" | "login";
}

type FormData = z.infer<typeof signupSchema> | z.infer<typeof loginSchema>;

export const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(type === "signup" ? signupSchema : loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (type === "signup") {
      console.log("signup");
      try {
        setIsLoading(true);
        const { name, email, password } = data as z.infer<typeof signupSchema>;
        await handleSignUp({ name, email, password });
      } catch (error: any) {
        console.log(error);
        return toast({
          title: error.name,
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    }
    if (type === "login") {
      console.log("login");
      try {
        setIsLoading(true);
        const { email, password } = data as z.infer<typeof loginSchema>;
        await handleSignIn({
          username: email,
          password: password,
        });
        router.push("/");
      } catch (error: any) {
        console.log(error);
        return toast({
          title: error.name,
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="flex justify-end">
        {type === "signup" ? (
          <span>
            <Button>
              <Link href="login">Login</Link>
            </Button>
          </span>
        ) : (
          <span>
            Don't have an account?
            <Button className="ml-2">
              <Link href="signup">Sign Up</Link>
            </Button>
          </span>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit as any)}
          className="space-y-8"
        >
          {type === "signup" && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {type === "signup" && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button type="submit" disabled={isLoading}>
            {type === "signup"
              ? isLoading
                ? "Signing Up..."
                : "Sign Up"
              : isLoading
              ? "Logging In..."
              : "Login"}
          </Button>
          <Code />
        </form>
      </Form>
    </>
  );
};
