import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const inputClasses = "border-[#0000001a] focus-visible:border-[#0000003a] focus-visible:ring-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)]";

  return (
    <div className={cn("flex justify-center items-center", className)} {...props}>
      <div className="w-full max-w-md rounded-lg bg-card text-card-foreground shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
        <div className="p-6 flex flex-col gap-6">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold">Login</h2>
            <p className="text-sm text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className={inputClasses}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                className={inputClasses}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-black hover:bg-gray-800/90 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100">
              Login
            </Button>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="text-primary ">
                <u>Sign up</u>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
