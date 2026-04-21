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

type SignupFormProps = React.ComponentProps<"form"> & {
  onSwitchToLogin?: () => void
}

export function SignupForm({
  className,
  onSwitchToLogin,
  ...props
}: SignupFormProps) {
  return (
    <Card className={className}>
      <CardHeader className="space-y-1 p-4 pb-3 sm:p-5 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl">Create an account</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Enter your information below to create your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
        <form className="space-y-4" {...props}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" name="name" type="text" placeholder="John Doe" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              <FieldDescription className="text-xs sm:text-sm">
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" name="password" type="password" required />
              <FieldDescription className="text-xs sm:text-sm">
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" name="confirmPassword" type="password" required />
              <FieldDescription className="text-xs sm:text-sm">Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" className="h-9 text-sm sm:h-10">Create Account</Button>
                <Button variant="outline" type="button" className="h-9 text-sm sm:h-10">
                  Sign up with Google
                </Button>
                <FieldDescription className="px-2 text-center text-xs sm:px-6 sm:text-sm">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="underline underline-offset-4"
                  >
                    Sign in
                  </button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
