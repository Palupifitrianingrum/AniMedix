"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CountdownTimerProps {
  initialSeconds?: number;
  variant?: "payment" | "chat";
  onExpire?: () => void;
  className?: string;
}

export default function CountdownTimer({
  initialSeconds = 15 * 60,
  variant = "payment",
  onExpire,
  className,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState(initialSeconds);

  React.useEffect(() => {
    if (timeLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const pad = (num: number) => num.toString().padStart(2, "0");

  const formattedTime =
    variant === "payment"
      ? `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`
      : `${pad(minutes)}:${pad(seconds)}`;

  if (variant === "payment") {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center bg-red-600 text-white font-mono font-bold text-lg px-6 py-2 rounded-md shadow-md tracking-widest select-none",
          className
        )}
      >
        {formattedTime}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center bg-olive-wash border border-olive-base/40 text-olive-dark font-mono font-bold text-base px-4 py-1.5 rounded-xl select-none",
        className
      )}
    >
      {formattedTime}
    </div>
  );
}
