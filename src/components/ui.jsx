import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronRight, Close } from "@/components/icons";
import { cn, meetingPath, projectPath } from "@/lib";

const BUTTON_VARIANT = {
  primary: "bg-[#0075d3] text-white",
  secondary: "border border-solid border-[#1c232b] text-[#1c232b]",
  subtle: "bg-[#e6f3fe] text-[#0075d3]",
  dark: "bg-[#1c232b] text-white",
};

const BUTTON_SIZE = {
  block:
    "text-20 h-[66px] gap-[10px] rounded-[59px] px-[16px] py-[14px] font-medium",
  inline: "text-20 gap-[12px] rounded-[33px] px-[18px] py-[14px] font-semibold",
  action: "text-18 gap-[10px] rounded-[8px] px-[24px] py-[12px] font-semibold",
  pill: "text-16 h-[44px] gap-[6px] rounded-[59px] px-[16px] py-[14px] font-medium",
};

export function Button({
  variant = "primary",
  size = "block",
  className,
  children,
  ...props
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex cursor-pointer items-center justify-center overflow-clip whitespace-nowrap disabled:cursor-not-allowed",
        BUTTON_VARIANT[variant],
        BUTTON_SIZE[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

const CARD_SHADOW = {
  soft: "shadow-[20px_20px_20px_0px_rgba(0,0,0,0.05)]",
  meeting: "shadow-[10px_10px_30px_0px_rgba(0,0,0,0.06)]",
};

export function Card({ shadow = "soft", className, children }) {
  return (
    <div
      className={cn(
        "relative overflow-clip rounded-[30px] bg-white",
        CARD_SHADOW[shadow],
        className,
      )}
    >
      {children}
    </div>
  );
}

const FIELD_LABEL = {
  auth: "text-16",
  form: "text-20",
};

const FIELD_LABEL_TONE = {
  default: "text-[#1c232b]",
  muted: "text-[#858894]",
};

const FIELD_LABEL_GAP = {
  auth: "gap-[10.6px]",
  form: "gap-[18px]",
};

const FIELD_BOX = {
  auth: "h-[55px] rounded-[20px] border-[#b8bccc] text-[#1c232b] placeholder:text-[#b8bccc]",
  form: "h-[66px] rounded-[8px] border-[#b8bccc] text-[#1c232b] placeholder:text-[#b8bccc]",
};

const FIELD_BASE =
  "text-20 w-full border border-solid px-[16px] py-[14px] font-medium outline-none";

export function FieldLabel({
  children,
  required,
  tone = "form",
  muted = false,
  className,
}) {
  return (
    <span
      className={cn(
        "flex gap-[2px] font-medium",
        FIELD_LABEL[tone],
        FIELD_LABEL_TONE[muted ? "muted" : "default"],
        className,
      )}
    >
      {children}
      {required && <span className="text-16 text-[#da1e51]">*</span>}
    </span>
  );
}

function FieldShell({ label, required, tone, className, children }) {
  return (
    <label
      className={cn("flex flex-col", label && FIELD_LABEL_GAP[tone], className)}
    >
      {label && (
        <FieldLabel required={required} tone={tone}>
          {label}
        </FieldLabel>
      )}
      {children}
    </label>
  );
}

function FieldBody({ limit, value, children }) {
  if (typeof limit !== "number") return children;

  const length = String(value ?? "").length;

  return (
    <span className="flex w-full flex-col gap-[6px]">
      {children}
      <span
        className={cn(
          "text-14 self-end font-medium",
          length >= limit ? "text-[#da1e51]" : "text-[#858894]",
        )}
      >
        {length}/{limit}
      </span>
    </span>
  );
}

function useTruncatedPasteAlert(limit) {
  const notified = useRef(false);

  return (event) => {
    if (typeof limit !== "number") return;

    const input = event.currentTarget;
    const pasted = event.clipboardData?.getData("text") ?? "";
    const selected = (input.selectionEnd ?? 0) - (input.selectionStart ?? 0);

    if (input.value.length - selected + pasted.length <= limit) return;
    if (notified.current) return;

    notified.current = true;
    alert(`최대 ${limit}자까지 입력할 수 있어 뒷부분이 잘렸습니다.`);
  };
}

export function TextField({
  label,
  required,
  tone = "auth",
  limit,
  wrapperClassName,
  className,
  ...props
}) {
  const handlePaste = useTruncatedPasteAlert(limit);

  return (
    <FieldShell
      label={label}
      required={required}
      tone={tone}
      className={wrapperClassName}
    >
      <FieldBody limit={limit} value={props.value}>
        <input
          className={cn(FIELD_BASE, FIELD_BOX[tone], className)}
          maxLength={limit}
          onPaste={handlePaste}
          {...props}
        />
      </FieldBody>
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  required,
  tone = "form",
  limit,
  wrapperClassName,
  className,
  ...props
}) {
  const handlePaste = useTruncatedPasteAlert(limit);

  return (
    <FieldShell
      label={label}
      required={required}
      tone={tone}
      className={wrapperClassName}
    >
      <FieldBody limit={limit} value={props.value}>
        <textarea
          className={cn(
            FIELD_BASE,
            FIELD_BOX[tone],
            "h-[132px] resize-none",
            className,
          )}
          maxLength={limit}
          onPaste={handlePaste}
          {...props}
        />
      </FieldBody>
    </FieldShell>
  );
}

export function Chip({ label, onRemove, className }) {
  return (
    <span
      className={cn(
        "text-16 flex h-[41px] w-fit items-center justify-center gap-[6px] rounded-[8px] bg-[#e6f3fe] px-[16px] py-[8px] font-medium whitespace-nowrap text-[#0075d3]",
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
  );
}

export function AgendaList({ items, onRemove, className }) {
  return (
    <ul className={cn("flex w-full flex-col gap-[10px]", className)}>
      {items.map((item) => (
        <li
          key={item.id}
          className="text-20 flex items-center justify-between gap-[10px] rounded-[55px] bg-[#f5f5f5] px-[16px] py-[8px] font-medium text-[#1c232b]"
        >
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
        </li>
      ))}
    </ul>
  );
}

const SWATCHES = ["#f74932", "#ffb010", "#01b76a", "#57b8ff", "#1c232b"];

export function ColorSwatches({ value, onChange, className }) {
  return (
    <div
      role="radiogroup"
      aria-label="프로젝트 색상"
      className={cn("flex flex-wrap items-center gap-[34px]", className)}
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
            "size-[40px] shrink-0 cursor-pointer rounded-full",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c232b]",
            index === value &&
              "outline outline-2 outline-offset-2 outline-[#1c232b]",
          )}
        />
      ))}
    </div>
  );
}

