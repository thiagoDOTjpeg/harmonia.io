"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        duration,
        ...props
      }) {
        return (
          <Toast
            key={id}
            duration={duration}
            open={props.open}
            onOpenChange={props.onOpenChange}
            variant={props.variant}
          >
            <div className="flex flex-col w-full overflow-hidden">
              {duration && duration !== Infinity && (
                <ProgressBar duration={duration} />
              )}

              <div className="flex flex-row p-4 items-center gap-3">
                {props.variant === "destructive" && (
                  <svg
                    className="h-5 w-5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2L1 21h22L12 2zm0 4.343L18.667 19H5.333L12 6.343zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" />
                  </svg>
                )}

                {props.variant !== "destructive" && (
                  <svg
                    className="h-5 w-5 shrink-0 text-green-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}

                <div className="flex-1 grid gap-1">
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && (
                    <ToastDescription>{description}</ToastDescription>
                  )}
                </div>
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

function ProgressBar({ duration }: { duration: number }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = 50;
    const decrement = (100 / duration) * interval;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev - decrement;
        return next <= 0 ? 0 : next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  return (
    <div className="h-1 w-full bg-black/10">
      <div
        className="h-full bg-current transition-all duration-75 ease-linear opacity-50"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
