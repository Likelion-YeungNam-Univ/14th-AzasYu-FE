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
/*
 * secondary의 테두리를 border가 아니라 inset box-shadow로 그린다.
 *
 * Figma의 stroke는 프레임 크기에 포함되지 않는다(안쪽에 그려짐). 반면 CSS border는
 * box-sizing:border-box + height:auto 조합에서 위아래 1px씩 높이에 더해진다.
 * 그래서 border로 그리면 inline 버튼이 Figma 56px이 아니라 58px이 된다.
 * padding을 13/17로 깎아 맞추면 size × variant 조합마다 값이 갈라지므로,
 * 레이아웃에 영향이 없는 inset shadow로 그려 Figma padding(14/18)을 그대로 쓴다.
 *
 * ring 유틸리티 대신 명시적 arbitrary value를 쓴 건 v3(ring-inset)/v4(inset-ring)에서
 * 유틸리티 이름이 달라 헷갈리기 때문이다.
 */
const VARIANT: Record<Variant, string> = {
  primary: 'bg-[#606060] text-white',
  secondary: 'shadow-[inset_0_0_0_1px_#606060] text-[#606060]',
}

/*
 * 폭은 호출부가 정한다. 여기서 w-full을 주면 CSS 순서상 호출부의 w-[501px]가 무시된다.
 * 카드 안에서 꽉 채울 때는 호출부에서 w-full을 넘기면 된다.
 *
 * gap도 base가 아니라 여기에 둔다. Figma가 size별로 값이 다르고(block 10 / inline 12),
 * base에 두면 호출부에서 덮을 수 없다 — cn()은 단순 concat이라 CSS 순서에 밀린다.
 */
const SIZE: Record<Size, string> = {
  block: 'h-[66px] gap-[10px] rounded-[59px] px-[16px] py-[14px] font-medium',
  inline: 'gap-[12px] rounded-[33px] px-[18px] py-[14px] font-semibold',
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
        'text-20 flex items-center justify-center overflow-clip whitespace-nowrap',
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
