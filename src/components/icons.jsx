import calendar from '@/assets/icons/calendar.svg'
import { cn } from '@/lib'

export function ArrowRight({ className }) {
  return (
    <span
      className={cn(
        'flex w-[20px] flex-col items-center justify-center overflow-clip py-[4px]',
        className,
      )}
    >
      <span className="relative block h-[12px] w-[18px]">
        <svg
          viewBox="0 0 18.7071 12.7071"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
          className="absolute top-[-0.354px] left-0 block h-[12.707px] w-[18.707px]"
        >
          <path d="M12 0.353553L18 6.35355L12 12.3536" stroke="currentColor" />
          <path d="M18 6.35355H0" stroke="currentColor" />
        </svg>
      </span>
    </span>
  )
}

export function Calendar({ className }) {
  return (
    <span
      className={cn('relative block size-[20px] shrink-0 overflow-clip', className)}
    >
      <img
        src={calendar}
        alt=""
        className="absolute top-[0.916px] left-[1.334px] block h-[18.167px] w-[17.333px] max-w-none"
      />
    </span>
  )
}

export function ChevronRight({ className }) {
  return (
    <span className={cn('inline-flex -scale-x-100', className)}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="block size-[20px]"
      >
        <path
          d="M14 3L7 10L14 17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export function Close({ className }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={cn('block shrink-0', className)}
    >
      <path
        d="M6.28033 5.21967C5.98744 4.92678 5.51256 4.92678 5.21967 5.21967C4.92678 5.51256 4.92678 5.98744 5.21967 6.28033L8.93934 10L5.21967 13.7197C4.92678 14.0126 4.92678 14.4874 5.21967 14.7803C5.51256 15.0732 5.98744 15.0732 6.28033 14.7803L10 11.0607L13.7197 14.7803C14.0126 15.0732 14.4874 15.0732 14.7803 14.7803C15.0732 14.4874 15.0732 14.0126 14.7803 13.7197L11.0607 10L14.7803 6.28033C15.0732 5.98744 15.0732 5.51256 14.7803 5.21967C14.4874 4.92678 14.0126 4.92678 13.7197 5.21967L10 8.93934L6.28033 5.21967Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function Plus({ size = 14.142, strokeWidth, className }) {
  const stroke = ((strokeWidth ?? size * 0.053) / size) * 20
  const arm = (10 - stroke) / 2

  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      style={{ width: size, height: size }}
      className={cn('block shrink-0', className)}
    >
      <path
        d={`M10 ${10 - arm}V${10 + arm}M${10 - arm} 10H${10 + arm}`}
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Copy({ className }) {
  return (
    <svg
      viewBox="0 0 20 22"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
      className={cn('block shrink-0', className)}
    >
      <path d="M15.4824 2.49935V3.8833H17.5883H17.59V3.88688C18.2552 3.88867 18.8581 4.16797 19.2934 4.62093C19.7253 5.07031 19.9948 5.69157 19.9965 6.37907H20V6.38265V19.5007V19.5024H19.9965C19.9948 20.1899 19.7253 20.8148 19.2882 21.2677C18.8546 21.7153 18.2552 21.9946 17.5918 21.9964V22H17.5883H6.92926H6.92753V21.9964C6.26414 21.9946 5.6595 21.7153 5.22415 21.2624C4.79226 20.813 4.52276 20.1917 4.52103 19.5042H4.51758V19.5007V16.5627H2.41168H2.40995V16.5591C1.74657 16.5573 1.14192 16.278 0.706573 15.825C0.274683 15.3757 0.00518269 14.7544 0.00345513 14.0669H0V14.0633V2.49935V2.49756H0.00345513C0.00518269 1.80827 0.27641 1.18343 0.711756 0.732259C1.14537 0.284668 1.74484 0.00537109 2.40822 0.00358073V0H2.41168H13.0707H13.0725V0.00358073C13.7376 0.00537109 14.3405 0.284668 14.7758 0.73763C15.2077 1.18701 15.4772 1.80827 15.479 2.49577H15.4824V2.49935ZM13.6547 3.8833V2.49935V2.49577H13.6581C13.6581 2.33285 13.5907 2.18245 13.4836 2.07145C13.3783 1.96224 13.2314 1.89242 13.0742 1.89242V1.896H13.0725H2.41341H2.40995V1.89242C2.25274 1.89242 2.10763 1.96224 2.00052 2.07324C1.89514 2.18245 1.82776 2.33464 1.82776 2.49756H1.83122V2.49935V14.0633V14.0669H1.82776C1.82776 14.2298 1.89514 14.3802 2.00225 14.4912C2.10763 14.6004 2.25447 14.6702 2.41168 14.6702V14.6667H2.41341H4.51931V6.38265V6.38086H4.52276C4.52449 5.69157 4.79572 5.06673 5.23106 4.61556C5.66468 4.16797 6.26414 3.88867 6.92753 3.88688V3.8833H6.93098H13.6547ZM18.1705 19.5007V6.38265V6.37907H18.174C18.174 6.21615 18.1066 6.06576 17.9995 5.95475C17.8941 5.84554 17.7473 5.77572 17.59 5.77572V5.7793H17.5883H6.92926H6.9258V5.77572C6.76859 5.77572 6.62348 5.84554 6.51637 5.95654C6.41099 6.06576 6.34361 6.21794 6.34361 6.38086H6.34707V6.38265V19.5007V19.5042H6.34361C6.34361 19.6672 6.41099 19.8175 6.5181 19.9285C6.62348 20.0378 6.77032 20.1076 6.92753 20.1076V20.104H6.92926H17.5883H17.5918V20.1076C17.749 20.1076 17.8941 20.0378 18.0012 19.9268C18.1066 19.8175 18.174 19.6654 18.174 19.5024H18.1705V19.5007Z" fill="currentColor" />
    </svg>
  )
}
