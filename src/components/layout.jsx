import { Link, useParams } from 'react-router'
import { ChevronRight } from '@/components/icons'
import { buildNavItems, cn, PATHS, SERVICE_NAME } from '@/lib'

const TONE = {
  onHero: 'text-[#f4f4f4]',
  onLight: 'text-[#717171]',
  onDark: 'text-black',
}

const DEFAULT_ACTION = { label: '로그아웃', href: PATHS.WELCOME }

export function Header({
  tone = 'onHero',
  nav = false,
  action = DEFAULT_ACTION,
  projectName,
  className,
}) {
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
        <span className="text-18 font-medium whitespace-nowrap">{action.label}</span>
        <ChevronRight />
      </Link>
    </header>
  )
}

const HERO_FILL =
  'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(141, 141, 141) 0%, rgb(141, 141, 141) 100%)'

const HERO_HEIGHT = {
  lg: 'h-[670px]',
  md: 'h-[370px]',
  sm: 'h-[270px]',
}

const HERO_CONTENT_TOP = {
  lg: { center: 229, left: 231 },
  md: { center: 82, left: 82 },
  sm: { center: 82, left: 82 },
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
}) {
  const isCenter = align === 'center'
  const top = contentTop ?? HERO_CONTENT_TOP[size][align]
  const weight = descriptionWeight ?? (isCenter ? 'semibold' : 'normal')

  return (
    <div
      className={cn('relative w-full', HERO_HEIGHT[size], className)}
      style={{ backgroundImage: HERO_FILL }}
    >
      <div
        className={cn(
          'absolute flex flex-col gap-[40px] px-5 text-[#f4f4f4] sm:px-8 lg:px-0',
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
              ? 'items-center gap-[16px]'
              : 'items-start gap-[14px] lg:w-[634px]',
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
