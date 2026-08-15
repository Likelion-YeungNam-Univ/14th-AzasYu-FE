import { Link, useNavigate } from 'react-router'
import { ChevronRight, Close } from '@/components/icons'
import { cn, meetingPath, projectPath } from '@/lib'

const BUTTON_VARIANT = {
  primary: 'bg-[#0075d3] text-white',
  secondary: 'border border-solid border-[#1c232b] text-[#1c232b]',
  secondaryMuted: 'border border-solid border-[#717171] text-[#717171]',
  secondaryOnHero: 'border border-solid border-[#f4f4f4] text-[#f4f4f4]',
  subtle: 'bg-[#e6f3fe] text-[#0075d3]',
}

const BUTTON_SIZE = {
  block:
    'text-20 h-[66px] gap-[10px] rounded-[59px] px-[16px] py-[14px] font-medium',
  blockSm:
    'text-20 h-[54px] gap-[10px] rounded-[59px] px-[16px] py-[14px] font-medium',
  inline:
    'text-20 gap-[12px] rounded-[33px] px-[18px] py-[14px] font-semibold',
  small:
    'text-16 h-[42px] gap-[6px] rounded-[8px] px-[16px] py-[8px] font-medium',
  action:
    'text-18 gap-[10px] rounded-[8px] px-[24px] py-[12px] font-semibold',
}

