import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "@/components/icons";
import { cn, formatDateWithWeekday } from "@/lib";

const TRIGGER =
  "text-18 flex h-[56px] w-full cursor-pointer items-center justify-between gap-[8px] rounded-[8px] border border-solid bg-white pr-[14px] pl-[16px] font-medium outline-none transition-colors duration-150 hover:border-[#858894]";

const PANEL =
  "absolute top-[calc(100%+8px)] left-0 z-30 rounded-[12px] border border-solid border-[#f6f5fa] bg-white p-[14px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.12)]";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const pad = (value) => String(value).padStart(2, "0");

const toKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const startOfDay = (date) => {
  const next = new Date(date);

  next.setHours(0, 0, 0, 0);

  return next;
};

function useDismiss(open, close) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event) => {
      if (!ref.current?.contains(event.target)) close();
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return ref;
}

export function DatePicker({ value, onChange, placeholder, ariaLabel, icon }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => startOfDay(value ? new Date(value) : new Date()));

  const ref = useDismiss(open, () => setOpen(false));
  const today = startOfDay(new Date());

  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();

  const cells = [
    ...Array.from({ length: first.getDay() }, () => null),
    ...Array.from(
      { length: days },
      (_, index) => new Date(view.getFullYear(), view.getMonth(), index + 1),
    ),
  ];

  const moveMonth = (step) =>
    setView(new Date(view.getFullYear(), view.getMonth() + step, 1));

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          TRIGGER,
          open ? "border-[#0075d3]" : "border-[#b8bccc]",
          value ? "text-[#1c232b]" : "text-[#b8bccc]",
        )}
      >
        <span className="truncate">
          {value ? formatDateWithWeekday(value) : placeholder}
        </span>
        {icon}
      </button>

      {open && (
        <div className={cn(PANEL, "w-[288px]")}>
          <div className="flex items-center justify-between px-[4px] pb-[12px]">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              aria-label="이전 달"
              className="flex size-[28px] cursor-pointer items-center justify-center rounded-[6px] text-[#1c232b] transition-colors duration-150 hover:bg-[#f5f5f5]"
            >
              <ChevronRight className="rotate-180" />
            </button>

            <span className="text-18 font-semibold text-[#1c232b]">
              {view.getFullYear()}년 {view.getMonth() + 1}월
            </span>

            <button
              type="button"
              onClick={() => moveMonth(1)}
              aria-label="다음 달"
              className="flex size-[28px] cursor-pointer items-center justify-center rounded-[6px] text-[#1c232b] transition-colors duration-150 hover:bg-[#f5f5f5]"
            >
              <ChevronRight />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-[2px]">
            {WEEKDAYS.map((label) => (
              <span
                key={label}
                className="text-12 flex h-[28px] items-center justify-center font-medium text-[#858894]"
              >
                {label}
              </span>
            ))}

            {cells.map((date, index) => {
              if (!date) return <span key={`empty-${index}`} />;

              const key = toKey(date);
              const disabled = date < today;
              const selected = key === value;

              return (
                <button
                  key={key}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(key);
                    setOpen(false);
                  }}
                  className={cn(
                    "text-16 flex size-[36px] items-center justify-center justify-self-center rounded-full font-medium transition-colors duration-150",
                    disabled && "cursor-not-allowed text-[#b8bccc]",
                    !disabled && !selected && "cursor-pointer text-[#1c232b] hover:bg-[#e6f3fe]",
                    selected && "cursor-pointer bg-[#0075d3] font-semibold text-white",
                    !selected &&
                      !disabled &&
                      key === toKey(today) &&
                      "border border-solid border-[#0075d3] text-[#0075d3]",
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function Dropdown({ value, onChange, options, ariaLabel, icon }) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));

  const current = options.find((option) => option.value === value);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          TRIGGER,
          open ? "border-[#0075d3]" : "border-[#b8bccc]",
          current ? "text-[#1c232b]" : "text-[#b8bccc]",
        )}
      >
        <span className="truncate">{current?.label ?? ""}</span>
        {icon}
      </button>

      {open && (
        <ul
          role="listbox"
          className={cn(PANEL, "max-h-[232px] w-full min-w-[140px] overflow-y-auto p-[6px]")}
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "text-16 flex w-full cursor-pointer items-center rounded-[8px] px-[12px] py-[10px] text-left font-medium transition-colors duration-150",
                  option.value === value
                    ? "bg-[#e6f3fe] font-semibold text-[#0075d3]"
                    : "text-[#1c232b] hover:bg-[#f5f5f5]",
                )}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
