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
  getCurrentUserId,
  HEADER_PRESETS,
  MEETING_TITLE,
  meetingPath,
  toUserMessage,
} from "@/lib";

const CARD_COLORS = ["#fde2df", "#fef2d8", "#eff7da", "#dbf0ff"];

const parseCoreOpinion = (text) => {
  if (!text) return [];

  const regex = /\[(.*?)\]([^[]*)/g;
  const matches = [...text.matchAll(regex)];

  // 태그가 없는 일반 텍스트
  if (matches.length === 0) {
    return [{ badge: null, text: text }];
  }

  const results = [];

  const firstMatchIndex = text.indexOf(matches[0][0]);
  if (firstMatchIndex > 0) {
    const prefix = text.slice(0, firstMatchIndex).trim();
    if (prefix) results.push({ badge: null, text: prefix });
  }

  matches.forEach((match) => {
    results.push({
      badge: match[1].trim(),
      text: match[2].trim(),
    });
  });

  return results;
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

  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    if (!selectedCard) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setSelectedCard(null);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedCard]);

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
              String(p.userId ?? p.id ?? p.memberId) === String(currentUserId),
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
        setError(toUserMessage(err));
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
          description={
            <span className="line-clamp-2 break-words">
              {meetingTitle} · 누가 썼는지는 아무도 알 수 없어요.
            </span>
          }
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
      <div className="mx-auto w-full max-w-[1460px] px-5 pb-16 sm:px-8 lg:px-8 xl:px-12 lg:pb-[170px]">
        <div style={{ animationDelay: "700ms" }}
          className="animate-lift-in mt-10 flex flex-wrap items-center justify-between gap-4 lg:mt-[93px]">
          <p className="text-24 min-w-0 flex-1 break-words font-semibold text-[#1c232b] lg:text-28">
            {meetingTitle}
          </p>

          <div className="flex shrink-0 flex-wrap items-center gap-[12px]">
            <Button
              size="action"
              variant="subtle"
              onClick={() =>
                navigate(meetingPath("SUMMARY", projectId, meetingId))
              }
            >
              전체 의견 요약 보기
            </Button>

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
        </div>

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
            {ideaCards.map((card, index) => {
              const blocks = parseCoreOpinion(card.coreOpinion);

              return (
                <li
                  key={card.id}
                  // ✨ 1. 클릭 시 카드 정보, 색상 인덱스, 분리된 블록 데이터를 저장합니다.
                  onClick={() => setSelectedCard({ data: card, index, blocks })}
                  style={{
                    backgroundColor: CARD_COLORS[index % CARD_COLORS.length],
                    animationDelay: `${800 + (index % 3) * 90}ms`,
                  }}
                  // ✨ 2. 마우스를 올리면 살짝 떠오르며 그림자가 생기도록 hover 효과를 줍니다. (cursor-pointer 추가)
                  className="animate-lift-in flex h-[265px] flex-col cursor-pointer rounded-[14px] px-[24px] py-[36px] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg sm:px-[40px]"
                >
                  <div className="flex h-full w-full flex-col gap-[20px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {blocks.map((block, idx) => (
                      <div key={idx} className="flex flex-col gap-[10px]">
                        {block.badge && (
                          <span className="w-fit rounded-full bg-black/10 px-[14px] py-[6px] text-14 font-bold text-[#1c232b] lg:text-16">
                            {block.badge}
                          </span>
                        )}
                        {block.text && (
                          <p className="text-18 w-full break-words whitespace-pre-line font-medium text-[#1c232b] lg:text-20">
                            {block.text}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Footer />

      {selectedCard && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm"
          onClick={() => setSelectedCard(null)} // 어두운 배경 클릭 시 닫힘
        >
          <div
            className="relative flex w-full max-w-[700px] flex-col rounded-[24px] p-8 shadow-2xl sm:p-12"
            style={{
              // 클릭했던 카드의 원래 배경색을 그대로 유지합니다.
              backgroundColor:
                CARD_COLORS[selectedCard.index % CARD_COLORS.length],
              maxHeight: "80vh", // 화면 밖으로 넘어가지 않도록 높이 제한
            }}
            onClick={(e) => e.stopPropagation()} // 모달 안쪽을 클릭했을 때는 안 닫히게 막음
          >
            <button
              type="button"
              onClick={() => setSelectedCard(null)}
              className="absolute top-5 right-5 flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-full bg-[#1c232b]/10 text-18 font-bold text-[#1c232b]/60 transition-colors hover:bg-[#1c232b]/20 hover:text-[#1c232b]"
            >
              ✕
            </button>

            <div className="flex w-full flex-col gap-[24px] overflow-y-auto pr-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {selectedCard.blocks.map((block, idx) => (
                <div key={idx} className="flex flex-col gap-[12px]">
                  {block.badge && (
                    <span className="w-fit rounded-full bg-black/10 px-[16px] py-[8px] text-16 font-bold text-[#1c232b] sm:text-18">
                      {block.badge}
                    </span>
                  )}
                  {block.text && (
                    <p className="text-20 w-full break-words whitespace-pre-line font-medium leading-relaxed text-[#1c232b] sm:text-24">
                      {block.text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </HeroLayout>
  );
}
