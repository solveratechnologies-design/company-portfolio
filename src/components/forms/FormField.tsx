import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass = (invalid?: boolean) =>
  cn(
    "w-full rounded-xl border bg-white px-4 py-3 text-[0.98rem] text-ink placeholder:text-ink/40 transition-[border-color,box-shadow] duration-200 outline-none",
    "focus:border-brand focus:ring-4 focus:ring-brand/15",
    invalid ? "border-red-500 focus:border-red-500 focus:ring-red-500/15" : "border-line hover:border-ink/25",
  );

export function FieldShell({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required ? (
          <span className="ml-1 text-red-600" aria-hidden>
            *
          </span>
        ) : (
          <span className="ml-1.5 font-normal text-muted">(optional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-sm text-red-700">
          <span aria-hidden>⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

export function FormField({
  id,
  label,
  required,
  hint,
  error,
  multiline,
  rows,
  ...props
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  multiline?: boolean;
} & ComponentProps<"input"> &
  Pick<ComponentProps<"textarea">, "rows">) {
  const common = {
    id,
    name: id,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy(id, error, hint),
    className: inputClass(Boolean(error)),
  };
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      {multiline ? (
        <textarea {...common} rows={rows ?? 6} placeholder={props.placeholder} maxLength={props.maxLength} defaultValue={props.defaultValue as string} className={cn(common.className, "resize-y")} />
      ) : (
        <input {...props} {...common} />
      )}
    </FieldShell>
  );
}
