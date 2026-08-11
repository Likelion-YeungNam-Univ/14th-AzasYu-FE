import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/*
 * Figma에 두 가지 톤이 있다.
 *  auth : 회원가입(Desktop-8)  — 라벨 16px, 인풋 h-55px, 테두리 #d0d0d0, placeholder #d0d0d0
 *  form : 프로젝트 생성(Desktop-30) — 라벨 20px, 인풋 h-66px, 테두리 #606060, placeholder #606060
 * 공통: rounded-8px, px-16 py-14, placeholder 20px Medium, 라벨 색 #717171
 */
type Tone = 'auth' | 'form'

const LABEL: Record<Tone, string> = {
  auth: 'text-16',
  form: 'text-20',
}

const BOX: Record<Tone, string> = {
  auth: 'h-[55px] border-[#d0d0d0] placeholder:text-[#d0d0d0]',
  form: 'h-[66px] border-[#606060] placeholder:text-[#606060]',
}

const BASE_BOX =
  'text-20 w-full rounded-[8px] border border-solid px-[16px] py-[14px] font-medium text-[#333] outline-none'

interface FieldShellProps {
  label: string
  required?: boolean
  tone: Tone
  className?: string
  children: React.ReactNode
}

function FieldShell({
  label,
  required,
  tone,
  className,
  children,
}: FieldShellProps) {
  // 폭은 화면마다 다르므로(가입 445px, 프로젝트 생성 562px) 여기서 w-full을 주지 않는다.
  // w-full을 두면 호출부의 w-[445px]가 CSS 순서에 밀려 무시된다.
  return (
    // 라벨 높이 22.4px(16px×1.4), Figma에서 인풋이 라벨 기준 33px 아래 → 간격 10.6px
    <label className={cn('flex flex-col gap-[10.6px]', className)}>
      <span
        className={cn('flex gap-[2px] font-medium text-[#717171]', LABEL[tone])}
      >
        {label}
        {required && <span className="text-[#da1e51]">*</span>}
      </span>
      {children}
    </label>
  )
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  required?: boolean
  tone?: Tone
  wrapperClassName?: string
}

export function TextField({
  label,
  required,
  tone = 'auth',
  wrapperClassName,
  className,
  ...props
}: TextFieldProps) {
  return (
    <FieldShell
      label={label}
      required={required}
      tone={tone}
      className={wrapperClassName}
    >
      <input className={cn(BASE_BOX, BOX[tone], className)} {...props} />
    </FieldShell>
  )
}

interface TextAreaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  required?: boolean
  tone?: Tone
  wrapperClassName?: string
}

/** 프로젝트 설명 입력란. Figma 높이 132px. */
export function TextAreaField({
  label,
  required,
  tone = 'form',
  wrapperClassName,
  className,
  ...props
}: TextAreaFieldProps) {
  return (
    <FieldShell
      label={label}
      required={required}
      tone={tone}
      className={wrapperClassName}
    >
      <textarea
        className={cn(BASE_BOX, BOX[tone], 'h-[132px] resize-none', className)}
        {...props}
      />
    </FieldShell>
  )
}