export function Button({
  variant = 'primary',
  size = 'block',
  className,
  children,
  ...props
}) {
  return (
    <button
      type="button"
      className={cn(
        'flex items-center justify-center overflow-clip whitespace-nowrap',
        BUTTON_VARIANT[variant],
        BUTTON_SIZE[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

const CARD_SHADOW = {
  soft: 'shadow-[20px_20px_20px_0px_rgba(0,0,0,0.05)]',
  drop: 'shadow-[0px_4px_20px_0px_rgba(0,0,0,0.14)]',
}

export function Card({ shadow = 'soft', className, children }) {
  return (
    <div
      className={cn(
        'relative overflow-clip rounded-[30px] bg-white',
        CARD_SHADOW[shadow],
        className,
      )}
    >
      {children}
    </div>
  )
}

const FIELD_LABEL = {
  auth: 'text-16 text-[#1c232b]',
  form: 'text-20 text-[#1c232b]',
  login: 'text-20 text-[#717171]',
}

const FIELD_LABEL_GAP = {
  auth: 'gap-[10.6px]',
  form: 'gap-[18px]',
  login: 'gap-[18px]',
}

const FIELD_BOX = {
  auth: 'h-[55px] rounded-[20px] border-[#b8bccc] text-[#1c232b] placeholder:text-[#b8bccc]',
  form: 'h-[66px] rounded-[8px] border-[#b8bccc] text-[#1c232b] placeholder:text-[#b8bccc]',
  login: 'h-[54px] rounded-[10px] border-[#bcbcbc] text-[#333] placeholder:text-[#bcbcbc]',
}

const FIELD_BASE =
  'text-20 w-full border border-solid px-[16px] py-[14px] font-medium outline-none'

function FieldShell({ label, required, tone, className, children }) {
  return (
    <label className={cn('flex flex-col', label && FIELD_LABEL_GAP[tone], className)}>
      {label && (
        <span
          className={cn('flex gap-[2px] font-medium', FIELD_LABEL[tone])}
        >
          {label}
          {required && <span className="text-16 text-[#da1e51]">*</span>}
        </span>
      )}
      {children}
    </label>
  )
}

export function TextField({
  label,
  required,
  tone = 'auth',
  wrapperClassName,
  className,
  ...props
}) {
  return (
    <FieldShell
      label={label}
      required={required}
      tone={tone}
      className={wrapperClassName}
    >
      <input className={cn(FIELD_BASE, FIELD_BOX[tone], className)} {...props} />
    </FieldShell>
  )
}

export function TextAreaField({
  label,
  required,
  tone = 'form',
  wrapperClassName,
  className,
  ...props
}) {
  return (
    <FieldShell
      label={label}
      required={required}
      tone={tone}
      className={wrapperClassName}
    >
      <textarea
        className={cn(FIELD_BASE, FIELD_BOX[tone], 'h-[132px] resize-none', className)}
        {...props}
      />
    </FieldShell>
  )
}

export function Checkbox({ label, wrapperClassName, className, ...props }) {
  return (
    <label
      className={cn('flex w-fit cursor-pointer items-center gap-[8px]', wrapperClassName)}
    >
      <input type="checkbox" className={cn('peer sr-only', className)} {...props} />

      <span
        aria-hidden
        className="flex size-[18px] shrink-0 items-center justify-center rounded-[2px] border border-solid border-[#bcbcbc] text-transparent peer-checked:border-[#606060] peer-checked:text-[#606060] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#606060]"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="block">
          <path
            d="M2.5 6.2L4.8 8.6L9.5 3.4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <span className="text-20 font-medium whitespace-nowrap text-[#606060]">
        {label}
      </span>
    </label>
  )
}

export function Chip({ label, onRemove, className }) {
  return (
    <span
      className={cn(
        'text-16 flex h-[41px] w-fit items-center justify-center gap-[6px] rounded-[8px] border border-solid border-[#606060] px-[16px] py-[8px] font-medium whitespace-nowrap text-[#606060]',
        className,
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${label} 삭제`}
          className="flex shrink-0 cursor-pointer items-center"
        >
          <Close className="size-[20px]" />
        </button>
      )}
    </span>
  )
}

export function FieldBox({ children, icon, className }) {
  return (
    <div
      className={cn(
        'flex items-center rounded-[8px] border border-solid border-[#606060] px-[16px] py-[8px]',
        className,
      )}
    >
      <span className="text-16 flex items-center gap-[12px] font-medium whitespace-nowrap text-[#606060]">
        {children}
        {icon}
      </span>
    </div>
  )
}

export function AgendaList({ items, onRemove, className }) {
  return (
    <div
      className={cn(
        'flex min-h-[154px] flex-col justify-center gap-[10px] rounded-[7px] border border-solid border-[#606060] px-[16px] py-[14px] lg:h-[154px] lg:min-h-0 lg:overflow-clip',
        className,
      )}
    >
      <ol className="text-20 flex list-decimal flex-col gap-[10px] font-medium text-[#606060]">
        {items.map((item) => (
          <li key={item.id} className="ms-[30px] h-[36px]">
            <div className="flex h-full items-center justify-between gap-[10px]">
              <span className="truncate">{item.text}</span>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  aria-label={`${item.text} 삭제`}
                  className="flex shrink-0 cursor-pointer items-center"
                >
                  <Close className="size-[20px]" />
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

const SWATCHES = ['#f74932', '#ffb010', '#01b76a', '#57b8ff', '#1c232b']

export function ColorSwatches({ value, onChange, className }) {
  return (
    <div
      role="radiogroup"
      aria-label="프로젝트 색상"
      className={cn('flex flex-wrap items-center gap-[34px]', className)}
    >
      {SWATCHES.map((color, index) => (
        <button
          key={index}
          type="button"
          role="radio"
          aria-checked={index === value}
          aria-label={`색상 ${index + 1}`}
          onClick={() => onChange(index)}
          style={{ backgroundColor: color }}
          className={cn(
            'size-[40px] shrink-0 cursor-pointer rounded-full',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c232b]',
            index === value && 'outline outline-2 outline-offset-2 outline-[#1c232b]',
          )}
        />
      ))}
    </div>
  )
}

const TABLE_CONTAINER_WIDTH = 1452
const TABLE_INNER_WIDTH = TABLE_CONTAINER_WIDTH - 2
const TABLE_CELL = 'shrink-0 overflow-hidden pr-4 text-ellipsis whitespace-nowrap'

function tableCellWidth(col) {
  return col.width ? { width: col.width } : undefined
}

export function Table({ columns, rows, className }) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-[35px] border border-solid border-[#717171] bg-white',
        className,
      )}
      style={{ maxWidth: TABLE_CONTAINER_WIDTH }}
    >
      <div className="overflow-x-auto">
        <div
          className="px-6 py-[29px] sm:px-10 lg:px-[70px]"
          style={{ minWidth: TABLE_INNER_WIDTH }}
        >
          <div className="text-20 flex h-[76px] items-center border-b border-solid border-[#717171] font-semibold text-[#717171]">
            {columns.map((col) => (
              <p
                key={col.label}
                className={cn(TABLE_CELL, !col.width && 'flex-1')}
                style={tableCellWidth(col)}
              >
                {col.label}
              </p>
            ))}
          </div>

          {rows.map((row, i) => (
            <div
              key={row.id}
              className={cn(
                'text-20 relative flex h-[70px] items-center font-medium text-[#717171]',
                i < rows.length - 1 && 'border-b border-solid border-[#717171]',
              )}
            >
              {row.cells.map((cell, j) => (
                <div
                  key={columns[j]?.label ?? j}
                  className={cn(TABLE_CELL, !columns[j]?.width && 'flex-1')}
                  style={tableCellWidth(columns[j] ?? {})}
                >
                  {cell}
                </div>
              ))}

              <ChevronRight className="shrink-0" />

              {row.href && (
                <Link
                  to={row.href}
                  aria-label={row.label}
                  className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#606060]"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const PROJECT_CARD_GRADIENTS = [
  'linear-gradient(124.58deg, rgb(155, 213, 255) 5.3878%, rgb(35, 162, 255) 94.612%)',
  'linear-gradient(124.58deg, rgb(109, 219, 172) 5.3878%, rgb(1, 183, 106) 94.612%)',
  'linear-gradient(124.58deg, rgb(238, 126, 111) 5.3878%, rgb(247, 73, 50) 94.612%)',
  'linear-gradient(124.58deg, rgb(255, 217, 141) 5.3878%, rgb(255, 176, 16) 94.612%)',
]

export function ProjectCard({ project, className }) {
  const palette = PROJECT_CARD_GRADIENTS.length
  const gradient =
    PROJECT_CARD_GRADIENTS[
      (((Number(project.id) || 0) - 1) % palette + palette) % palette
    ]

  return (
    <Link
      to={projectPath('DETAIL', project.id)}
      className={cn('flex flex-col', className)}
    >
      <div
        className="flex aspect-[470/275] w-full items-start rounded-[14px] px-[18px] py-[14px]"
        style={{ backgroundImage: gradient }}
      >
        {typeof project.meetingCount === 'number' && (
          <span className="text-12 flex items-center justify-center rounded-[8px] bg-white px-[13px] py-[8px] font-bold whitespace-nowrap text-[#1c232b]">
            {project.meetingCount}개 회의
          </span>
        )}
      </div>

      <p className="text-18 mt-[22px] font-medium text-[#858894]">
        {project.participants}
      </p>
      <p className="text-24 mt-[4px] h-[65px] overflow-hidden font-semibold text-[#1c232b]">
        {project.name}
      </p>
      <p className="text-18 font-medium text-[#d7d7d7]">{project.date}</p>
    </Link>
  )
}

function Divider() {
  return (
    <div className="relative h-0 w-full">
      <span className="absolute inset-x-0 -top-px block border-t border-[#c7c7c7]" />
    </div>
  )
}

function formatMeetingDate(value) {
  if (!value) return ''

  const date = new Date(value)

  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function MeetingCard({ projectId, meeting }) {
  const { id, title, startsAt, participantsDone, participantsTotal } = meeting
  const navigate = useNavigate()
  const ratio = participantsTotal
    ? (participantsDone / participantsTotal) * 100
    : 0

  return (
    <Card
      shadow="drop"
      className="w-full max-w-[878px] px-6 py-10 sm:px-10 lg:px-[158px] lg:py-[80px]"
    >
      <div className="mx-auto flex w-full max-w-[562px] flex-col gap-[30px]">
        <div className="flex flex-col gap-[4px]">
          <p className="text-28 font-bold text-black lg:text-34">{title}</p>
          <p className="text-16 font-medium text-[#9d9d9d]">  {formatMeetingDate(startsAt)}</p>
        </div>

        <Divider />

        <div className="flex flex-col gap-[28px]">
          <div className="relative h-[39px] w-full">
            <p className="text-16 absolute top-0 left-0 font-medium text-[#9d9d9d]">
              참여 현황
            </p>
            <p className="text-16 absolute top-0 right-0 font-medium text-[#9d9d9d]">
              {participantsDone}/{participantsTotal}명 완료
            </p>
            <div className="absolute top-[31.5px] left-0 h-[9px] w-full overflow-clip rounded-[33px] bg-[#d9d9d9]">
              <div
                className="h-full rounded-[33px] bg-[#606060]"
                style={{ width: `${ratio}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-[12px]">
            <Button
              className="w-full"
              onClick={() => navigate(meetingPath('INTERVIEW', projectId, id))}
            >
              AI 사전 인터뷰 하기
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate(meetingPath('BOARD', projectId, id))}
            >
              익명 아이디어 보드 보기
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate(meetingPath('SUMMARY', projectId, id))}
            >
              전체 의견 요약 보기
            </Button>
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-[4px]">
          <p className="text-20 font-bold text-black lg:text-24">회의가 끝났나요?</p>
          <p className="text-16 font-medium text-[#9d9d9d]">
            회의 내용을 업로드하면 AI가 분석해드려요.
          </p>
        </div>

        <div className="flex flex-col gap-[12px]">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => navigate(meetingPath('UPLOAD', projectId, id))}
          >
            회의 텍스트 업로드
          </Button>
          <Button
            className="w-full"
            onClick={() => navigate(projectPath('MEETING_NEW', projectId))}
          >
            다음 회의 생성하기
            <ChevronRight />
          </Button>
        </div>
      </div>
    </Card>
  )
}
