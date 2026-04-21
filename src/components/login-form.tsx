import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type LoginFormProps = React.ComponentProps<"form"> & {
  onSwitchToSignup?: () => void
}

export function LoginForm({
  className,
  onSwitchToSignup,
  ...props
}: LoginFormProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="space-y-1 p-4 pb-3 sm:p-5 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl">Login to your account</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Enter your email below to log in to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
        <form className="space-y-4" {...props}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <a
                  href="#"
                  className="ml-auto inline-block text-xs underline-offset-4 hover:underline sm:text-sm"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" name="password" type="password" required />
            </Field>
            <Field>
              <Button type="submit" className="h-9 text-sm sm:h-10">Login</Button>
              <Button variant="outline" type="button" className="h-9 text-sm sm:h-10">
                Login with Google
              </Button>
              <FieldDescription className="text-center text-xs sm:text-sm">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="underline underline-offset-4"
                >
                  Sign up
                </button>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