const TABLE_CONTAINER_WIDTH = 1460;
const TABLE_INNER_WIDTH = 1334;
const TABLE_CELL =
  "shrink-0 overflow-hidden pr-4 text-ellipsis whitespace-nowrap";

function tableCellWidth(col) {
  return col.width ? { width: col.width } : undefined;
}

export function Table({ columns, rows, className }) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-[35px] border-[0.4px] border-solid border-[#b8bccc] bg-white",
        CARD_SHADOW.meeting,
        className,
      )}
      style={{ maxWidth: TABLE_CONTAINER_WIDTH }}
    >
      <div className="overflow-x-auto">
        <div style={{ minWidth: TABLE_INNER_WIDTH }}>
          <div className="text-20 flex h-[76px] items-center border-b-[0.5px] border-solid border-[#b8bccc] bg-[#e6f3fe] px-6 font-semibold text-[#1c232b] sm:px-10 lg:px-[42px]">
            {columns.map((col) => (
              <p
                key={col.label}
                className={cn(TABLE_CELL, !col.width && "flex-1")}
                style={tableCellWidth(col)}
              >
                {col.label}
              </p>
            ))}
          </div>

          {rows.map((row) => (
            <div
              key={row.id}
              className="text-20 relative flex h-[76px] items-center border-b-[0.5px] border-solid border-[#b8bccc] px-6 font-bold text-[#1c232b] sm:px-10 lg:px-[42px]"
            >
              {row.cells.map((cell, j) => (
                <div
                  key={columns[j]?.label ?? j}
                  className={cn(TABLE_CELL, !columns[j]?.width && "flex-1")}
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
  );
}

const PROJECT_CARD_GRADIENTS = [
  "linear-gradient(124.58deg, rgb(155, 213, 255) 5.3878%, rgb(35, 162, 255) 94.612%)",
  "linear-gradient(124.58deg, rgb(109, 219, 172) 5.3878%, rgb(1, 183, 106) 94.612%)",
  "linear-gradient(124.58deg, rgb(238, 126, 111) 5.3878%, rgb(247, 73, 50) 94.612%)",
  "linear-gradient(124.58deg, rgb(255, 217, 141) 5.3878%, rgb(255, 176, 16) 94.612%)",
];

export function ProjectCard({ project, className }) {
  const palette = PROJECT_CARD_GRADIENTS.length;
  const gradient =
    PROJECT_CARD_GRADIENTS[
      ((((Number(project.id) || 0) - 1) % palette) + palette) % palette
    ];

  return (
    <Link
      to={projectPath("DETAIL", project.id)}
      className={cn("flex flex-col", className)}
    >
      <div
        className="flex aspect-[470/275] w-full items-start rounded-[14px] px-[18px] py-[14px]"
        style={{ backgroundImage: gradient }}
      >
        {typeof project.meetingCount === "number" && (
          <span className="text-12 flex items-center justify-center rounded-[8px] bg-white px-[13px] py-[8px] font-bold whitespace-nowrap text-[#1c232b]">
            {project.meetingCount}개 회의
          </span>
        )}
      </div>

      <p className="text-18 mt-[22px] font-medium text-[#858894]">
        {project.participants}
      </p>
      <p className="text-24 mt-[4px] line-clamp-2 h-[65px] font-semibold break-all text-[#1c232b]">
        {project.name}
      </p>
      <p className="text-18 font-medium text-[#d7d7d7]">{project.date}</p>
    </Link>
  );
}

function Divider() {
  return (
    <div className="relative h-0 w-full">
      <span className="absolute inset-x-0 -top-px block border-t border-[#f6f5fa]" />
    </div>
  );
}

function formatMeetingDate(value) {
  if (!value) return "";

  const date = new Date(value);

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const AVATAR_COLORS = ["#f74932", "#01b76a", "#ffb010", "#57b8ff"];

const AVATAR_VISIBLE = 4;

export function AvatarStack({ members = [], className }) {
  const [open, setOpen] = useState(false);

  const shown = members.slice(0, AVATAR_VISIBLE);
  const rest = members.length - shown.length;

  if (!shown.length) return null;

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={`참여자 ${members.length}명 보기`}
        className="flex cursor-pointer items-center"
      >
        {shown.map((member, index) => (
          <span
            key={member.userId ?? member.id ?? index}
            style={{
              backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
            }}
            className="mr-[-13px] block size-[33px] shrink-0 rounded-full"
          />
        ))}

        {rest > 0 && (
          <span className="text-12 flex size-[33px] shrink-0 items-center justify-center rounded-full bg-white font-medium text-[#858894]">
            +{rest}
          </span>
        )}
      </button>

      {open && (
        <ul className="absolute top-[calc(100%+10px)] left-[88px] z-20 flex min-w-[89px] flex-col gap-[10px] rounded-[8px] bg-white px-[16px] py-[12px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.06)]">
          {members.map((member, index) => (
            <li
              key={member.userId ?? member.id ?? index}
              className="flex h-[18px] items-center gap-[8px]"
            >
              <span
                style={{
                  backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
                }}
                className="block size-[18px] shrink-0 rounded-full"
              />

              <span className="text-12 font-medium whitespace-nowrap text-[#1c232b]">
                {member.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function MeetingCard({ projectId, meeting, currentUserId }) {
  const {
    id,
    title,
    startsAt,
    meetingDate,
    startTime,
    participantsDone = 0,
    participantsTotal = 0,
    hasRecord = false,
    hasResult = false,
    participants = [],
    interviewStatus,
  } = meeting;

  const navigate = useNavigate();

  const mySubmitted = interviewStatus?.mySubmitted ?? false;

  const isParticipant = participants.some(
    (participant) =>
      String(participant.userId ?? participant.id ?? participant.memberId) ===
      String(currentUserId),
  );

  const ratio = participantsTotal
    ? Math.min(100, Math.max(0, (participantsDone / participantsTotal) * 100))
    : 0;

  const displayDate =
    meetingDate && startTime
      ? `${meetingDate}T${startTime}`
      : startsAt || meetingDate;

  return (
    <Card
      shadow="meeting"
      className="w-full max-w-[658px] px-6 py-8 sm:px-10 lg:px-[48px] lg:py-[40px]"
    >
      <div className="flex w-full flex-col gap-[30px]">
        <div className="flex flex-col gap-[4px]">
          <p className="text-28 line-clamp-2 font-bold break-all text-[#1c232b] lg:text-34">
            {title}
          </p>

          <p className="text-16 font-medium text-[#858894]">
            {formatMeetingDate(displayDate)}
          </p>
        </div>

        <Divider />

        <div className="flex flex-col gap-[28px]">
          <div className="relative h-[39px] w-full">
            <p className="text-16 absolute top-0 left-0 font-medium text-[#858894]">
              참여 현황
            </p>

            <p className="text-16 absolute top-0 right-0 font-medium text-[#858894]">
              {participantsDone}/{participantsTotal}명 완료
            </p>

            <div className="absolute top-[31.5px] left-0 h-[9px] w-full overflow-clip rounded-[33px] bg-[#f5f5f5]">
              <div
                className="h-full rounded-[33px] bg-[#0075d3]"
                style={{
                  width: `${ratio}%`,
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-[16px]">
            {isParticipant && !mySubmitted && (
              <Button
                size="pill"
                variant="secondary"
                onClick={() =>
                  navigate(meetingPath("INTERVIEW", projectId, id))
                }
              >
                AI 사전 인터뷰 하기
              </Button>
            )}

            <Button
              size="pill"
              variant="secondary"
              onClick={() => navigate(meetingPath("BOARD", projectId, id))}
            >
              익명 아이디어 보드 보기
            </Button>

            <Button
              size="pill"
              variant="secondary"
              onClick={() => navigate(meetingPath("SUMMARY", projectId, id))}
            >
              전체 의견 요약 보기
            </Button>
          </div>
        </div>

        <Divider />

        {!hasRecord && !hasResult && (
          <>
            <div className="flex flex-col gap-[4px]">
              <p className="text-20 font-bold text-[#1c232b] lg:text-24">
                회의가 끝났나요?
              </p>

              <p className="text-16 font-medium text-[#858894]">
                회의 내용을 업로드하면 AI가 분석해드려요.
              </p>
            </div>

            <Button
              variant="dark"
              className="w-full"
              onClick={() => navigate(meetingPath("UPLOAD", projectId, id))}
            >
              회의 텍스트 업로드
            </Button>
          </>
        )}

        {hasRecord && !hasResult && (
          <>
            <div className="flex flex-col gap-[4px]">
              <p className="text-20 font-bold text-[#1c232b] lg:text-24">
                회의 분석이 진행 중이에요.
              </p>

              <p className="text-16 font-medium text-[#858894]">
                회의 내용이 업로드되었어요. 분석 상태를 확인해보세요.
              </p>
            </div>

            <Button
              variant="dark"
              className="w-full"
              onClick={() => navigate(meetingPath("LOADING", projectId, id))}
            >
              회의 분석 보기
            </Button>
          </>
        )}

        {hasResult && (
          <>
            <div className="flex flex-col gap-[4px]">
              <p className="text-20 font-bold text-[#1c232b] lg:text-24">
                회의 분석이 완료됐어요.
              </p>

              <p className="text-16 font-medium text-[#858894]">
                회의 분석 결과를 다시 확인할 수 있어요.
              </p>
            </div>

            <Button
              variant="dark"
              className="w-full"
              onClick={() => navigate(meetingPath("DETAIL", projectId, id))}
            >
              분석 결과 보기
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
