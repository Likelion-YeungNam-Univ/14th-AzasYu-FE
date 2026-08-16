import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import bubbleLarge from "@/assets/icons/board-bubble-lg.svg";
import bubbleSmall from "@/assets/icons/board-bubble-sm.svg";
import { Plus } from "@/components/icons";
import { Footer, Header, Hero, HeroLayout } from "@/components/layout";
import { StateView } from "@/components/states";
import { Button } from "@/components/ui";
import {
  API_BASE_URL,
  HEADER_PRESETS,
  MEETING_TITLE,
  meetingPath,
} from "@/lib";

const CARD_COLORS = ["#fde2df", "#fef2d8", "#eff7da", "#dbf0ff"];

const getCurrentUserId = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return "";

  try {
    const base64Url = accessToken.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(paddedBase64));
    return String(payload.userId ?? payload.sub ?? payload.id ?? "");
  } catch {
    return "";
  }
};

export function MeetingBoardPage() {
  const { projectId = "", meetingId = "" } = useParams();
  const navigate = useNavigate();

  const [ideaCards, setIdeaCards] = useState([]);
  const [meetingTitle, setMeetingTitle] = useState(MEETING_TITLE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [isParticipant, setIsParticipant] = useState(false);

  useEffect(() => {
    if (!meetingId) return;

    const checkParticipantAndFetch = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          alert("로그인이 필요합니다.");
          return;
        }

        const meetingResponse = await fetch(
          `${API_BASE_URL}/api/v1/meetings/${meetingId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        const meetingResult = await meetingResponse.json();

        if (meetingResponse.ok && meetingResult.success) {
          if (meetingResult.data?.title) {
            setMeetingTitle(meetingResult.data.title);
          }

          const currentUserId = getCurrentUserId();
          const participants = meetingResult.data?.participants ?? [];

          const participant = participants.some(
            (p) =>
              String(p.userId ?? p.id ?? p.memberId) ===
              String(currentUserId),
          );

          setIsParticipant(participant);

          if (!participant) {
            setChecking(false);
            setLoading(false);
            return;
          }
        } else {
          setIsParticipant(false);
          setChecking(false);
          setLoading(false);
          return;
        }

        setChecking(false);

        const response = await fetch(
          `${API_BASE_URL}/api/v1/meetings/${meetingId}/idea-cards`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        const result = await response.json();

        if (response.status === 404) {
          setError("아이디어 보드를 찾을 수 없습니다.");
          return;
        }

        if (!response.ok || !result.success) {
          throw new Error(
            result.error?.message || "아이디어 보드 조회에 실패했습니다.",
          );
        }

        setIdeaCards(result.data || []);
      } catch (err) {
        console.error("아이디어 카드 조회 실패:", err);
        setError(err.message);
      } finally {
        setChecking(false);
        setLoading(false);
      }
    };

    checkParticipantAndFetch();
  }, [meetingId]);

  if (checking) {
    return <StateView size="screen" title="권한을 확인하고 있습니다" />;
  }

  if (!isParticipant) {
    return (
      <StateView
        variant="error"
        size="screen"
        title="회의 참여자만 접근할 수 있습니다"
        description="이 회의에 참여하지 않아 아이디어 보드를 볼 수 없습니다."
      />
    );
  }

  return (
    <HeroLayout
      header={<Header {...HEADER_PRESETS.appOnLight} />}
      hero={
        <Hero
          size="sm"
          align="left"
          title="모두의 생각을 한곳에."
          description={`${meetingTitle} · 누가 썼는지는 아무도 알 수 없어요.`}
          descriptionWeight="medium"
          decoration={
            <>
              <img
                src={bubbleLarge}
                alt=""
                aria-hidden
                className="absolute top-[96px] left-[755.75px] hidden h-[55.511px] w-[72.802px] max-w-none lg:block"
              />

              <img
                src={bubbleSmall}
                alt=""
                aria-hidden
                className="absolute top-[151.78px] left-[700px] hidden h-[38.223px] w-[50.051px] max-w-none lg:block"
              />
            </>
          }
        />
      }
    >
      <div className="mx-auto w-full max-w-[1460px] px-5 pb-16 sm:px-8 lg:px-0 lg:pb-[170px]">
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 lg:mt-[93px]">
          <p className="text-24 font-semibold text-[#1c232b] lg:text-28">
            {meetingTitle}
          </p>

          <Button
            size="action"
            variant="subtle"
            onClick={() =>
              navigate(meetingPath("INTERVIEW", projectId, meetingId))
            }
          >
            <Plus />
            아이디어 추가하기
          </Button>
        </div>

        {/* 데이터 로딩 중이거나 에러/빈 화면 처리 */}
        {loading ? (
          <StateView title="아이디어 카드를 불러오는 중입니다" />
        ) : error ? (
          <StateView variant="error" title={error} />
        ) : ideaCards.length === 0 ? (
          <StateView
            variant="empty"
            title="아직 제출된 아이디어 카드가 없어요"
            description="첫 번째 카드의 주인공이 되어보세요!"
          />
        ) : (
          /* 아이디어 카드 렌더링 */
          <ul className="mt-6 grid grid-cols-1 gap-[25px] sm:grid-cols-2 lg:mt-[25px] lg:grid-cols-3">
            {ideaCards.map((card, index) => (
              <li
                key={card.id}
                style={{
                  backgroundColor: CARD_COLORS[index % CARD_COLORS.length],
                }}
                className="flex h-[265px] items-center justify-center rounded-[14px] px-[24px] py-[36px] sm:px-[40px]"
              >
                <p className="text-18 h-[168px] w-full overflow-hidden font-medium text-[#1c232b] lg:text-20">
                  {card.coreOpinion}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Footer />
    </HeroLayout>
  );
}
