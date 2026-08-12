import { cn } from '@/lib/cn'

/*
 * 프로젝트 색상 선택. Figma node `1:329` — Desktop-30 프로젝트 생성.
 *
 *   원 40x40 (r20) 8개, 가로 간격 34 (피치 74), 전체 563x40
 *   **모든 원에 opacity 0.4가 걸려 있다.**
 *
 * 색 값은 Figma가 내보낸 SVG에서 그대로 가져왔다 — 지어낸 값이 아니다.
 * 다만 **실제 팔레트가 아니라 회색 플레이스홀더다**: 8개 중 3개(1·7·8번)가
 * `#D9D9D9`로 완전히 같은 색이다. 디자이너가 컬러를 입히면 여기만 갈아끼우면 된다 (§ 1).
 *
 * Figma는 이 8개를 한 장의 SVG로 평탄화해서 내보내지만, 메타데이터에는 ellipse 8개가
 * 그대로 있다. 색상 "선택"은 동작이 필요한 컨트롤이라 이미지 한 장 대신 버튼으로 만든다.
 *
 * **시안에 선택된 상태가 없다.** 8개가 전부 같은 모양이다. Checkbox 때와 같은 상황이라
 * (§ 4 배치 2) 최소한의 링만 그려두고 시안이 나오면 교체한다.
 */
const SWATCHES = [
  '#D9D9D9',
  '#8B8B8B',
  '#414141',
  '#090909',
  '#5B5B5B',
  '#8D8D8D',
  '#D9D9D9',
  '#D9D9D9',
] as const

interface ColorSwatchesProps {
  /** 선택된 색의 인덱스. 같은 색이 여러 개라 값이 아니라 인덱스로 다룬다 */
  value: number
  onChange: (index: number) => void
  className?: string
}

export function ColorSwatches({
  value,
  onChange,
  className,
}: ColorSwatchesProps) {
  return (
    <div
      role="radiogroup"
      aria-label="프로젝트 색상"
      className={cn('flex flex-wrap items-center gap-[34px]', className)}
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
            'size-[40px] shrink-0 cursor-pointer rounded-full opacity-40',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#606060]',
            // 시안에 없는 표현 — 선택 여부를 알 방법이 아예 없어 최소한만 둔다
            index === value && 'outline outline-2 outline-offset-2 outline-[#606060]',
          )}
        />
      ))}
    </div>
  )
}
