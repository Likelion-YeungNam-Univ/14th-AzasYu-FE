import { Link, useParams } from 'react-router'
import { ChevronRight } from '@/components/icons/ChevronRight'
import { buildNavItems, SERVICE_NAME } from '@/constants/site'
import { cn } from '@/lib/cn'
import { PATHS } from '@/routes/paths'

/*
 * 전체 화면 공통 헤더. Figma 16개 화면의 헤더가 전부 같은 골격이다.
 *
 *   h-80 / px-52 py-23 / justify-between
 *   왼쪽   로고 "이해했습니다! (아님)" 24px SemiBold, tracking -0.6
 *   가운데 nav 4항목 16px Medium gap-48, **페이지 정중앙** (absolute, 로고 기준이 아니다)
 *   오른쪽 라벨 18px Medium + 꺾쇠 20px, gap-6
 *
 * 화면별로 갈리는 건 딱 세 가지다 → nav 유무 / 오른쪽 라벨 / 글자색.
 *
 * **nav 2번째 항목은 메뉴가 아니라 현재 프로젝트명이다** (constants/site.ts 참고).
 * projectId는 URL에서 직접 읽는다 — 프로젝트 하위 라우트에서만 값이 잡히므로
 * 페이지마다 prop으로 넘길 필요가 없다.
 *
 * | 화면                        | nav | 오른쪽   | tone    |
 * | --------------------------- | --- | -------- | ------- |
 * | 11, 30, 31, 33, 35          | O   | 로그아웃 | onHero  |
 * | 29, 34, 36, 37              | O   | 로그아웃 | onLight |
 * | 8, 39, 40, 26, 27, 28       | X   | 홈       | onDark  |
 * | 25 (랜딩)                   | X   | 회원가입 | onHero  |
 *
 * tone은 히어로 y좌표가 결정한다. 히어로가 y=0이면 헤더가 히어로 위에 겹쳐 onHero,
 * y=80이면 헤더가 히어로 밖 흰 배경이라 onLight. 히어로가 없는 화면은 onDark.
 *
 * 반응형은 Figma에 근거가 없다 (§ 3-2). 좌우 여백만 줄이고 높이 80은 유지한다.
 * **nav는 lg 미만에서 숨긴다** — 4항목 16px + gap-48이 403px라 좁은 화면에서 넘친다.
 * 모바일 시안이 나오면 햄버거 메뉴 등으로 바꿔야 한다. 지금은 데스크톱 전용 시안이다.
 */
export type HeaderTone = 'onHero' | 'onLight' | 'onDark'

const TONE: Record<HeaderTone, string> = {
  onHero: 'text-[#f4f4f4]',
  onLight: 'text-[#717171]',
  onDark: 'text-black',
}

export interface HeaderProps {
  tone?: HeaderTone
  /** 가운데 nav 표시 여부. 로그인 후 화면만 true */
  nav?: boolean
  /** 오른쪽 라벨과 목적지. 기본값은 로그인 후 화면의 "로그아웃" */
  action?: { label: string; href: string }
  /** nav에 찍을 현재 프로젝트명. 없으면 시안의 더미 이름을 쓴다 */
  projectName?: string
  className?: string
}

const DEFAULT_ACTION = { label: '로그아웃', href: PATHS.WELCOME }

export function Header({
  tone = 'onHero',
  nav = false,
  action = DEFAULT_ACTION,
  projectName,
  className,
}: HeaderProps) {
  const { projectId } = useParams()
  const navItems = buildNavItems(projectId, projectName)

  return (
    <header
      className={cn(
        'relative flex h-[80px] w-full items-center justify-between px-5 sm:px-8 lg:px-[52px]',
        TONE[tone],
        className,
      )}
    >
      <Link
        to={nav ? PATHS.PROJECTS : PATHS.WELCOME}
        className="text-18 font-semibold whitespace-nowrap sm:text-20 lg:text-24"
      >
        {SERVICE_NAME}
      </Link>

      {nav && (
        <nav className="text-16 absolute left-1/2 hidden -translate-x-1/2 items-center gap-[48px] font-medium whitespace-nowrap lg:flex">
          {navItems.map((item) => (
            <Link key={item.label} to={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      )}

      <Link to={action.href} className="flex items-center gap-[6px]">
        <span className="text-18 font-medium whitespace-nowrap">
          {action.label}
        </span>
        <ChevronRight />
      </Link>
    </header>
  )
}
