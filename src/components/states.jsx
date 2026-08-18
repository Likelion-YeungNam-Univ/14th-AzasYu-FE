import { cn } from '@/lib'

const STATE_TITLE_TONE = {
  loading: 'text-[#858894]',
  empty: 'text-[#858894]',
  error: 'text-[#da1e51]',
}

const STATE_ROLE = {
  loading: 'status',
  empty: undefined,
  error: 'alert',
}

const STATE_SIZE = {
  screen: {
    wrapper: 'min-h-svh justify-center px-5 py-20 sm:px-8',
    gap: 'gap-[24px]',
    title: 'text-20 lg:text-24',
    description: 'text-16',
  },
  page: {
    wrapper: 'px-5 pt-24 pb-20 sm:px-8 lg:pt-[208px] lg:pb-[244px]',
    gap: 'gap-[32px]',
    title: 'text-28 sm:text-34 lg:text-48',
    description: 'text-16 lg:text-20',
  },
  block: {
    wrapper: 'px-5 py-20 sm:px-8',
    gap: 'gap-[24px]',
    title: 'text-20 lg:text-24',
    description: 'text-16',
  },
  inline: {
    wrapper: 'py-8',
    gap: 'gap-[16px]',
    title: 'text-16',
    description: 'text-14',
  },
}

export function Spinner({ className }) {
  return (
    <span
      aria-hidden
      className={cn(
        'block size-[40px] shrink-0 animate-spin rounded-full border-4 border-solid border-[#e6f3fe] border-t-[#0075d3]',
        className,
      )}
    />
  )
}

export function Skeleton({ className }) {
  return (
    <span
      aria-hidden
      className={cn('block animate-pulse rounded-[8px] bg-[#f5f5f5]', className)}
    />
  )
}

export function SkeletonCards({ count = 6, className }) {
  return (
    <ul
      aria-hidden
      className={cn(
        'grid grid-cols-1 gap-x-[25px] gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-[70px]',
        className,
      )}
    >
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="flex flex-col">
          <Skeleton className="aspect-[470/275] w-full rounded-[14px]" />
          <Skeleton className="mt-[22px] h-[25px] w-[45%]" />
          <Skeleton className="mt-[4px] h-[34px] w-[80%]" />
          <Skeleton className="mt-[8px] h-[25px] w-[35%]" />
        </li>
      ))}
    </ul>
  )
}

export function SkeletonRows({ count = 6, className }) {
  return (
    <div
      aria-hidden
      className={cn(
        'w-full overflow-hidden rounded-[35px] border-[0.4px] border-solid border-[#b8bccc] bg-white',
        className,
      )}
    >
      <Skeleton className="h-[76px] w-full rounded-none bg-[#e6f3fe]" />

      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex h-[76px] items-center gap-[24px] border-b-[0.5px] border-solid border-[#b8bccc] px-6 sm:px-10 lg:px-[42px]"
        >
          <Skeleton className="h-[20px] w-[22%]" />
          <Skeleton className="h-[20px] w-[26%]" />
          <Skeleton className="h-[20px] w-[30%]" />
        </div>
      ))}
    </div>
  )
}

export function StateView({
  variant = 'loading',
  size = 'block',
  icon,
  title,
  description,
  action,
  className,
}) {
  const scale = STATE_SIZE[size]

  return (
    <div
      role={STATE_ROLE[variant]}
      className={cn(
        'flex w-full flex-col items-center text-center',
        scale.wrapper,
        scale.gap,
        className,
      )}
    >
      {variant === 'loading' ? <Spinner /> : icon}

      <div className="flex flex-col items-center gap-[12px]">
        <p className={cn('font-semibold', scale.title, STATE_TITLE_TONE[variant])}>
          {title}
        </p>

        {description && (
          <p className={cn('font-medium text-[#858894]', scale.description)}>
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  )
}
