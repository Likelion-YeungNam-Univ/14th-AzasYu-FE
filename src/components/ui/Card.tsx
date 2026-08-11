import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Shadow = 'soft' | 'drop'

/*
 * 히어로 위에 걸쳐 놓이는 흰 카드.
 * Figma: rounded-30px, 폭 878px, 히어로(670px) 위로 top-401px에 배치되므로
 * 사용하는 쪽에서 -mt-[269px]로 끌어올린다. (670 - 401 = 269)
 *
 * 그림자 2종
 *  soft : 20px 20px 20px rgba(0,0,0,.05)  — Desktop-30, 33
 *  drop : 0 4px 20px rgba(0,0,0,.14)      — Desktop-11
 */
const SHADOW: Record<Shadow, string> = {
  soft: 'shadow-[20px_20px_20px_0px_rgba(0,0,0,0.05)]',
  drop: 'shadow-[0px_4px_20px_0px_rgba(0,0,0,0.14)]',
}

interface CardProps {
  shadow?: Shadow
  className?: string
  children: ReactNode
}

export function Card({ shadow = 'soft', className, children }: CardProps) {
  return (
    <div
      className={cn(
        'relative overflow-clip rounded-[30px] bg-white',
        SHADOW[shadow],
        className,
      )}
    >
      {children}
    </div>
  )
}
