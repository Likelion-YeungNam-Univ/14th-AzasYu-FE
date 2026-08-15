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
