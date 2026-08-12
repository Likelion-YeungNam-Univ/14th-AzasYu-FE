import { Link } from 'react-router'
import { ChevronRight } from '@/components/icons/ChevronRight'
import { SERVICE_NAME } from '@/constants/site'
import { cn } from '@/lib/cn'
import { PATHS } from '@/routes/paths'

/*
 * 회원가입 계열(Desktop-8, 39)의 헤더.
 * SiteHeader와 달리 가운데 nav가 없고, 우측이 "홈"이며 글씨가 검정이다.
 * Figma: px-52 py-23, 로고 24px SemiBold, 우측 18px Medium + 화살표 20px (gap-6)
 * py-23 + 로고 행높이 33.6 = 79.6px라 0.4px 모자란다. 공통 컴포넌트이므로 h-80을 명시해
 * 아래 요소들이 밀리지 않게 한다 (items-center라 시각 결과는 동일).
 */
export function AuthHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        // 좌우 여백만 반응형. 높이 80px과 정렬은 Figma 그대로 유지한다.
        'flex h-[80px] w-full items-center justify-between px-5 text-black sm:px-8 lg:px-[52px]',
        className,
      )}
    >
      <Link
        to={PATHS.HOME}
        className="text-18 font-semibold whitespace-nowrap sm:text-20 lg:text-24"
      >
        {SERVICE_NAME}
      </Link>

      <Link to={PATHS.HOME} className="flex items-center gap-[6px]">
        <span className="text-18 font-medium whitespace-nowrap">홈</span>
        <ChevronRight />
      </Link>
    </header>
  )
}
