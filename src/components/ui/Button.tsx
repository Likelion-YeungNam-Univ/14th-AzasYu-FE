import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary'
type Size = 'block' | 'inline'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

/*
 * Figma 기준값
 *  block  : h-66px / rounded-59px / text-20 Medium   (폼 제출, 주요 CTA)
 *  inline : px-18 py-14 / rounded-33px / text-20 SemiBold  (Desktop-39 "로그인하러 가기")
 *  primary   : bg #606060 + 흰 글씨
 *  secondary : 1px #606060 테두리 + #606060 글씨
 */
const VARIANT: Record<Variant, string> = {
  primary: 'bg-[#606060] text-white',
  secondary: 'border border-solid border-[#606060] text-[#606060]',
}

/*
 * 폭은 호출부가 정한다. 여기서 w-full을 주면 CSS 순서상 호출부의 w-[501px]가 무시된다.
 * 카드 안에서 꽉 채울 때는 호출부에서 w-full을 넘기면 된다.
 */
const SIZE: Record<Size, string> = {
  block: 'h-[66px] rounded-[59px] px-[16px] py-[14px] font-medium',
  inline: 'rounded-[33px] px-[18px] py-[14px] font-semibold',
}

export function Button({
  variant = 'primary',
  size = 'block',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'text-20 flex items-center justify-center gap-[10px] overflow-clip whitespace-nowrap',
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
