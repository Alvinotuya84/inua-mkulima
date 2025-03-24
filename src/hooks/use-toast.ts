import * as React from "react";
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

type ToastActionElement = React.ReactElement;

export type { ToastProps, ToastActionElement };

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type Toast = Omit<ToasterToast, "id">;

function toast({ title, description, action, variant = "default" }: Toast) {
  const id = genId();

  const options: any = {
    id,
    className: variant === "destructive" ? "destructive" : "default",
  };

  if (action) {
    options.action = action;
  }

  // Add the toast via Sonner
  if (title && description) {
    sonnerToast(title, {
      description,
      ...options,
    });
  } else if (title) {
    sonnerToast(title, options);
  } else if (description) {
    sonnerToast(description, options);
  }

  const update = (props: Partial<ToasterToast>) => {
    // Sonner doesn't support direct update, so we dismiss and re-create
    sonnerToast.dismiss(id);
    toast({
      ...props,
      title: props.title || title,
      description: props.description || description,
    });
  };

  const dismiss = () => sonnerToast.dismiss(id);

  return {
    id,
    dismiss,
    update,
  };
}

function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        sonnerToast.dismiss(toastId);
      } else {
        sonnerToast.dismiss();
      }
    },
  };
}

export { useToast, toast };
