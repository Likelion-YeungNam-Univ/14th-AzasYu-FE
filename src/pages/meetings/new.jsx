import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Plus } from "@/components/icons";
import { Header, Hero, HeroLayout } from "@/components/layout";
import {
  AgendaList,
  Button,
  Card,
  Chip,
  TextAreaField,
  TextField,
} from "@/components/ui";
import {
  API_BASE_URL,
  HEADER_PRESETS,
  HERO_CARD_OVERLAP,
  projectPath,
} from "@/lib";

const INITIAL_MEMBERS = [];

const NEW_COLUMN = "w-full max-w-[562px]";

export function MeetingNewPage() {
  const { projectId = "" } = useParams();
  const navigate = useNavigate();

  // 초기 안건은 없음
  const [agenda, setAgenda] = useState([]);

  const [members, setMembers] = useState(INITIAL_MEMBERS);

  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("");

  // 오늘 날짜를 기본값으로 사용
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [meetingDate, setMeetingDate] = useState(todayString);
  const [startTime, setStartTime] = useState("10:00");
  const [expectedDurationMinutes, setExpectedDurationMinutes] = useState(90);

  const [creating, setCreating] = useState(false);

  // 안건 입력창 표시 여부
  const [isAddingAgenda, setIsAddingAgenda] = useState(false);

  // 현재 작성 중인 안건
  const [newAgenda, setNewAgenda] = useState("");

  // 안건 추가
  const handleAddAgenda = () => {
    if (!newAgenda.trim()) {
      alert("안건을 입력해주세요.");
      return;
    }

    setAgenda((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: newAgenda.trim(),
      },
    ]);

    setNewAgenda("");
    setIsAddingAgenda(false);
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

    try {
      setCreating(true);

      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");

      if (!userId || !accessToken) {
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

        participantUserIds: [Number(userId)],
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

      console.log("회의 생성 요청:", requestBody);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || "회의 생성에 실패했습니다.");
      }

      console.log("회의 생성 성공:", result.data);

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
      overlapHeader
      cardOverlap={HERO_CARD_OVERLAP}
      header={<Header {...HEADER_PRESETS.appOnHero} />}
      hero={
        <Hero
          size="lg"
          align="center"
          title="회의 생성"
          description="새로운 회의를 시작해보세요."
        />
      }
    >
      <div className="flex w-full justify-center px-5 pb-16 sm:px-8 lg:pb-[175px]">
        <Card className="w-full max-w-[869px] px-6 py-10 sm:px-10 lg:px-[152px] lg:py-[88px]">
          <div className="mx-auto flex w-full max-w-[565px] flex-col items-center gap-[34px]">
            {/* 회의 제목 */}
            <TextField
              tone="form"
              label="회의 제목"
              placeholder="회의 제목을 입력하세요."
              wrapperClassName={NEW_COLUMN}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* 회의 목적 */}
            <TextAreaField
              tone="form"
              label="회의 목적"
              placeholder="이번 회의의 목적을 간단히 작성해주세요."
              wrapperClassName={NEW_COLUMN}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />

            {/* 회의 안건 */}
            <div className={`${NEW_COLUMN} flex flex-col gap-[18px]`}>
              <span className="text-20 font-medium text-[#717171]">
                회의 안건
              </span>

              {/* 추가된 안건 */}
              {agenda.length > 0 && (
                <AgendaList items={agenda} onRemove={handleRemoveAgenda} />
              )}

              {/* 안건 입력 */}
              {isAddingAgenda && (
                <div className="flex w-full gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={newAgenda}
                    onChange={(e) => setNewAgenda(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddAgenda();
                      }

                      if (e.key === "Escape") {
                        setNewAgenda("");
                        setIsAddingAgenda(false);
                      }
                    }}
                    placeholder="회의 안건을 입력하세요."
                    className="text-16 min-w-0 flex-1 rounded-[8px] border border-[#d0d0d0] px-4 py-3 outline-none focus:border-[#606060]"
                  />

                  <Button
                    variant="secondary"
                    size="small"
                    onClick={handleAddAgenda}
                  >
                    추가
                  </Button>
                </div>
              )}

              {/* 안건 추가 버튼 */}
              {!isAddingAgenda && (
                <Button
                  variant="secondary"
                  size="small"
                  className="w-[117px]"
                  onClick={() => setIsAddingAgenda(true)}
                >
                  <Plus />
                  안건 추가
                </Button>
              )}
            </div>

            {/* 회의 일시 */}
            <div className={`${NEW_COLUMN} flex flex-col gap-[18px]`}>
              <span className="text-20 font-medium text-[#717171]">
                회의 일시
              </span>

              <div className="flex flex-wrap items-end gap-[16px]">
                {/* 날짜 */}
                <div className="flex flex-col gap-2">
                  <label className="text-14 font-medium text-[#717171]">
                    날짜
                  </label>

                  <input
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="text-16 h-[52px] w-[217px] rounded-[8px] border border-[#d0d0d0] bg-white px-4 font-medium text-[#717171] outline-none focus:border-[#606060]"
                  />
                </div>

                {/* 시작 시간 */}
                <div className="flex flex-col gap-2">
                  <label className="text-14 font-medium text-[#717171]">
                    시작 시간
                  </label>

                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="text-16 h-[52px] w-[163px] rounded-[8px] border border-[#d0d0d0] bg-white px-4 font-medium text-[#717171] outline-none focus:border-[#606060]"
                  />
                </div>

                {/* 예상 시간 */}
                <div className="flex flex-col gap-2">
                  <label className="text-14 font-medium text-[#717171]">
                    예상 시간
                  </label>

                  <select
                    value={expectedDurationMinutes}
                    onChange={(e) =>
                      setExpectedDurationMinutes(Number(e.target.value))
                    }
                    className="text-16 h-[52px] w-[139px] rounded-[8px] border border-[#d0d0d0] bg-white px-4 font-medium text-[#717171] outline-none focus:border-[#606060]"
                  >
                    <option value={30}>30분</option>
                    <option value={60}>1시간</option>
                    <option value={90}>1시간 30분</option>
                    <option value={120}>2시간</option>
                    <option value={180}>3시간</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 참여자 */}
            <div className={`${NEW_COLUMN} flex flex-col gap-[18px]`}>
              <TextField
                tone="form"
                label="참여자"
                placeholder="이름을 입력하여 검색하세요."
              />

              <div className="-mt-[5px] flex flex-wrap gap-[12px]">
                {members.map((name) => (
                  <Chip
                    key={name}
                    label={name}
                    onRemove={() =>
                      setMembers((prev) => prev.filter((m) => m !== name))
                    }
                  />
                ))}
              </div>
            </div>

            {/* 회의 생성 */}
            <Button
              className={NEW_COLUMN}
              onClick={handleCreateMeeting}
              disabled={creating}
            >
              {creating ? "회의 생성 중..." : "회의 생성"}
            </Button>
          </div>
        </Card>
      </div>
    </HeroLayout>
  );
}
