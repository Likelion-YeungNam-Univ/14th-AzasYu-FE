import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/*
 * 히어로 배경 띠. 헤더는 포함하지 않는다 — 화면마다 헤더와의 관계가 다르다.
 * 페이지 골격은 아래 HeroLayout이 잡는다.
 *
 * Figma 실측 (16개 화면 전수 확인)
 *
 * | size | 높이 | y   | align  | 콘텐츠 블록      | 제목  | 부제      | gap | 화면              |
 * | ---- | ---- | --- | ------ | ---------------- | ----- | --------- | --- | ----------------- |
 * | lg   | 670  | 0   | center | x863 y229 w194   | 48 Bd | 18 SemiBd | 16  | 11,30,31,33,35    |
 * | lg   | 670  | 0   | left   | x229 y231 w634   | 48 Bd | 20 SemiBd | 14  | 25 (랜딩)         |
 * | md   | 370  | 80  | left   | x230 y162 w634   | 48 Bd | 20        | 14  | 29                |
 * | sm   | 270  | 80  | left   | x230 y162 w634   | 48 Bd | 20        | 14  | 34,36,37          |
 *
 * **y=0(lg)이면 헤더가 히어로 위에 겹친다 → 헤더 tone=onHero.**
 * **y=80(md/sm)이면 헤더가 히어로 밖 흰 배경이다 → 헤더 tone=onLight.**
 *
 * 제목 행높이 67(48x1.4), 부제 28(20x1.4) 또는 25(18x1.4).
 * footer(버튼 등)가 붙는 화면은 부제 아래 gap 40이고 블록 높이가 109 → 207이 된다 (25, 29).
 *
 * 채우기는 Figma 그대로 그라데이션 2겹 — #8d8d8d 위 검정 20% 오버레이.
 *
 * 부제 웨이트는 화면마다 갈린다. 37은 Regular, 25는 SemiBold로 확인됐고
 * 29/34/36은 아직 스타일을 읽지 않았다 — 해당 화면 구현할 때 확인할 것.
 */
const HERO_FILL =
  'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(141, 141, 141) 0%, rgb(141, 141, 141) 100%)'

type Size = 'lg' | 'md' | 'sm'
type Align = 'center' | 'left'

const HEIGHT: Record<Size, string> = {
  lg: 'h-[670px]',
  md: 'h-[370px]',
  sm: 'h-[270px]',
}

/*
 * 히어로 **띠 상단부터** 콘텐츠 블록까지 (px). 문서 절대좌표가 아니다.
 *
 * lg는 띠가 y=0에서 시작하므로 Figma 절대값(229/231)과 같다.
 * md/sm은 띠가 y=80에서 시작하므로 **Figma 절대값 162에서 80을 뺀 82**다.
 * (이걸 162로 두면 텍스트가 80px 아래로 밀린다 — 실제로 한 번 틀렸다.)
 */
const CONTENT_TOP: Record<Size, Record<Align, number>> = {
  lg: { center: 229, left: 231 },
  md: { center: 82, left: 82 },
  sm: { center: 82, left: 82 },
}

interface HeroProps {
  title: string
  description?: ReactNode
  /** 부제 아래 붙는 부가 요소 (버튼, 참여코드 등). Figma gap 40 */
  footer?: ReactNode
  size?: Size
  align?: Align
  /** 부제 웨이트. center는 18px, left는 20px로 크기가 자동 결정된다 */
  descriptionWeight?: 'normal' | 'semibold'
  /** Figma 값과 다르게 둘 때만 넘긴다. 기본값은 size/align별 실측값 */
  contentTop?: number
  className?: string
}

export function Hero({
  title,
  description,
  footer,
  size = 'lg',
  align = 'center',
  descriptionWeight,
  contentTop,
  className,
}: HeroProps) {
  const isCenter = align === 'center'
  const top = contentTop ?? CONTENT_TOP[size][align]
  // center는 18px SemiBold, left는 20px — 화면별 기본값이 다르다
  const weight = descriptionWeight ?? (isCenter ? 'semibold' : 'normal')

  return (
    <div
      className={cn('relative w-full', HEIGHT[size], className)}
      style={{ backgroundImage: HERO_FILL }}
    >
      {/* Figma 구조 그대로: 바깥 프레임 gap-40 안에 텍스트 블록(gap-14/16)과 footer */}
      <div
        className={cn(
          'absolute flex flex-col gap-[40px] px-5 text-[#f4f4f4] sm:px-8 lg:px-0',
          isCenter
            ? 'left-1/2 w-full -translate-x-1/2 items-center text-center lg:w-max'
            : 'items-start lg:left-[230px] lg:w-[634px]',
        )}
        style={{ top }}
      >
        <div
          className={cn(
            'flex w-full flex-col',
            isCenter ? 'items-center gap-[16px]' : 'items-start gap-[14px]',
          )}
        >
          <p className="text-28 font-bold sm:text-34 lg:text-48 lg:whitespace-nowrap">
            {title}
          </p>

          {description && (
            <p
              className={cn(
                isCenter ? 'text-16 lg:text-18' : 'text-18 lg:text-20',
                weight === 'semibold' ? 'font-semibold' : 'font-normal',
              )}
            >
              {description}
            </p>
          )}
        </div>

        {footer}
      </div>
    </div>
  )
}

/*
 * 히어로가 있는 화면의 공통 골격.
 *
 *  overlapHeader  히어로가 y=0에서 시작하는 lg 화면. 헤더를 히어로 위에 겹친다.
 *                 (헤더는 tone="onHero"여야 한다)
 *  기본값(false)  히어로가 y=80에서 시작하는 md/sm 화면. 헤더가 히어로 위에 정상 흐름으로 온다.
 *
 * cardOverlap을 주면 히어로 아래 콘텐츠를 그만큼 끌어올린다.
 * 예: Desktop-11/30/31/33/35는 카드가 top-401이므로 670 - 401 = 269.
 */
interface HeroLayoutProps {
  header: ReactNode
  hero: ReactNode
  children: ReactNode
  overlapHeader?: boolean
  /** 히어로 위로 콘텐츠를 끌어올릴 px. 안 주면 겹치지 않는다 */
  cardOverlap?: number
  className?: string
}

export function HeroLayout({
  header,
  hero,
  children,
  overlapHeader = false,
  cardOverlap,
  className,
}: HeroLayoutProps) {
  return (
    <div className={cn('min-h-svh w-full bg-white', className)}>
      <div className="relative w-full">
        {overlapHeader ? (
          <>
            {hero}
            <div className="absolute inset-x-0 top-0">{header}</div>
          </>
        ) : (
          <>
            {header}
            {hero}
          </>
        )}
      </div>

      <div
        className="relative w-full"
        style={cardOverlap ? { marginTop: -cardOverlap } : undefined}
      >
        {children}
      </div>
    </div>
  )
}
