import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant =
  | 'primary'
  | 'secondary'
  | 'secondaryMuted'
  | 'secondaryOnHero'
  | 'subtle'
type Size = 'block' | 'blockSm' | 'inline' | 'small' | 'action'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

/*
 * Figma 기준값
 *  block  : h-66 고정 / rounded-59 / text-20 Medium        (폼 제출, 주요 CTA)
 *           예: Desktop-8 "가입 완료" 501x66
 *  inline : px-18 py-14 / rounded-33 / text-20 SemiBold / 높이는 내용에 맡긴다
 *           예: Desktop-39 "로그인하러 가기" 193x58, Desktop-25 "로그인하기" 155x58,
 *               Desktop-29 "참여코드 입력" 144x58
 *
 *  blockSm: h-54 고정 / rounded-59 / text-20 Medium        (로그인 화면)
 *           예: Desktop-26 "로그인" / "회원가입" 501x54
 *  small  : h-42 고정 / rounded-8 / text-16 Medium / gap-6  (보조 액션)
 *           예: Desktop-31 "안건 추가" 117x42
 *  action : px-24 py-12 / rounded-8 / text-18 SemiBold / gap-10 (목록 상단 액션, 높이 49)
 *           예: Desktop-29 "새 프로젝트 만들기" 201.14x49
 *
 *  primary         : bg #606060 + 흰 글씨 (테두리 없음)
 *  secondary       : 1px #606060 테두리 + #606060 글씨 — 흰 배경 위 (Desktop-39)
 *  secondaryMuted  : 1px #717171 테두리 + #717171 글씨 — 로그인 화면 "회원가입" (Desktop-26)
 *  secondaryOnHero : 1px #f4f4f4 테두리 + #f4f4f4 글씨 — 히어로 그라데이션 위 (Desktop-25)
 *  subtle          : bg #e9e9e9 + 검정 글씨 (테두리 없음) — Desktop-29 "새 프로젝트 만들기"
 *
 * 테두리 색이 화면마다 #606060 / #717171로 갈린다. 와이어프레임 플레이스홀더라
 * 실제 팔레트가 나오면 secondary 하나로 합쳐질 가능성이 높다 (§ 1).
 *
 * **inline + 테두리의 높이는 58px이다.** Figma 메타데이터가 프레임을 58로 보고하고
 * 자식 텍스트를 y=15 / x=19에 둔다 (padding 14 + stroke 1). 즉 Figma는 stroke를
 * 프레임 크기에 포함시킨다. CSS도 box-sizing:border-box + height:auto에서 border가
 * 높이에 더해지므로 14+28+14+2 = 58로 **그대로 일치한다.**
 *
 * → 그러니 `border`를 그대로 쓰면 된다. inset box-shadow로 바꾸면 56px이 되어
 *   오히려 2px 짧아진다. (2026-08-12에 한 번 그렇게 잘못 고쳤다가 되돌렸다.)
 */
const VARIANT: Record<Variant, string> = {
  primary: 'bg-[#606060] text-white',
  secondary: 'border border-solid border-[#606060] text-[#606060]',
  secondaryMuted: 'border border-solid border-[#717171] text-[#717171]',
  secondaryOnHero: 'border border-solid border-[#f4f4f4] text-[#f4f4f4]',
  subtle: 'bg-[#e9e9e9] text-black',
}

/*
 * 폭은 호출부가 정한다. 여기서 w-full을 주면 CSS 순서상 호출부의 w-[501px]가 무시된다.
 * 카드 안에서 꽉 채울 때는 호출부에서 w-full을 넘기면 된다.
 *
 * gap도 base가 아니라 여기에 둔다. Figma가 size별로 값이 다르고(block 10 / inline 12),
 * base에 두면 호출부에서 덮을 수 없다 — cn()은 단순 concat이라 CSS 순서에 밀린다.
 */
/*
 * blockSm의 Figma 모서리는 primary 59 / secondary 65로 갈리는데, 둘 다 높이 54의
 * 절반(27)보다 커서 CSS가 pill로 클램프한다 → 렌더 결과가 동일하다. 59로 통일했다.
 */
const SIZE: Record<Size, string> = {
  block:
    'text-20 h-[66px] gap-[10px] rounded-[59px] px-[16px] py-[14px] font-medium',
  blockSm:
    'text-20 h-[54px] gap-[10px] rounded-[59px] px-[16px] py-[14px] font-medium',
  inline:
    'text-20 gap-[12px] rounded-[33px] px-[18px] py-[14px] font-semibold',
  small:
    'text-16 h-[42px] gap-[6px] rounded-[8px] px-[16px] py-[8px] font-medium',
  action:
    'text-18 gap-[10px] rounded-[8px] px-[24px] py-[12px] font-semibold',
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
        // text-20은 SIZE 맵에 있다. small만 16px이라 base에 두면 덮을 수 없다
        'flex items-center justify-center overflow-clip whitespace-nowrap',
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
