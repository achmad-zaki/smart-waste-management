import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "~/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2e4a21]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-2xl transition-all",
          className
        )}
      >
        <div className="flex items-start justify-between pb-4 border-b border-[#f0f4f2]">
          <div>
            <h3 className="text-lg font-semibold text-[#2e4a21]">{title}</h3>
            {description && (
              <p className="mt-1 text-sm text-[#5d6f66]">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#5d6f66] hover:bg-[#acebd4]/20 hover:text-[#2e4a21] transition-colors"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Tutup</span>
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

