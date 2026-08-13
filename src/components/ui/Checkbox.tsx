import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/*
 * Figma: Desktop - 26/27/28 "이메일 저장" (node 3:502)
 *
 *   박스   18x18 / 1px #bcbcbc / rounded-2
 *   gap    8
 *   라벨   20px Medium #606060
 *
 * 시안에 **체크된 상태가 없다.** 와이어프레임이라 빈 박스만 그려져 있다.
 * 체크 표시는 디자인을 지어내지 않고 currentColor 꺾쇠로 최소한만 그렸다 —
 * 시안이 나오면 교체할 것.
 *
 * 실제 <input type="checkbox">를 스크린리더/키보드용으로 두고 시각적으로만 감춘다
 * (sr-only + peer). appearance-none으로 브라우저 기본 모양을 지우는 방식보다
 * 모서리·색을 Figma 값으로 정확히 맞추기 쉽다.
 */
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  wrapperClassName?: string
}

export function Checkbox({
  label,
  wrapperClassName,
  className,
  ...props
}: CheckboxProps) {
  return (
    <label
      className={cn(
        'flex w-fit cursor-pointer items-center gap-[8px]',
        wrapperClassName,
      )}
    >
      <input type="checkbox" className={cn('peer sr-only', className)} {...props} />

      <span
        aria-hidden
        className="flex size-[18px] shrink-0 items-center justify-center rounded-[2px] border border-solid border-[#bcbcbc] text-transparent peer-checked:border-[#606060] peer-checked:text-[#606060] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#606060]"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="block"
        >
          <path
            d="M2.5 6.2L4.8 8.6L9.5 3.4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <span className="text-20 font-medium whitespace-nowrap text-[#606060]">
        {label}
      </span>
    </label>
  )
}
