import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import githubIcon from '@/assets/icons/github.svg'
import instagramIcon from '@/assets/icons/instagram.svg'
import kakaotalkIcon from '@/assets/icons/kakaotalk.svg'
import likelionLogo from '@/assets/likelion-logo.svg'
import { ChevronRight } from '@/components/icons'
import { API_BASE_URL, buildNavItems, cn, PATHS, SERVICE_NAME } from '@/lib'
import { clearSession } from '@/session'

const TONE = {
  onHero: 'text-[#f4f4f4]',
  onLight: 'text-[#1c232b]',
  onDark: 'text-[#1c232b]',
}

const DEFAULT_ACTION = { label: '로그아웃', href: PATHS.WELCOME, logout: true }

const projectNameCache = new Map()

function useProjectName(projectId) {
  const [name, setName] = useState(() => projectNameCache.get(projectId) ?? '')

  useEffect(() => {
    if (!projectId) {
      setName('')
      return
    }

    const cached = projectNameCache.get(projectId)

    if (cached) {
      setName(cached)
      return
    }

    let cancelled = false

    const fetchProjectName = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')

        if (!accessToken) return

        const response = await fetch(
          `${API_BASE_URL}/api/v1/projects/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )

        const result = await response.json()

        if (!response.ok || !result.success || !result.data?.name) return

        projectNameCache.set(projectId, result.data.name)

        if (!cancelled) {
          setName(result.data.name)
        }
      } catch (error) {
        console.error('헤더 프로젝트 이름 조회 실패:', error)
      }
    }

    fetchProjectName()

    return () => {
      cancelled = true
    }
  }, [projectId])

  return name
}

export function Header({
  tone = 'onHero',
  nav = false,
  action = DEFAULT_ACTION,
  projectName,
  omitProjectNav = false,
  className,
}) {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const fetchedName = useProjectName(
    omitProjectNav || projectName ? '' : projectId,
  )
  const navItems = buildNavItems(
    omitProjectNav ? '' : projectId,
    projectName || fetchedName,
  )

  const handleLogout = () => {
    clearSession()
    projectNameCache.clear()
    navigate(PATHS.WELCOME, { replace: true })
  }

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

      {action &&
        (action.logout ? (
          <button
            type="button"
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-[6px]"
          >
            <span className="text-18 font-medium whitespace-nowrap">
              {action.label}
            </span>
            <ChevronRight />
          </button>
        ) : (
          <Link to={action.href} className="flex items-center gap-[6px]">
            <span className="text-18 font-medium whitespace-nowrap">
              {action.label}
            </span>
            <ChevronRight />
          </Link>
        ))}
    </header>
  )
}

const HERO_FILL =
  'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(141, 141, 141) 0%, rgb(141, 141, 141) 100%)'

const HERO_HEIGHT = {
  lg: 'h-[670px]',
  md: 'h-[350px]',
  sm: 'h-[270px]',
}

const HERO_CONTENT_TOP = {
  lg: { center: 229, left: 231 },
  md: { center: 71, left: 71 },
  sm: { center: 81, left: 82 },
}

const HERO_SURFACE = {
  gradient: {
    band: '',
    text: 'text-[#f4f4f4]',
    description: '',
    centerSize: 'text-16 lg:text-18',
    centerGap: 'gap-[16px]',
  },
  light: {
    band: 'bg-[#f5f5f5]',
    text: 'text-[#1c232b]',
    description: 'text-[#858894]',
    centerSize: 'text-16 sm:text-18 lg:text-20',
    centerGap: 'gap-[14px]',
  },
}

const HERO_DESC_WEIGHT = {
  semibold: 'font-semibold',
  medium: 'font-medium',
  normal: 'font-normal',
}

export function Hero({
  title,
  description,
  footer,
  size = 'lg',
  align = 'center',
  surface = 'gradient',
  descriptionWeight,
  contentTop,
  className,
}) {
  const isCenter = align === 'center'
  const top = contentTop ?? HERO_CONTENT_TOP[size][align]
  const weight = descriptionWeight ?? (isCenter ? 'semibold' : 'normal')
  const skin = HERO_SURFACE[surface]

  return (
    <div
      className={cn('relative w-full', HERO_HEIGHT[size], skin.band, className)}
      style={
        surface === 'gradient' ? { backgroundImage: HERO_FILL } : undefined
      }
    >
      <div
        className={cn(
          'absolute flex flex-col gap-[40px] px-5 sm:px-8 lg:px-0',
          skin.text,
          isCenter
            ? 'left-1/2 w-full -translate-x-1/2 items-center text-center lg:w-max'
            : 'inset-x-0 mx-auto w-full max-w-[1460px] items-start',
        )}
        style={{ top }}
      >
        <div
          className={cn(
            'flex w-full flex-col',
            isCenter
              ? `items-center ${skin.centerGap}`
              : 'items-start gap-[14px] lg:w-[634px]',
          )}
        >
          <p className="text-28 font-bold sm:text-34 lg:text-48 lg:whitespace-nowrap">
            {title}
          </p>

          {description && (
            <p
              className={cn(
                isCenter ? skin.centerSize : 'text-18 lg:text-20',
                HERO_DESC_WEIGHT[weight],
                skin.description,
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

export function HeroLayout({
  header,
  hero,
  children,
  overlapHeader = false,
  cardOverlap,
  background = 'bg-white',
  className,
}) {
  return (
    <div className={cn('min-h-svh w-full', background, className)}>
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

const SOCIAL_ICONS = [
  {
    src: instagramIcon,
    label: 'Instagram',
    href: 'https://www.instagram.com/likelion_yu/?hl=en',
  },
  { src: kakaotalkIcon, label: 'KakaoTalk' },
  {
    src: githubIcon,
    label: 'GitHub',
    href: 'https://github.com/Likelion-YeungNam-Univ',
  },
]

export function Footer({ className }) {
  return (
    <footer className={cn('w-full bg-white', className)}>
      <div className="mx-auto flex w-full max-w-[1460px] items-start justify-between px-5 pt-[20px] pb-10 sm:px-8 lg:h-[174px] lg:px-0 lg:pb-0">
        <div className="flex w-[128px] flex-col gap-[12px]">
          <img
            src={likelionLogo}
            alt=""
            className="size-[70px] max-w-none shrink-0"
          />

          <span className="text-18 font-bold whitespace-nowrap text-[#a66822]">
            LIKELION YU
          </span>
        </div>

        <ul className="flex items-center gap-[16px] lg:pt-[25px]">
          {SOCIAL_ICONS.map((icon) => {
            const glyph = (
              <img
                src={icon.src}
                alt={icon.label}
                className="size-[24px] max-w-none"
              />
            )

            return (
              <li
                key={icon.label}
                className="flex size-[50px] shrink-0 items-center justify-center rounded-[30px] bg-white/10"
              >
                {icon.href ? (
                  <a
                    href={icon.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex size-full items-center justify-center"
                  >
                    {glyph}
                  </a>
                ) : (
                  glyph
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </footer>
  )
}
