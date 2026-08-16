import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Header, Hero, HeroLayout } from "@/components/layout";
import {
  AgendaList,
  Button,
  Chip,
  FieldLabel,
  TextAreaField,
  TextField,
} from "@/components/ui";
import {
  API_BASE_URL,
  cn,
  FIELD_LIMITS,
  HEADER_PRESETS,
  projectPath,
} from "@/lib";

const NEW_COLUMN = "w-full max-w-[562px]";

const DATE_FIELD =
  "text-16 h-[40px] cursor-pointer rounded-[8px] border border-solid border-[#b8bccc] bg-white px-[16px] py-[8px] font-medium outline-none";

const DATE_FIELD_TEXT = {
  filled: "text-[#1c232b]",
  empty: "text-transparent",
};

const HINT_TEXT =
  "text-16 pointer-events-none absolute inset-y-0 left-0 flex items-center px-[16px] font-medium text-[#b8bccc]";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const pad = (value) => String(value).padStart(2, "0");

const readNow = () => {
  const now = new Date();

  const hour = now.getHours();
  const meridiem = hour < 12 ? "오전" : "오후";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return {
    date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    time: `${pad(hour)}:${pad(now.getMinutes())}`,
    dateHint: `${now.getFullYear()}. ${pad(now.getMonth() + 1)}. ${pad(now.getDate())} (${WEEKDAYS[now.getDay()]})`,
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

        if (!response.ok || !result.success) return;

        if (!cancelled) {
          setProjectMembers(result.data?.members ?? []);
        }
      } catch (error) {
        console.error("프로젝트 구성원 조회 실패:", error);
      }
    };

    fetchMembers();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

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

    setAgenda((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: newAgenda.trim(),
      },
    ]);

    setNewAgenda("");
  };

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
      alert(error.message);
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
        <div className={NEW_COLUMN}>
          <div className="flex w-full flex-col items-center gap-[34px]">
            {/* 회의 제목 */}
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

            {/* 회의 목적 */}
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

            {/* 회의 안건 */}
            <div className={`${NEW_COLUMN} flex flex-col gap-[18px]`}>
              <FieldLabel required>회의 안건</FieldLabel>

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
                  placeholder="안건을 입력하고 Enter"
                  aria-label="회의 안건 추가"
                  maxLength={FIELD_LIMITS.AGENDA}
                  className="text-20 w-full rounded-[55px] border border-solid border-[#b8bccc] px-[16px] py-[8px] font-medium text-[#1c232b] outline-none placeholder:text-[#b8bccc]"
                />
              </div>
            </div>

            {/* 회의 일시 */}
            <div className={`${NEW_COLUMN} flex flex-col gap-[18px]`}>
              <FieldLabel required>회의 일시</FieldLabel>

              <div className="flex w-full flex-wrap items-center gap-[22px] lg:w-[565px] lg:flex-nowrap">
                <span className="relative inline-flex w-[217px]">
                  <input
                    type="date"
                    aria-label="회의 날짜"
                    value={meetingDate}
                    min={now.date}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className={cn(
                      DATE_FIELD,
                      DATE_FIELD_TEXT[meetingDate ? "filled" : "empty"],
                      "w-full",
                    )}
                  />

                  {!meetingDate && (
                    <span className={HINT_TEXT}>{now.dateHint}</span>
                  )}
                </span>

                <span className="relative inline-flex w-[163px]">
                  <input
                    type="time"
                    aria-label="시작 시각"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={cn(
                      DATE_FIELD,
                      DATE_FIELD_TEXT[startTime ? "filled" : "empty"],
                      "w-full",
                    )}
                  />

                  {!startTime && (
                    <span className={HINT_TEXT}>{now.timeHint}</span>
                  )}
                </span>

                <select
                  aria-label="예상 소요 시간"
                  value={expectedDurationMinutes}
                  onChange={(e) =>
                    setExpectedDurationMinutes(Number(e.target.value))
                  }
                  className={cn(DATE_FIELD, DATE_FIELD_TEXT.filled, "w-[139px]")}
                >
                  <option value={30}>약 30분</option>
                  <option value={60}>약 1시간</option>
                  <option value={90}>약 1시간 30분</option>
                  <option value={120}>약 2시간</option>
                  <option value={180}>약 3시간</option>
                </select>
              </div>
            </div>

            {/* 참여자 */}
            <div className={`${NEW_COLUMN} flex flex-col gap-[18px]`}>
              <FieldLabel muted>참여자</FieldLabel>

              <div className="relative">
                <input
                  type="text"
                  value={memberQuery}
                  onChange={(e) => setMemberQuery(e.target.value)}
                  placeholder="이름을 입력하여 검색하세요."
                  aria-label="참여자 검색"
                  className="text-20 h-[66px] w-full rounded-[8px] border border-solid border-[#b8bccc] px-[16px] py-[14px] font-medium text-[#1c232b] outline-none placeholder:text-[#b8bccc]"
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
                          className="text-16 flex w-full cursor-pointer items-center px-[16px] py-[10px] text-left font-medium text-[#1c232b] hover:bg-[#f5f5f5]"
                        >
                          {member.name}
                        </button>
                      </li>
                    ))}
                  </ul>
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

            {/* 회의 생성 */}
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
