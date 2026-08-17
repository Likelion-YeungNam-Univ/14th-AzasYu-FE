import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import emptyMeetings from "@/assets/icons/empty-meetings.svg";
import { Copy, Plus } from "@/components/icons";
import { Header } from "@/components/layout";
import { StateView } from "@/components/states";
import { Toast } from "@/components/toast";
import { AvatarStack, Button, MeetingCard } from "@/components/ui";
import {
  API_BASE_URL,
  copyText,
  HEADER_PRESETS,
  projectPath,
  toUserMessage,
} from "@/lib";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

const getCurrentUserId = () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return "";
  }

  try {
    const base64Url = accessToken.split(".")[1];

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const paddedBase64 = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    const payload = JSON.parse(atob(paddedBase64));

    return String(payload.userId ?? payload.sub ?? payload.id ?? "");
  } catch (error) {
    console.error("JWT 사용자 ID 확인 실패:", error);
    return "";
  }
};

const getProjectDetail = async (projectId) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects/${projectId}`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`프로젝트 상세 조회 실패: ${response.status}`);
  }

  return response.json();
};

const getProjectMeetings = async (projectId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/projects/${projectId}/meetings`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(`회의 목록 조회 실패: ${response.status}`);
  }

  return response.json();
};

const readJson = async (url) => {
  try {
    const response = await fetch(url, {
      headers: authHeaders(),
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
};

const getMeetingProgress = async (meetingId) => {
  const [detail, record, result] = await Promise.all([
    readJson(`${API_BASE_URL}/api/v1/meetings/${meetingId}`),
    readJson(`${API_BASE_URL}/api/v1/meetings/${meetingId}/record`),
    readJson(`${API_BASE_URL}/api/v1/meetings/${meetingId}/result`),
  ]);

  const meetingDetail = detail?.data;
  const status = meetingDetail?.interviewStatus;

  const hasRecord = Boolean(record?.data);
  const hasResult = Boolean(
    result?.success && result?.data?.status === "GENERATED",
  );

  return {
    participants: meetingDetail?.participants ?? [],

    interviewStatus: status ?? {
      totalParticipants: meetingDetail?.participants?.length ?? 0,
      submittedCount: 0,
      mySubmitted: false,
    },

    participantsDone: status?.submittedCount ?? 0,

    participantsTotal:
      status?.totalParticipants ?? meetingDetail?.participants?.length ?? 0,

    mySubmitted: status?.mySubmitted ?? false,

    hasRecord,
    hasResult,
  };
};

const toStartsAt = (meeting) => {
  if (!meeting.meetingDate) {
    return meeting.startsAt ?? "";
  }

  return meeting.startTime
    ? `${meeting.meetingDate}T${meeting.startTime}`
    : meeting.meetingDate;
};

const toMeetingCards = async (rawMeetings) => {
  const progress = await Promise.all(
    rawMeetings.map((meeting) => getMeetingProgress(meeting.id)),
  );

  return rawMeetings.map((meeting, index) => ({
    ...meeting,
    startsAt: toStartsAt(meeting),
    ...progress[index],
  }));
};

export function ProjectDetailPage() {
  const { projectId = "" } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [meetings, setMeetings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentUserId, setCurrentUserId] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const [copyMessage, setCopyMessage] = useState("");

  const carouselRef = useRef(null);
  const activeIndexRef = useRef(0);
  const wheelLockRef = useRef(false);

  useEffect(() => {
    setCurrentUserId(getCurrentUserId());
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const carousel = carouselRef.current;
    const lastIndex = meetings.length - 1;

    if (!carousel || lastIndex < 1) {
      return;
    }

    let unlockTimer = 0;
    let lastMovedAt = 0;

    const handleWheel = (event) => {
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;

      if (!delta) {
        return;
      }

      const direction = delta > 0 ? 1 : -1;
      const nextIndex = activeIndexRef.current + direction;

      if (nextIndex < 0 || nextIndex > lastIndex) {
        return;
      }

      event.preventDefault();

      window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 120);

      if (wheelLockRef.current && event.timeStamp - lastMovedAt < 500) {
        return;
      }

      wheelLockRef.current = true;
      lastMovedAt = event.timeStamp;
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    };

    carousel.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      carousel.removeEventListener("wheel", handleWheel);
      window.clearTimeout(unlockTimer);
      wheelLockRef.current = false;
    };
  }, [meetings.length]);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const [projectResponse, meetingsResponse] = await Promise.all([
          getProjectDetail(projectId),
          getProjectMeetings(projectId),
        ]);

        if (!projectResponse.success) {
          throw new Error(
            projectResponse.error?.message || "프로젝트를 불러오지 못했습니다.",
          );
        }

        if (!meetingsResponse.success) {
          throw new Error(
            meetingsResponse.error?.message ||
              "회의 목록을 불러오지 못했습니다.",
          );
        }

        setProject(projectResponse.data);

        setMeetings(await toMeetingCards(meetingsResponse.data || []));
      } catch (error) {
        console.error("프로젝트 상세 조회 실패:", error);

        setError(toUserMessage(error));
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetail();
    }
  }, [projectId]);

  const handleCopyJoinCode = async () => {
    const joinCode = project?.joinCode;

    if (!joinCode) {
      return;
    }

    const copied = await copyText(joinCode);

    setCopyMessage(copied ? "참여코드를 복사했습니다." : "복사하지 못했습니다.");
  };

  if (loading) {
    return <StateView size="screen" title="프로젝트를 불러오는 중입니다" />;
  }

  if (error || !project) {
    return (
      <StateView
        variant="error"
        size="screen"
        title={error || "프로젝트를 찾을 수 없습니다."}
      />
    );
  }

  return (
    <div className="min-h-svh w-full bg-white">
      <Header {...HEADER_PRESETS.appOnLight} omitProjectNav />

      <div className="w-full bg-[#f5f5f5] py-10 lg:min-h-[300px] lg:pt-0 lg:pb-12">
        <div className="mx-auto flex w-full max-w-[562px] flex-col items-start px-5 sm:px-8 lg:px-8 lg:pt-[70px]">
          <p className="mb-[16px] w-full break-all line-clamp-3 text-34 font-bold text-[#1c232b] lg:text-48">
            {project.name}
          </p>

          <div className="flex w-full flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
            <div className="flex flex-col items-start gap-[16px]">
              <button
                type="button"
                onClick={handleCopyJoinCode}
                aria-label={`참여코드 ${project.joinCode} 복사`}
                className="text-18 flex cursor-pointer items-center gap-[8px] font-medium text-[#858894] lg:text-20"
              >
                참여코드 {project.joinCode}
                <Copy className="h-[15px] w-[14px]" />
              </button>

              <AvatarStack members={project.members ?? []} />
            </div>

            <Button
              size="action"
              variant="subtle"
              className="shrink-0"
              onClick={() => navigate(projectPath("MEETING_NEW", projectId))}
            >
              <Plus />새 회의
            </Button>
          </div>
        </div>
      </div>

      {meetings.length > 0 ? (
        <div className="mx-auto flex w-full flex-col items-center overflow-x-clip px-5 pt-20 pb-20 sm:px-8 lg:px-8 lg:pt-[120px] lg:pb-[150px]">
          <div
            ref={carouselRef}
            className="relative flex min-h-[550px] w-full max-w-[1000px] items-center justify-center overflow-visible"
          >
            {meetings.map((meeting, index) => {
              const diff = index - activeIndex;
              const absDiff = Math.abs(diff);

              if (absDiff > 3) return null;

              const translateX = diff * 140;
              const scale = 1 - absDiff * 0.15;
              const zIndex = 50 - absDiff;

              const opacity =
                absDiff === 0 ? 1 : Math.max(0, 0.5 - absDiff * 0.2);
              const blurStyle =
                absDiff === 0 ? "none" : `blur(${absDiff * 2}px)`;

              return (
                <div
                  key={meeting.id}
                  onClick={() => setActiveIndex(index)}
                  className="absolute w-full max-w-[calc(100%-40px)] sm:max-w-[600px] transition-all duration-500 ease-out"
                  style={{
                    transform: `translateX(${translateX}px) scale(${scale})`,
                    zIndex: zIndex,
                    opacity: opacity,
                    filter: blurStyle,
                    cursor: diff === 0 ? "default" : "pointer",
                  }}
                >
                  <div className={diff !== 0 ? "pointer-events-none" : ""}>
                    <div className="w-full rounded-[24px] bg-white shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.04]">
                      <MeetingCard
                        projectId={projectId}
                        meeting={meeting}
                        currentUserId={currentUserId}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <StateView
          variant="empty"
          size="page"
          icon={
            <img
              src={emptyMeetings}
              alt=""
              className="block h-[48.036px] w-[62.997px] max-w-none shrink-0"
            />
          }
          title="아직 회의가 없어요"
          description="첫 회의를 만들어 프로젝트를 시작해보세요!"
        />
      )}

      <Toast message={copyMessage} onDone={() => setCopyMessage("")} />
    </div>
  );
}
