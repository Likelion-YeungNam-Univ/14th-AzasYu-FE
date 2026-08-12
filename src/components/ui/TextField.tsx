import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/*
 * Figma에 세 가지 톤이 있다. 높이·테두리색·모서리가 다 다르다.
 *
 *  auth  : 회원가입 (Desktop-8)       라벨 16px / h-55 / rounded-8  / #d0d0d0
 *  form  : 프로젝트 생성 (Desktop-30) 라벨 20px / h-66 / rounded-8  / #606060
 *  login : 로그인 (Desktop-26/27/28)  **라벨 없음** / h-54 / rounded-10 / #bcbcbc
 *
 * 공통: px-16 py-14, placeholder 20px Medium, 라벨 색 #717171.
 * 높이가 고정값이라 py-14는 사실상 무시된다 (Figma도 h를 명시한다).
 *
 * `#bcbcbc`는 로그인 화면에서 처음 나온 색이다. 와이어프레임 플레이스홀더이므로
 * 토큰으로 승격시키지 않는다 (§ 4 컬러 항목).
 */
type Tone = 'auth' | 'form' | 'login'

const LABEL: Record<Tone, string> = {
  auth: 'text-16',
  form: 'text-20',
  login: 'text-20',
}

/*
 * 라벨 → 인풋 간격. Figma는 "라벨 top 기준 인풋 top"으로 잡혀 있어 라벨 행높이를 빼야 한다.
 *   auth : 라벨 16px(h22.4), 인풋이 33 아래  → 33 - 22.4 = 10.6
 *   form : 라벨 20px(h28),  인풋이 46 아래  → 46 - 28   = 18   (Desktop-31/30에서 확인)
 * form을 10.6으로 두면 7.4px 좁아진다 — 처음에 auth 값을 그대로 쓰고 있었다.
 */
const LABEL_GAP: Record<Tone, string> = {
  auth: 'gap-[10.6px]',
  form: 'gap-[18px]',
  login: 'gap-[18px]',
}

const BOX: Record<Tone, string> = {
  auth: 'h-[55px] rounded-[8px] border-[#d0d0d0] placeholder:text-[#d0d0d0]',
  form: 'h-[66px] rounded-[8px] border-[#606060] placeholder:text-[#606060]',
  login: 'h-[54px] rounded-[10px] border-[#bcbcbc] placeholder:text-[#bcbcbc]',
}

const BASE_BOX =
  'text-20 w-full border border-solid px-[16px] py-[14px] font-medium text-[#333] outline-none'

interface FieldShellProps {
  /** 없으면 라벨 없이 인풋만 렌더한다 (로그인 화면) */
  label?: string
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
  // 폭은 화면마다 다르므로(가입 445px, 프로젝트 생성 562px, 로그인 501px)
  // 여기서 w-full을 주지 않는다. 주면 호출부의 w-[445px]가 CSS 순서에 밀려 무시된다.
  return (
    <label
      className={cn('flex flex-col', label && LABEL_GAP[tone], className)}
    >
      {label && (
        <span
          className={cn(
            'flex gap-[2px] font-medium text-[#717171]',
            LABEL[tone],
          )}
        >
          {label}
          {required && <span className="text-[#da1e51]">*</span>}
        </span>
      )}
      {children}
    </label>
  )
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 없으면 라벨 없이 인풋만 (tone="login") */
  label?: string
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
  label?: string
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
