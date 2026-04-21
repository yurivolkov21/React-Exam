import type { FormEvent } from "react";

import { ASSISTANT_HINTS } from "../constants";
import type { AssistantMessage } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AssistantSectionProps = {
  assistantMessages: AssistantMessage[];
  assistantInput: string;
  onAssistantInputChange: (value: string) => void;
  onSubmitAssistantPrompt: (event: FormEvent<HTMLFormElement>) => void;
};

export function AssistantSection({
  assistantMessages,
  assistantInput,
  onAssistantInputChange,
  onSubmitAssistantPrompt,
}: AssistantSectionProps) {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Assistant (Mock Mode)</CardTitle>
          <CardDescription>
            Frontend-only chatbot UI, no AI backend required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 rounded-md border p-3">
            {assistantMessages.map((message) => (
              <div key={message.id} className="space-y-1">
                <Badge
                  variant={message.role === "assistant" ? "secondary" : "outline"}
                >
                  {message.role === "assistant" ? "Assistant" : "You"}
                </Badge>
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
          </div>

          <form onSubmit={onSubmitAssistantPrompt} className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={assistantInput}
              onChange={(event) => onAssistantInputChange(event.target.value)}
              placeholder="Ask the study assistant..."
            />
            <Button type="submit">Send</Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {ASSISTANT_HINTS.map((hint) => (
              <Button
                key={hint}
                size="sm"
                variant="outline"
                onClick={() => onAssistantInputChange(hint)}
              >
                {hint}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
