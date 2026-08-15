import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Footer, Header, Hero, HeroLayout } from "@/components/layout";
import { API_BASE_URL, HEADER_PRESETS, MEETING_TITLE } from "@/lib";

export function MeetingBoardPage() {
  const { projectId = "", meetingId = "" } = useParams();

  // API에서 받아온 아이디어 카드 목록
  const [ideaCards, setIdeaCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BG_COLORS = ["#d1d1d1", "#e6e6e6", "#cfcfcf"];

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

    fetchIdeaCards();
  }, [meetingId]);

  return (
    <HeroLayout
      header={<Header {...HEADER_PRESETS.appOnLight} />}
      hero={
        <Hero
          size="sm"
          align="left"
          title="아이디어 보드"
          description="모두의 생각을 한곳에"
          descriptionWeight="semibold"
        />
      }
    >
      <div className="mx-auto w-full max-w-[1460px] px-5 pb-16 sm:px-8 lg:px-0 lg:pb-[162px]">
        <p className="text-24 mt-10 font-semibold text-[#717171] lg:mt-[94px] lg:text-28">
          {`${MEETING_TITLE} 익명 아이디어 보드`}
        </p>

        {/* 데이터 로딩 중이거나 에러/빈 화면 처리 */}
        {loading ? (
          <p className="mt-10 text-18 font-medium text-[#717171]">
            팀원들의 아이디어 카드를 불러오는 중입니다... ⏳
          </p>
        ) : error ? (
          <p className="mt-10 text-18 font-medium text-red-500">{error}</p>
        ) : ideaCards.length === 0 ? (
          <p className="mt-10 text-18 font-medium text-[#717171]">
            아직 제출된 아이디어 카드가 없습니다. 첫 번째 카드의 주인공이
            되어보세요!
          </p>
        ) : (
          /* 아이디어 카드 렌더링 */
          <ul className="mt-6 grid grid-cols-1 gap-[25px] sm:grid-cols-2 lg:mt-[41.8px] lg:grid-cols-3">
            {ideaCards.map((card, index) => (
              <li
                key={card.id}
                style={{ backgroundColor: BG_COLORS[index % BG_COLORS.length] }}
                className="flex flex-col min-h-[265px] rounded-[14px] px-[24px] py-[24px] text-[#717171] sm:px-[40px] sm:py-[36px]"
              >
                {/* 핵심 의견 */}
                <div className="mb-4">
                  <span className="inline-block bg-[#717171] text-white text-12 font-bold px-3 py-1 rounded-full mb-2">
                    핵심 아이디어
                  </span>
                  <h3 className="text-20 lg:text-24 font-bold leading-tight text-[#333]">
                    {card.coreOpinion}
                  </h3>
                </div>

                {/* 근거, 우려점, 대안 */}
                <div className="flex flex-col gap-2 text-14 lg:text-16 mt-auto">
                  {card.rationale && (
                    <p className="leading-snug">
                      <strong>💡 근거:</strong> {card.rationale}
                    </p>
                  )}
                  {card.concern && (
                    <p className="leading-snug">
                      <strong>⚠️ 우려:</strong> {card.concern}
                    </p>
                  )}
                  {card.alternative && (
                    <p className="leading-snug">
                      <strong>✅ 대안:</strong> {card.alternative}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Footer />
    </HeroLayout>
  );
}
