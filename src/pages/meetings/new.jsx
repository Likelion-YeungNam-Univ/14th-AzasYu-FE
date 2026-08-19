import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import calendarIcon from "@/assets/icons/calendar.svg";
import clockIcon from "@/assets/icons/clock.svg";
import { Header, Hero, HeroLayout } from "@/components/layout";
import { StateView } from "@/components/states";
import { ChevronRight } from "@/components/icons";
import { DatePicker, Dropdown } from "@/components/picker";
import {
  AgendaList,
  Button,
  Chip,
  FieldLabel,
  TextAreaField,
  TextField,
} from "@/components/ui";
import {
  alertOnTruncatedPaste,
  API_BASE_URL,
  cn,
  FIELD_LIMITS,
  formatDateWithWeekday,
  HEADER_PRESETS,
  PATHS,
  projectPath,
  toUserMessage,
} from "@/lib";

const DURATION_OPTIONS = [
  { value: 30, label: "약 30분" },
  { value: 60, label: "약 1시간" },
  { value: 90, label: "약 1시간 30분" },
  { value: 120, label: "약 2시간" },
  { value: 180, label: "약 3시간" },
];

const NEW_COLUMN = "w-full max-w-[562px] md:max-w-[620px] lg:max-w-[562px]";

const DATE_FIELD =
  "text-18 h-[56px] w-full cursor-pointer appearance-none rounded-[8px] border border-solid border-line bg-white pr-[44px] pl-[16px] font-medium outline-none transition-colors duration-150 hover:border-muted focus:border-brand";

const PICKER_FIELD = cn(
  DATE_FIELD,
  "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:m-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0",
);

const FIELD_ICON =
  "pointer-events-none absolute inset-y-0 right-[16px] flex items-center";

const DATE_FIELD_TEXT = {
  filled: "text-ink",
  empty: "text-transparent",
};

const HINT_TEXT =
  "text-18 pointer-events-none absolute inset-y-0 left-0 flex items-center px-[16px] font-medium text-line";

const pad = (value) => String(value).padStart(2, "0");

const readNow = () => {
  const now = new Date();

  const hour = now.getHours();
  const meridiem = hour < 12 ? "오전" : "오후";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return {
    date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    time: `${pad(hour)}:${pad(now.getMinutes())}`,
    dateHint: formatDateWithWeekday(now),
    timeHint: `${meridiem} ${hour12}:${pad(now.getMinutes())}`,
  };
};

