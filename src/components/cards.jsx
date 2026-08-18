import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button, Card } from "@/components/ui";
import { cn, meetingPath, projectPath } from "@/lib";

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
      className={cn(
        "group flex flex-col rounded-[14px] transition-[translate] duration-150 hover:-translate-y-[2px]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink",
        className,
      )}
    >
      <div
        className="flex aspect-[470/275] w-full items-start rounded-[14px] px-[18px] py-[14px] transition-shadow duration-150 group-hover:shadow-[0_10px_24px_0_rgba(0,0,0,0.14)]"
        style={{ backgroundImage: gradient }}
      >
        {typeof project.meetingCount === "number" && (
          <span className="text-12 flex items-center justify-center rounded-[8px] bg-white px-[13px] py-[8px] font-bold whitespace-nowrap text-ink">
            {project.meetingCount}개 회의
          </span>
        )}
      </div>

      <p className="text-18 mt-[22px] font-medium text-muted">
        {project.participants}
      </p>
      <p className="text-24 mt-[4px] line-clamp-2 h-[65px] font-semibold break-all text-ink">
        {project.name}
      </p>
      <p className="text-18 font-medium text-line">{project.date}</p>
    </Link>
  );
}

function Divider() {
  return (
    <div className="relative h-0 w-full">
      <span className="absolute inset-x-0 -top-px block border-t border-divider" />
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
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-expanded={open}
        aria-label={`참여자 ${members.length}명 보기`}
        className="flex items-center"
      >
        {shown.map((member, index) => (
          <span
            key={member.userId ?? member.id ?? index}
            style={{
              backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
            }}
            className="mr-[-13px] block size-[33px] shrink-0 rounded-full border-2 border-solid border-white"
          />
        ))}

        {rest > 0 && (
          <span className="text-12 flex size-[33px] shrink-0 items-center justify-center rounded-full bg-white font-medium text-muted">
            +{rest}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            left: (rest > 0 ? shown.length : shown.length - 1) * 20 + 8,
          }}
          className="absolute top-full z-20 pt-[10px]"
        >
          <ul className="flex max-h-[126px] min-w-[89px] flex-col gap-[10px] overflow-y-auto rounded-[8px] bg-white px-[16px] py-[12px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.06)]">
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

                <span className="text-12 font-medium whitespace-nowrap text-ink">
                  {member.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function includesMember(members, userId) {
  return members.some(
    (member) =>
      String(member.userId ?? member.id ?? member.memberId) === String(userId),
  );
}

function toProgressRatio(done, total) {
  if (!total) return 0;

  return Math.min(100, Math.max(0, (done / total) * 100));
}

function toDisplayDate({ meetingDate, startTime, startsAt }) {
  if (meetingDate && startTime) {
    return `${meetingDate}T${startTime}`;
  }

  return startsAt || meetingDate;
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
  const isParticipant = includesMember(participants, currentUserId);
  const ratio = toProgressRatio(participantsDone, participantsTotal);
  const displayDate = toDisplayDate({ meetingDate, startTime, startsAt });

  return (
    <Card
      shadow="meeting"
      className="w-full max-w-[658px] px-6 py-8 sm:px-10 lg:px-[48px] lg:py-[40px]"
    >
      <div className="flex w-full flex-col gap-[30px]">
        <div className="flex flex-col gap-[4px]">
          <div className="flex items-start justify-between gap-[8px]">
            <p className="text-28 line-clamp-2 font-bold break-all text-ink lg:text-34">
              {title}
            </p>

            {isParticipant && (
              <span className="mt-[6px] shrink-0 rounded-[4px] bg-[#def4ec] px-[6px] py-[2px] text-12 font-semibold text-[#0d7a4d]">
                참여중
              </span>
            )}
          </div>

          <p className="text-16 font-medium text-muted">
            {formatMeetingDate(displayDate)}
          </p>
        </div>

        <Divider />

        <div className="flex flex-col gap-[28px]">
          <div className="relative h-[39px] w-full">
            <p className="text-16 absolute top-0 left-0 font-medium text-muted">
              참여 현황
            </p>

            <p className="text-16 absolute top-0 right-0 font-medium text-muted">
              {participantsDone}/{participantsTotal}명 완료
            </p>

            <div className="absolute top-[31.5px] left-0 h-[9px] w-full overflow-clip rounded-[33px] bg-surface">
              <div
                className="h-full rounded-[33px] bg-brand"
                style={{
                  width: `${ratio}%`,
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-[14px]">
            {isParticipant && !mySubmitted && (
              <Button
                size="pillCompact"
                variant="secondary"
                onClick={() =>
                  navigate(meetingPath("INTERVIEW", projectId, id))
                }
              >
                AI 사전 인터뷰 하기
              </Button>
            )}

            <Button
              size="pillCompact"
              variant="secondary"
              onClick={() => navigate(meetingPath("BOARD", projectId, id))}
            >
              익명 아이디어 보드 보기
            </Button>

            <Button
              size="pillCompact"
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
              <p className="text-20 font-bold text-ink lg:text-24">
                회의가 끝났나요?
              </p>

              <p className="text-16 font-medium text-muted">
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
              <p className="text-20 font-bold text-ink lg:text-24">
                회의 분석이 진행 중이에요.
              </p>

              <p className="text-16 font-medium text-muted">
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
              <p className="text-20 font-bold text-ink lg:text-24">
                회의 분석이 완료됐어요.
              </p>

              <p className="text-16 font-medium text-muted">
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
