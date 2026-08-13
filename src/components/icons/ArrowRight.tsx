import { cn } from '@/lib/cn'

/*
 * 축이 있는 오른쪽 화살표(→). 헤더의 꺾쇠(›)인 ChevronRight와는 다른 글리프다.
 * Figma: Desktop-39 "로그인하러 가기" (node 3:121 / 3:122), Desktop-25 "로그인하기" (3:462 / 3:463)
 *
 * **화면마다 색이 갈린다** — 39는 `#606060`(흰 배경 위 secondary 버튼),
 * 25는 `#f4f4f4`(히어로 위). 도형은 완전히 같고 stroke 색만 다르다.
 * 그래서 파일 `<img>`가 아니라 인라인 + `currentColor`다 (§ 3-3의 ChevronRight와 같은 이유).
 * 원본 파일은 `src/assets/icons/arrow-right.svg`에 그대로 둔다.
 *
 * 박스가 3중이다. Figma 구조를 그대로 유지한다.
 *   바깥 20x20      = w-[20px] + py-[4px]  (overflow-clip)
 *   잎   18x12      = 레이아웃상 아이콘 박스
 *   svg  18.707x12.707 = 고유 크기. stroke가 잎 박스 밖으로 삐져나온다.
 *
 * `preserveAspectRatio="none"`이라 18x12로 눌러 담으면 stroke가 비균일 스케일로 찌그러진다.
 * Figma가 `inset-[-2.95%_-3.93%_-2.95%_0]`으로 늘려둔 것과 같은 값(위아래 -0.354,
 * 오른쪽 -0.707)을 줘서 고유 크기로 그린다. 삐져도 20x20 바깥 박스 안이라 잘리지 않는다.
 *
 * (인라인으로 바꾸면서 preflight의 `img{max-width:100%}` 함정은 사라졌다 — `<img>`가 아니다.)
 */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'flex w-[20px] flex-col items-center justify-center overflow-clip py-[4px]',
        className,
      )}
    >
      <span className="relative block h-[12px] w-[18px]">
        <svg
          viewBox="0 0 18.7071 12.7071"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
          className="absolute top-[-0.354px] left-0 block h-[12.707px] w-[18.707px]"
        >
          <path d="M12 0.353553L18 6.35355L12 12.3536" stroke="currentColor" />
          <path d="M18 6.35355H0" stroke="currentColor" />
        </svg>
      </span>
    </span>
  )
}
