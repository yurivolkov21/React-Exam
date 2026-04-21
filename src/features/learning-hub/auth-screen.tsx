import type { FormEvent } from "react";

import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import { Toaster } from "@/components/ui/sonner";
import type { AuthMode } from "./types";

type AuthScreenProps = {
  authMode: AuthMode;
  authError: string;
  onSwitchAuthMode: (mode: AuthMode) => void;
  onLoginSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSignupSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function AuthScreen({
  authMode,
  authError,
  onSwitchAuthMode,
  onLoginSubmit,
  onSignupSubmit,
}: AuthScreenProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/40 px-4 py-6 sm:px-6">
      <div className="w-full max-w-100">
        {authMode === "login" ? (
          <LoginForm onSubmit={onLoginSubmit} onSwitchToSignup={() => onSwitchAuthMode("signup")} />
        ) : (
          <SignupForm onSubmit={onSignupSubmit} onSwitchToLogin={() => onSwitchAuthMode("login")} />
        )}

        {authError ? <p className="mt-2 text-xs text-destructive sm:text-sm">{authError}</p> : null}
      </div>
      <Toaster richColors />
    </div>
  );
}
