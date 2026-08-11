import type { ReactNode } from 'react'
import { HERO_CARD_OVERLAP } from '@/constants/site'
import { cn } from '@/lib/cn'

/*
 * 히어로 배경 띠. 헤더는 포함하지 않는다 — 화면마다 헤더와의 관계가 다르기 때문이다.
 *
 *  size="lg" (h-670px) : 헤더가 히어로 "위에 겹쳐" 놓인다. 흰 글씨 헤더.
 *                        Desktop-11, 30, 33. 카드는 top-401px이므로 -mt-[269px]로 끌어올린다.
 *  size="sm" (h-270px) : 헤더(흰 배경, #717171) "아래에" 띠가 온다. Desktop-37.
 *
 * 채우기는 Figma 그대로 그라데이션 2겹 — #8d8d8d 위 검정 20% 오버레이.
 */
const HERO_FILL =
  'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(141, 141, 141) 0%, rgb(141, 141, 141) 100%)'

interface HeroProps {
  title: string
  description?: ReactNode
  /** 제목·설명 아래에 붙는 부가 요소 (예: 참여코드) */
  footer?: ReactNode
  size?: 'lg' | 'sm'
  align?: 'center' | 'left'
  /** 히어로 상단부터 텍스트 블록까지의 거리 (px). Figma 실측값을 넘긴다. */
  contentTop: number
  className?: string
}

export function Hero({
  title,
  description,
  footer,
  size = 'lg',
  align = 'center',
  contentTop,
  className,
}: HeroProps) {
  const isCenter = align === 'center'

  return (
    <div
      className={cn(
        'relative w-full',
        size === 'lg' ? 'h-[670px]' : 'h-[270px]',
        className,
      )}
      style={{ backgroundImage: HERO_FILL }}
    >
      <div
        className={cn(
          'absolute flex flex-col text-[#f4f4f4]',
          isCenter
            ? 'left-1/2 w-max -translate-x-1/2 items-center gap-[16px] text-center'
            : 'left-[230px] w-[634px] items-start gap-[14px]',
        )}
        style={{ top: contentTop }}
      >
        <p className="text-48 font-bold whitespace-nowrap">{title}</p>
        {description &&
          (isCenter ? (
            <p className="text-18 font-semibold whitespace-nowrap">
              {description}
            </p>
          ) : (
            <p className="text-20 font-normal">{description}</p>
          ))}
        {footer}
      </div>
    </div>
  )
}

/**
 * size="lg" 화면의 공통 골격.
 * 히어로 위에 흰 글씨 헤더를 겹치고, 그 아래로 카드가 올라오도록 겹침을 잡아준다.
 */
export function HeroLayout({
  hero,
  children,
}: {
  hero: ReactNode
  children: ReactNode
}) {
  return (
    <div className="relative w-full">
      {hero}
      <div
        className="relative mx-auto flex w-full justify-center pb-[120px]"
        style={{ marginTop: -HERO_CARD_OVERLAP }}
      >
        {children}
      </div>
    </div>
  )
}
