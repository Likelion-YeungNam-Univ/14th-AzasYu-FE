import calendar from '@/assets/icons/calendar.svg'
import { cn } from '@/lib/cn'

/*
 * 달력. Figma node `759:1140` (`calendar-03`) — Desktop-31 회의 일시 입력.
 *
 * ArrowRight와 같은 3중 박스 구조다. Figma가 아이콘을 20px 박스 안에 inset으로 넣고
 * stroke 삐짐만큼 다시 늘린다.
 *   바깥 20x20            (node 759:1140, overflow-clip)
 *   잎   15.832 x 16.668  (inset 10.42% 좌우 / 8.33% 상하)
 *   img  17.333 x 18.167  = SVG 고유 크기. stroke가 잎 밖으로 삐져나온다
 *
 * `max-w-none` 필수 — preflight의 img{max-width:100%}가 잘라먹는다 (§ 3-3).
 * stroke가 #606060으로 박혀 있다. 다른 색이 필요해지면 Close처럼 인라인화할 것.
 */
export function Calendar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative block size-[20px] shrink-0 overflow-clip',
        className,
      )}
    >
      <img
        src={calendar}
        alt=""
        className="absolute top-[0.916px] left-[1.334px] block h-[18.167px] w-[17.333px] max-w-none"
      />
    </span>
  )
}
