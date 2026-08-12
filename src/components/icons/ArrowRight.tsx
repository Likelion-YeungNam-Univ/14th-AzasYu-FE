import arrowRight from '@/assets/icons/arrow-right.svg'
import { cn } from '@/lib/cn'

/*
 * 축이 있는 오른쪽 화살표(→). 헤더의 꺾쇠(›)인 ChevronRight와는 다른 글리프다.
 * Figma: Desktop-39 "로그인하러 가기" 버튼 (node 767:1618-1619)
 *
 * 박스가 3중이다. Figma 구조를 그대로 유지한다.
 *   바깥 20x20  = w-[20px] + py-[4px]  (node 767:1618, overflow-clip)
 *   잎   18x12  = 레이아웃상 아이콘 박스 (node 767:1619)
 *   img  18.707x12.707 = SVG 고유 크기. stroke가 잎 박스 밖으로 삐져나온다.
 *
 * SVG에 preserveAspectRatio="none"이 박혀 있어서 img를 18x12로 눌러 담으면 stroke가
 * 비균일 스케일로 찌그러진다. Figma가 inset-[-2.95%_-3.93%_-2.95%_0]으로 늘려놓은 것과
 * 같은 값(위아래 -0.354, 오른쪽 -0.707)을 줘서 고유 크기로 그린다.
 * 삐짐을 더해도 20x20 바깥 박스 안에 들어오므로 overflow-clip에 잘리지 않는다.
 *
 * img에 max-w-none이 필수다. Tailwind preflight의 img{max-width:100%}가 잎 박스 18px로
 * 18.707px를 잘라버린다 (Figma가 내보낸 원본 코드에도 max-w-none이 붙어 있다).
 *
 * stroke가 #606060으로 박혀 있어 currentColor가 아니다. 지금 쓰이는 곳(secondary 버튼,
 * text-[#606060])과 색이 같아 문제없다. 다른 색이 필요해지면 ChevronRight처럼 인라인화할 것.
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
        <img
          src={arrowRight}
          alt=""
          className="absolute top-[-0.354px] left-0 block h-[12.707px] w-[18.707px] max-w-none"
        />
      </span>
    </span>
  )
}
