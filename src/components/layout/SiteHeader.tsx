import { ChevronRight } from '@/components/icons/ChevronRight'
import { NAV_ITEMS, SERVICE_NAME } from '@/constants/site'
import { cn } from '@/lib/cn'

/*
 * Figma: h-80px, 로고 left-52px(24px SemiBold), 가운데 nav(16px Medium, gap-48),
 * 우측 로그아웃 left-52px 대칭(18px Medium) + 화살표 20px.
 * nav는 로고/우측 블록 사이 중앙이 아니라 "페이지 정중앙"이므로 absolute로 띄운다.
 *
 * tone
 *  onHero  : 히어로 그라데이션 위 — 흰 글씨 (Desktop-11, 30, 33)
 *  onLight : 흰 배경 위 — #717171 (Desktop-37)
 */
type Tone = 'onHero' | 'onLight'

const TONE: Record<Tone, string> = {
  onHero: 'text-white',
  onLight: 'text-[#717171]',
}

interface SiteHeaderProps {
  tone?: Tone
  className?: string
}

export function SiteHeader({ tone = 'onHero', className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        'relative flex h-[80px] w-full items-center px-[52px]',
        TONE[tone],
        className,
      )}
    >
      <p className="text-24 font-semibold whitespace-nowrap">{SERVICE_NAME}</p>

      <nav className="text-16 absolute left-1/2 flex -translate-x-1/2 items-center gap-[48px] font-medium whitespace-nowrap">
        {NAV_ITEMS.map((item) => (
          <a key={item} href="#">
            {item}
          </a>
        ))}
      </nav>

      <a href="#" className="ml-auto flex items-center gap-[6px]">
        <span className="text-18 font-medium whitespace-nowrap">로그아웃</span>
        <ChevronRight />
      </a>
    </header>
  )
}
