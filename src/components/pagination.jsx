import { ChevronRight } from "@/components/icons";
import { cn } from "@/lib";

const ARROW =
  "flex size-[36px] shrink-0 cursor-pointer items-center justify-center rounded-[8px] text-ink transition-colors duration-150 hover:bg-surface disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent";

export function Pagination({ page, totalPages, onChange, className }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const goTo = (next) => {
    if (next === page) return;

    const start = window.scrollY;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (start <= 0 || reduced) {
      window.scrollTo({ top: 0, behavior: "auto" });
      onChange(next);
      return;
    }

    // 목록을 먼저 바꾸면 문서가 짧아지면서 스크롤이 끊긴다.
    // 위로 다 올라간 뒤에 바꾼다.
    const duration = Math.min(700, 260 + start * 0.4);
    const startedAt = performance.now();

    const step = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - (1 - progress) ** 3;

      window.scrollTo(0, Math.round(start * (1 - eased)));

      if (progress < 1) {
        window.requestAnimationFrame(step);
        return;
      }

      onChange(next);
    };

    window.requestAnimationFrame(step);
  };

  return (
    <nav
      aria-label="페이지"
      className={cn("flex items-center justify-center gap-[6px]", className)}
    >
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        aria-label="이전 페이지"
        className={ARROW}
      >
        <ChevronRight className="rotate-180" />
      </button>

      {pages.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => goTo(value)}
          aria-current={value === page ? "page" : undefined}
          className={cn(
            "text-16 flex size-[36px] shrink-0 cursor-pointer items-center justify-center rounded-[8px] font-medium transition-colors duration-150",
            value === page
              ? "bg-brand font-semibold text-white"
              : "text-muted hover:bg-surface",
          )}
        >
          {value}
        </button>
      ))}

      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
        aria-label="다음 페이지"
        className={ARROW}
      >
        <ChevronRight />
      </button>
    </nav>
  );
}
