import { Link } from "react-router";
import { ChevronRight, Close } from "@/components/icons";
import { alertOnTruncatedPaste, cn } from "@/lib";

const BUTTON_VARIANT = {
  primary: "bg-brand text-white",
  secondary: "border border-solid border-ink text-ink",
  subtle: "bg-brand-soft text-brand",
  dark: "bg-ink text-white",
};

const BUTTON_SIZE = {
  block:
    "text-20 h-[66px] gap-[10px] rounded-[59px] px-[16px] py-[14px] font-medium",
  inline: "text-20 gap-[12px] rounded-[33px] px-[18px] py-[14px] font-semibold",
  action: "text-18 gap-[10px] rounded-[8px] px-[24px] py-[12px] font-semibold",
  pill: "text-16 h-[44px] gap-[6px] rounded-[59px] px-[16px] py-[14px] font-medium",
  pillCompact:
    "text-16 h-[44px] gap-[6px] rounded-[59px] px-[12px] py-[14px] font-medium",
};

export function Button({
  variant = "primary",
  size = "block",
  className,
  children,
  ...props
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex cursor-pointer items-center justify-center overflow-clip whitespace-nowrap",
        "transition-[translate,box-shadow,opacity] duration-150",
        "enabled:hover:-translate-y-px enabled:hover:shadow-[0_4px_10px_0_rgba(0,0,0,0.12)]",
        "enabled:active:translate-y-0 enabled:active:shadow-none",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        "disabled:cursor-not-allowed disabled:opacity-40",
        BUTTON_VARIANT[variant],
        BUTTON_SIZE[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

const CARD_SHADOW = {
  soft: "shadow-[20px_20px_20px_0px_rgba(0,0,0,0.05)]",
  meeting: "shadow-[10px_10px_30px_0px_rgba(0,0,0,0.06)]",
};

export function Card({ shadow = "soft", className, style, children }) {
  return (
    <div
      style={style}
      className={cn(
        "relative overflow-clip rounded-[30px] bg-white",
        CARD_SHADOW[shadow],
        className,
      )}
    >
      {children}
    </div>
  );
}

const FIELD_LABEL = {
  auth: "text-16",
  form: "text-20",
};

const FIELD_LABEL_TONE = {
  default: "text-ink",
  muted: "text-muted",
};

const FIELD_LABEL_GAP = {
  auth: "gap-[10.6px]",
  form: "gap-[18px]",
};

const FIELD_BOX = {
  auth: "h-[55px] rounded-[20px] text-ink placeholder:text-line",
  form: "h-[66px] rounded-[8px] border-line text-ink placeholder:text-line",
};

const authFieldBorder = (filled) =>
  filled ? "border-ink" : "border-line";

const FIELD_BASE =
  "text-20 w-full border border-solid px-[16px] py-[14px] font-medium outline-none transition-colors duration-150 focus:border-brand";

export function FieldLabel({
  children,
  required,
  tone = "form",
  muted = false,
  className,
}) {
  return (
    <span
      className={cn(
        "flex gap-[2px] font-medium",
        FIELD_LABEL[tone],
        FIELD_LABEL_TONE[muted ? "muted" : "default"],
        className,
      )}
    >
      {children}
      {required && <span className="text-16 text-danger">*</span>}
    </span>
  );
}

function FieldShell({ label, required, tone, className, children }) {
  return (
    <label
      className={cn("flex flex-col", label && FIELD_LABEL_GAP[tone], className)}
    >
      {label && (
        <FieldLabel required={required} tone={tone}>
          {label}
        </FieldLabel>
      )}
      {children}
    </label>
  );
}

function FieldBody({ limit, value, children }) {
  if (typeof limit !== "number") return children;

  const length = String(value ?? "").length;

  return (
    <span className="flex w-full flex-col gap-[6px]">
      {children}
      <span
        className={cn(
          "text-14 self-end font-medium",
          length >= limit ? "text-danger" : "text-muted",
        )}
      >
        {length}/{limit}
      </span>
    </span>
  );
}

export function TextField({
  label,
  required,
  tone = "auth",
  limit,
  wrapperClassName,
  className,
  ...props
}) {
  return (
    <FieldShell
      label={label}
      required={required}
      tone={tone}
      className={wrapperClassName}
    >
      <FieldBody limit={limit} value={props.value}>
        <input
          className={cn(
            FIELD_BASE,
            FIELD_BOX[tone],
            tone === "auth" &&
              authFieldBorder(String(props.value ?? "").length > 0),
            className,
          )}
          maxLength={limit}
          onPaste={alertOnTruncatedPaste(limit)}
          {...props}
        />
      </FieldBody>
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  required,
  tone = "form",
  limit,
  wrapperClassName,
  className,
  ...props
}) {
  return (
    <FieldShell
      label={label}
      required={required}
      tone={tone}
      className={wrapperClassName}
    >
      <FieldBody limit={limit} value={props.value}>
        <textarea
          className={cn(
            FIELD_BASE,
            FIELD_BOX[tone],
            "h-[132px] resize-none",
            className,
          )}
          maxLength={limit}
          onPaste={alertOnTruncatedPaste(limit)}
          {...props}
        />
      </FieldBody>
    </FieldShell>
  );
}

export function Chip({ label, onRemove, className }) {
  return (
    <span
      className={cn(
        "text-16 flex h-[41px] w-fit items-center justify-center gap-[6px] rounded-[8px] bg-brand-soft px-[16px] py-[8px] font-medium whitespace-nowrap text-brand",
        className,
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${label} 삭제`}
          className="flex shrink-0 cursor-pointer items-center"
        >
          <Close className="size-[20px]" />
        </button>
      )}
    </span>
  );
}

export function AgendaList({ items, onRemove, className }) {
  return (
    <ul className={cn("flex w-full flex-col gap-[10px]", className)}>
      {items.map((item) => (
        <li
          key={item.id}
          className="text-20 flex items-center justify-between gap-[10px] rounded-[55px] bg-surface px-[16px] py-[8px] font-medium text-ink"
        >
          <span className="truncate">{item.text}</span>

          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label={`${item.text} 삭제`}
              className="flex shrink-0 cursor-pointer items-center"
            >
              <Close className="size-[20px]" />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

const SWATCHES = ["#f74932", "#ffb010", "#01b76a", "#57b8ff", "#1c232b"];

export function ColorSwatches({ value, onChange, className }) {
  return (
    <div
      role="radiogroup"
      aria-label="프로젝트 색상"
      className={cn("flex flex-wrap items-center gap-[34px]", className)}
    >
      {SWATCHES.map((color, index) => (
        <button
          key={index}
          type="button"
          role="radio"
          aria-checked={index === value}
          aria-label={`색상 ${index + 1}`}
          onClick={() => onChange(index)}
          style={{ backgroundColor: color }}
          className={cn(
            "size-[40px] shrink-0 cursor-pointer rounded-full",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
            index === value &&
              "outline outline-2 outline-offset-2 outline-ink",
          )}
        />
      ))}
    </div>
  );
}

const TABLE_CONTAINER_WIDTH = 1460;
const TABLE_INNER_WIDTH = 1334;
const TABLE_CELL =
  "shrink-0 overflow-hidden pr-4 text-ellipsis whitespace-nowrap";

function tableCellWidth(col) {
  return col.width ? { width: col.width } : undefined;
}

export function Table({ columns, rows, className }) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-[35px] border-[0.4px] border-solid border-line bg-white",
        CARD_SHADOW.meeting,
        className,
      )}
      style={{ maxWidth: TABLE_CONTAINER_WIDTH }}
    >
      <div className="overflow-x-auto">
        <div style={{ minWidth: TABLE_INNER_WIDTH }}>
          <div className="text-20 flex h-[76px] items-center border-b-[0.5px] border-solid border-line bg-brand-soft px-6 font-semibold text-ink sm:px-10 lg:px-[42px]">
            {columns.map((col) => (
              <p
                key={col.label}
                className={cn(TABLE_CELL, !col.width && "flex-1")}
                style={tableCellWidth(col)}
              >
                {col.label}
              </p>
            ))}
          </div>

          {rows.map((row) => (
            <div
              key={row.id}
              className={cn(
                "text-20 relative flex h-[76px] items-center border-b-[0.5px] border-solid border-line px-6 font-bold text-ink sm:px-10 lg:px-[42px]",
                row.href && "transition-colors duration-150 hover:bg-surface",
              )}
            >
              {row.cells.map((cell, j) => (
                <div
                  key={columns[j]?.label ?? j}
                  className={cn(TABLE_CELL, !columns[j]?.width && "flex-1")}
                  style={tableCellWidth(columns[j] ?? {})}
                >
                  {cell}
                </div>
              ))}

              <ChevronRight className="shrink-0" />

              {row.href && (
                <Link
                  to={row.href}
                  aria-label={row.label}
                  className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#606060]"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
