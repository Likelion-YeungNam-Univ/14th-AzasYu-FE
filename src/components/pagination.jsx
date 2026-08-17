import { ChevronRight } from "@/components/icons";
import { cn } from "@/lib";

const ARROW =
  "flex size-[36px] shrink-0 cursor-pointer items-center justify-center rounded-[8px] text-[#1c232b] transition-colors duration-150 hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent";

export function Pagination({ page, totalPages, onChange, className }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const goTo = (next) => {
    if (next === page) return;

    // 목록이 바뀌면서 문서 높이가 줄면 부드러운 스크롤이 중간에 끊긴다
    window.scrollTo({ top: 0, behavior: "auto" });

    onChange(next);
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
              ? "bg-[#0075d3] font-semibold text-white"
              : "text-[#858894] hover:bg-[#f5f5f5]",
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
