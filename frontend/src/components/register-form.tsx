'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const inputClasses = "border-[#0000001a] focus-visible:border-[#0000003a] focus-visible:ring-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)]";
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  // If already authenticated, redirect to blog page
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is already authenticated, redirecting to blog");
      router.push("/blog");
    }
  }, [isAuthenticated, router]);

  // What does e: React.FormEvent do? Explain in detail.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting registration with:", { username, email });
      await register(username, email, password);
      console.log("Registration successful, should redirect to blog");

      // Force navigation to blog
      router.push("/blog");
    } catch (err) {
      console.error("Registration error:", err);

      // Handle specific error messages
      if (err instanceof Error) {
        const errorMessage = err.message.toLowerCase();

        if (errorMessage.includes("username already exists")) {
          setError("This username is already taken. Please choose another one.");

        } else if (errorMessage.includes("email already exists")) {
          setError("This email is already registered. Please use another email or try logging in.");

        } else if (errorMessage.includes("already exists")) {
          // Generic "already exists" error that might be related to username or email
          setError("An account with this username or email already exists. Please try another or login.");

        } else {
          setError(err.message || "Registration failed. Please try again.");
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // User Interface
  return (
    <div className={cn("flex justify-center items-center", className)} {...props}>
      <div className="w-full max-w-md rounded-lg bg-card text-card-foreground shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
        <div className="p-6 flex flex-col gap-6">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold">Create an account</h2>
            <p className="text-sm text-muted-foreground">
              Enter your details below to create your account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                className={inputClasses}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className={inputClasses}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                className={inputClasses}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                className={inputClasses}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              variant="default"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary">
                <u>Sign in</u>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
