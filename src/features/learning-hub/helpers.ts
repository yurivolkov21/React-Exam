import { APP_SECTIONS } from "./constants";
import type { AppSection } from "./types";

export const getId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

export const isAppSection = (value: string): value is AppSection =>
  APP_SECTIONS.includes(value as AppSection);

export const getAssistantReply = (prompt: string) => {
  const normalizedPrompt = prompt.toLowerCase();

  if (normalizedPrompt.includes("react")) {
    return "React tip: review useState/useEffect, render lists with stable keys, and split UI into feature-focused components.";
  }

  if (normalizedPrompt.includes("typescript")) {
    return "TypeScript tip: define data types first, then build UI. Avoid any in reducers and form state.";
  }

  if (
    normalizedPrompt.includes("exam") ||
    normalizedPrompt.includes("test")
  ) {
    return "For frontend exams: lock MVP early, prioritize stable flows, and include empty/error/success states.";
  }

  return "Study tip: split large tasks into 25-40 minute blocks and do them in difficulty order to maintain momentum.";
};