export function MeetingNewPage() {
  const { projectId = "" } = useParams();
  const navigate = useNavigate();

  // 초기 안건은 없음
  const [agenda, setAgenda] = useState([]);

  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("");

  // 회의 일시는 비워두고 현재 날짜·시각을 흐리게 안내만 한다
  const [now] = useState(readNow);

  const [meetingDate, setMeetingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [expectedDurationMinutes, setExpectedDurationMinutes] = useState(90);

  const [creating, setCreating] = useState(false);

  // 현재 작성 중인 안건
  const [newAgenda, setNewAgenda] = useState("");

  // 참여자는 프로젝트 구성원 중에서 고른다
  const [projectMembers, setProjectMembers] = useState([]);
  const [memberQuery, setMemberQuery] = useState("");
  const [participants, setParticipants] = useState([]);
  const [checking, setChecking] = useState(true);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;

    const fetchMembers = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch(
          `${API_BASE_URL}/api/v1/projects/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          if (!cancelled) setIsMember(false);
          return;
        }

        if (!cancelled) {
          setProjectMembers(result.data?.members ?? []);
          setIsMember(true);
        }
      } catch (error) {
        console.error("프로젝트 구성원 조회 실패:", error);
        if (!cancelled) setIsMember(false);
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    fetchMembers();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  if (checking) {
    return <StateView size="screen" title="권한을 확인하고 있습니다" />;
  }

  if (!isMember) {
    return (
      <StateView
        variant="error"
        size="screen"
        title="프로젝트 구성원만 회의를 생성할 수 있습니다"
        description="이 프로젝트에 참여하지 않아 회의 생성 권한이 없습니다."
        action={
          <Link to={PATHS.PROJECTS}>
            <Button size="action" variant="secondary">
              홈으로 가기
            </Button>
          </Link>
        }
      />
    );
  }

  const query = memberQuery.trim();

  const suggestions = query
    ? projectMembers.filter(
        (member) =>
          member.name?.includes(query) &&
          !participants.some((picked) => picked.userId === member.userId),
      )
    : [];

  // 안건 추가
  const handleAddAgenda = () => {
    if (!newAgenda.trim()) return;

    if (agenda.length >= FIELD_LIMITS.AGENDA_COUNT) {
      alert(`회의 안건은 최대 ${FIELD_LIMITS.AGENDA_COUNT}개까지 추가할 수 있습니다.`);
      return;
    }

    setAgenda((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: newAgenda.trim(),
      },
    ]);

    setNewAgenda("");
  };

  const agendaFull = agenda.length >= FIELD_LIMITS.AGENDA_COUNT;

  // 안건 삭제
  const handleRemoveAgenda = (id) => {
    setAgenda((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCreateMeeting = async () => {
    if (!projectId) {
      alert("프로젝트 정보가 없습니다.");
      return;
    }

    if (!title.trim()) {
      alert("회의 제목을 입력해주세요.");
      return;
    }

    if (!purpose.trim()) {
      alert("회의 목적을 입력해주세요.");
      return;
    }

    if (agenda.length === 0) {
      alert("회의 안건을 하나 이상 추가해주세요.");
      return;
    }

    if (!meetingDate) {
      alert("회의 날짜를 선택해주세요.");
      return;
    }

    if (!startTime) {
      alert("회의 시작 시각을 선택해주세요.");
      return;
    }

    if (memberQuery.trim()) {
      alert("참여자 검색을 완료하거나 검색창을 비워주세요.");
      return;
    }

    const currentMinute = new Date();
    currentMinute.setSeconds(0, 0);

    if (
      new Date(`${meetingDate}T${startTime}`).getTime() < currentMinute.getTime()
    ) {
      alert("지난 일시는 선택할 수 없어요. 회의 날짜와 시각을 다시 확인해주세요.");
      return;
    }

    try {
      setCreating(true);

      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
      }

      const requestBody = {
        title,
        purpose,

        // 추가된 안건만 서버로 전달
        agendas: agenda.map((item) => item.text),

        meetingDate,
        startTime,
        expectedDurationMinutes,

        participantUserIds: participants.map((member) => member.userId),
      };

      const response = await fetch(
        `${API_BASE_URL}/api/v1/projects/${projectId}/meetings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestBody),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || "회의 생성에 실패했습니다.");
      }

      alert("회의가 생성되었습니다.");

      navigate(projectPath("DETAIL", projectId), {
        replace: true,
      });
    } catch (error) {
      console.error("회의 생성 실패:", error);
      alert(toUserMessage(error));
    } finally {
      setCreating(false);
    }
  };

  return (
    <HeroLayout
      header={<Header {...HEADER_PRESETS.appOnLight} />}
      hero={
        <Hero
          size="sm"
          align="center"
          title="무엇을 이야기하나요?"
          description="안건을 적어두면 AI가 회의 전에 팀원들에게 먼저 물어봐요."
          descriptionWeight="medium"
        />
      }
    >
      <div className="flex w-full justify-center px-5 pt-12 pb-16 sm:px-8 lg:pt-[60px] lg:pb-[81px]">
        <div
          className={`${NEW_COLUMN}`}
        >
          <div className="flex w-full flex-col items-center gap-[34px]">
            <TextField
              tone="form"
              label="회의 제목"
              required
              limit={FIELD_LIMITS.MEETING_TITLE}
              placeholder={`예) 6차 기획 회의 (${FIELD_LIMITS.MEETING_TITLE}자 이내)`}
              wrapperClassName={NEW_COLUMN}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <TextAreaField
              tone="form"
              label="회의 목적"
              required
              limit={FIELD_LIMITS.MEETING_PURPOSE}
              placeholder={`이번 회의에서 무엇을 정하고 싶은지 적어주세요. (${FIELD_LIMITS.MEETING_PURPOSE}자 이내)`}
              wrapperClassName={NEW_COLUMN}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />

            <div className={`${NEW_COLUMN} flex flex-col gap-[18px]`}>
              <FieldLabel required>회의 안건</FieldLabel>

              <div className="flex flex-col gap-[6px]">
                <div className="flex flex-col gap-[10px]">
                  {agenda.length > 0 && (
                    <AgendaList items={agenda} onRemove={handleRemoveAgenda} />
                  )}

                  <input
                    type="text"
                    value={newAgenda}
                    onChange={(e) => setNewAgenda(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAgenda();
                      }

                      if (e.key === "Escape") {
                        setNewAgenda("");
                      }
                    }}
                    disabled={agendaFull}
                    placeholder={
                      agendaFull
                        ? `안건은 최대 ${FIELD_LIMITS.AGENDA_COUNT}개까지 추가할 수 있습니다`
                        : `안건을 입력하고 Enter (${FIELD_LIMITS.AGENDA}자 이내)`
                    }
                    aria-label="회의 안건 추가"
                    maxLength={FIELD_LIMITS.AGENDA}
                    onPaste={alertOnTruncatedPaste(FIELD_LIMITS.AGENDA)}
                    className="text-20 w-full rounded-[55px] border border-solid border-line px-[16px] py-[8px] font-medium text-ink outline-none transition-colors duration-150 placeholder:text-line focus:border-brand disabled:cursor-not-allowed"
                  />
                </div>

                <span
                  className={cn(
                    "text-14 self-end font-medium",
                    agendaFull ? "text-danger" : "text-muted",
                  )}
                >
                  {agenda.length}/{FIELD_LIMITS.AGENDA_COUNT}
                </span>
              </div>
            </div>

            <div className={`${NEW_COLUMN} flex flex-col gap-[18px]`}>
              <FieldLabel required>회의 일시</FieldLabel>

              <div className="flex w-full flex-wrap items-center gap-[12px] sm:gap-[16px] lg:w-full lg:flex-nowrap">
                <span className="inline-flex w-full sm:min-w-0 sm:flex-1">
                  <DatePicker
                    value={meetingDate}
                    onChange={setMeetingDate}
                    placeholder={now.dateHint}
                    ariaLabel="회의 날짜"
                    icon={
                      <img
                        src={calendarIcon}
                        alt=""
                        aria-hidden
                        className="block size-[20px] max-w-none shrink-0"
                      />
                    }
                  />
                </span>

                <span className="relative inline-flex w-[calc(50%-6px)] sm:w-[154px] sm:shrink-0">
                  <input
                    type="time"
                    aria-label="시작 시각"
                    value={startTime}
                    min={meetingDate === now.date ? now.time : undefined}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={cn(
                      PICKER_FIELD,
                      DATE_FIELD_TEXT[startTime ? "filled" : "empty"],
                    )}
                  />

                  {!startTime && (
                    <span className={HINT_TEXT}>{now.timeHint}</span>
                  )}

                  <span className={FIELD_ICON}>
                    <img
                      src={clockIcon}
                      alt=""
                      aria-hidden
                      className="block size-[20px] max-w-none"
                    />
                  </span>
                </span>

                <span className="inline-flex w-[calc(50%-6px)] sm:w-[160px] sm:shrink-0">
                  <Dropdown
                    value={expectedDurationMinutes}
                    onChange={setExpectedDurationMinutes}
                    ariaLabel="예상 소요 시간"
                    options={DURATION_OPTIONS}
                    icon={<ChevronRight className="rotate-90 text-muted" />}
                  />
                </span>
              </div>
            </div>

            <div className={`${NEW_COLUMN} flex flex-col gap-[18px]`}>
              <FieldLabel muted>참여자</FieldLabel>

              <div className="relative">
                <input
                  type="text"
                  value={memberQuery}
                  onChange={(e) => setMemberQuery(e.target.value)}
                  placeholder="이름을 입력하여 검색하세요."
                  aria-label="참여자 검색"
                  className="text-20 h-[66px] w-full rounded-[8px] border border-solid border-line px-[16px] py-[14px] font-medium text-ink outline-none transition-colors duration-150 placeholder:text-line focus:border-brand"
                />

                {suggestions.length > 0 && (
                  <ul className="absolute top-[calc(100%+6px)] left-0 z-20 flex w-full flex-col overflow-clip rounded-[8px] bg-white shadow-[10px_10px_30px_0px_rgba(0,0,0,0.06)]">
                    {suggestions.map((member) => (
                      <li key={member.userId}>
                        <button
                          type="button"
                          onClick={() => {
                            setParticipants((prev) => [...prev, member]);
                            setMemberQuery("");
                          }}
                          className="text-16 flex w-full cursor-pointer items-center px-[16px] py-[10px] text-left font-medium text-ink hover:bg-surface"
                        >
                          {member.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {query && suggestions.length === 0 && (
                  <p className="absolute top-[calc(100%+6px)] left-0 z-20 w-full rounded-[8px] bg-white px-[16px] py-[10px] text-16 font-medium text-muted shadow-[10px_10px_30px_0px_rgba(0,0,0,0.06)]">
                    일치하는 구성원이 없습니다.
                  </p>
                )}
              </div>

              {participants.length > 0 && (
                <div className="-mt-[5px] flex flex-wrap gap-[8px]">
                  {participants.map((member) => (
                    <Chip
                      key={member.userId}
                      label={member.name}
                      onRemove={() =>
                        setParticipants((prev) =>
                          prev.filter(
                            (picked) => picked.userId !== member.userId,
                          ),
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            <Button
              className={NEW_COLUMN}
              onClick={handleCreateMeeting}
              disabled={creating}
            >
              {creating ? "회의 생성 중..." : "회의 만들기"}
            </Button>
          </div>
        </div>
      </div>
    </HeroLayout>
  );
}
