"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts?.map(function (_toast, index, toasterToasts, ...props) {
        return (
          <Toast key={toasterToasts[index]?.id} {...props}>
            <div className="grid gap-1">
              {toasterToasts[index]?.title && (
                <ToastTitle>{toasterToasts[index]?.title}</ToastTitle>
              )}
              {toasterToasts[index]?.description && (
                <ToastDescription>
                  {toasterToasts[index]?.description}
                </ToastDescription>
              )}
            </div>
            {toasterToasts[index]?.action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
