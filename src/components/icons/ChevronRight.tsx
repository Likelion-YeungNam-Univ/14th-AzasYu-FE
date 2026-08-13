import { cn } from '@/lib/cn'

/*
 * Figma 원본은 stroke가 white로 고정돼 있는데,
 * 헤더 3종에서 흰색 / #717171 / 검정으로 각각 쓰인다.
 * 그래서 stroke만 currentColor로 바꿔 인라인 컴포넌트로 둔다.
 * viewBox·path 좌표·stroke-width는 Figma 그대로다.
 *
 * 원본 path는 왼쪽 꺾쇠(‹)이고 Figma는 rotate-180 + -scale-y-100을 걸어 오른쪽(›)으로 만든다.
 * 이 둘의 합성은 X축 반전 하나와 정확히 같으므로(-scale-x-100) 그렇게 단순화했다.
 */
export function ChevronRight({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex -scale-x-100', className)}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="block size-[20px]"
      >
        <path
          d="M14 3L7 10L14 17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}
