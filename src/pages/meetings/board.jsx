import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import bubbleLarge from "@/assets/icons/board-bubble-lg.svg";
import bubbleSmall from "@/assets/icons/board-bubble-sm.svg";
import { Plus } from "@/components/icons";
import { Footer, Header, Hero, HeroLayout } from "@/components/layout";
import { Button } from "@/components/ui";
import {
  API_BASE_URL,
  HEADER_PRESETS,
  MEETING_TITLE,
  meetingPath,
} from "@/lib";

const CARD_COLORS = ["#fde2df", "#fef2d8", "#eff7da", "#dbf0ff"];

export function MeetingBoardPage() {
  const { projectId = "", meetingId = "" } = useParams();
  const navigate = useNavigate();

  // API에서 받아온 아이디어 카드 목록
  const [ideaCards, setIdeaCards] = useState([]);
  const [meetingTitle, setMeetingTitle] = useState(MEETING_TITLE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!meetingId) return;

    const fetchIdeaCards = async () => {
      try {
        setLoading(true);
        setError("");

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          alert("로그인이 필요합니다.");
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/v1/meetings/${meetingId}/idea-cards`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        const result = await response.json();

        //  에러 404 처리
        if (response.status === 404) {
          setError("아이디어 보드를 찾을 수 없거나 접근 권한이 없습니다.");
          return;
        }

        if (!response.ok || !result.success) {
          throw new Error(
            result.error?.message || "아이디어 보드 조회에 실패했습니다.",
          );
        }

        // 받아온 데이터를 상태에 저장
        setIdeaCards(result.data || []);
      } catch (err) {
        console.error("아이디어 카드 조회 실패:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchMeetingTitle = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch(
          `${API_BASE_URL}/api/v1/meetings/${meetingId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        const result = await response.json();

        if (response.ok && result.success && result.data?.title) {
          setMeetingTitle(result.data.title);
        }
      } catch (err) {
        console.error("회의 정보 조회 실패:", err);
      }
    };

    fetchIdeaCards();
    fetchMeetingTitle();
  }, [meetingId]);

  return (
    <HeroLayout
      header={<Header {...HEADER_PRESETS.appOnLight} />}
      hero={
        <Hero
          size="sm"
          align="left"
          surface="light"
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
          <p className="text-18 mt-10 font-medium text-[#858894]">
            팀원들의 아이디어 카드를 불러오는 중입니다... ⏳
          </p>
        ) : error ? (
          <p className="text-18 mt-10 font-medium text-[#da1e51]">{error}</p>
        ) : ideaCards.length === 0 ? (
          <p className="text-18 mt-10 font-medium text-[#858894]">
            아직 제출된 아이디어 카드가 없습니다. 첫 번째 카드의 주인공이
            되어보세요!
          </p>
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
