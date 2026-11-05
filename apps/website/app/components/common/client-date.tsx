import React, { useState, useEffect } from "react";

interface ClientDateProps {
  date: string | number | Date | null | undefined;
  format?: "date" | "datetime" | "time";
  fallback?: string;
  className?: string;
}

/**
 * ClientDate safely formats date/time strings on the client without causing
 * SSR hydration mismatch errors between server timezone/locale and browser client.
 */
export function ClientDate({
  date,
  format = "datetime",
  fallback = "-",
  className,
}: ClientDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!date) {
    return <span className={className}>{fallback}</span>;
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return <span className={className}>{fallback}</span>;
  }

  // Consistent static date during SSR to match the initial client hydration
  if (!mounted) {
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return (
      <span suppressHydrationWarning className={className}>
        {`${day}/${month}/${year}`}
      </span>
    );
  }

  let formatted = "";
  if (format === "date") {
    formatted = d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } else if (format === "time") {
    formatted = d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    formatted = d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <span suppressHydrationWarning className={className}>
      {formatted}
    </span>
  );
}

