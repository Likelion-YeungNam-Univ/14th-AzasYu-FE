import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import bubbleLarge from "@/assets/icons/board-bubble-lg.svg";
import bubbleSmall from "@/assets/icons/board-bubble-sm.svg";
import { Plus } from "@/components/icons";
import { Footer, Header, Hero, HeroLayout } from "@/components/layout";
import { StateView } from "@/components/states";
import { Button } from "@/components/ui";
import {
  API_BASE_URL,
  FIELD_LIMITS,
  getCurrentUserId,
  HEADER_PRESETS,
  MEETING_TITLE,
  meetingPath,
  PATHS,
  toUserMessage,
} from "@/lib";

const CARD_COLORS = ["#fde2df", "#fef2d8", "#eff7da", "#dbf0ff"];

const parseCoreOpinion = (text) => {
  if (!text) return [];

  const regex = /\[(.*?)\]([^[]*)/g;
  const matches = [...text.matchAll(regex)];

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

const squash = (text) => (text || "").replace(/\s+/g, "").toLowerCase();

const buildEditRows = (card, agendas) => {
  const blocks = parseCoreOpinion(card.coreOpinion);
  const used = new Set();

  const rows = agendas.map((agenda) => {
    const target = squash(agenda.content);

    const matchedIndex = blocks.findIndex((block, idx) => {
      if (used.has(idx) || !block.badge) return false;

      const badge = squash(block.badge);

      return badge.includes(target) || target.includes(badge);
    });

    if (matchedIndex !== -1) used.add(matchedIndex);

    return {
      key: `agenda-${agenda.id ?? agenda.order}`,
      label: `안건 ${agenda.order}`,
      badge: agenda.content,
      value: matchedIndex === -1 ? "" : blocks[matchedIndex].text,
    };
  });

  const extras = blocks
    .map((block, idx) => ({ block, idx }))
    .filter(({ idx }) => !used.has(idx))
    .filter(({ block }) => block.text || block.badge)
    .map(({ block, idx }) => ({
      key: `extra-${idx}`,
      label: block.badge ? "안건 목록에 없는 의견" : "안건 없이 작성한 의견",
      badge: block.badge,
      value: block.text,
    }));

  return [...rows, ...extras];
};

const composeCoreOpinion = (rows) =>
  rows
    .filter((row) => row.value.trim())
    .map((row) =>
      row.badge ? `[${row.badge}] ${row.value.trim()}` : row.value.trim(),
    )
    .join("\n\n");

export function MeetingBoardPage() {
  const { projectId = "", meetingId = "" } = useParams();
  const navigate = useNavigate();

  const [ideaCards, setIdeaCards] = useState([]);
  const [meetingTitle, setMeetingTitle] = useState(MEETING_TITLE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [isParticipant, setIsParticipant] = useState(false);
  const [mySubmitted, setMySubmitted] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);

  const [agendas, setAgendas] = useState([]);

  const [editingCard, setEditingCard] = useState(null);
  const [editRows, setEditRows] = useState([]);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (!selectedCard && !editingCard) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedCard(null);
        setEditingCard(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedCard, editingCard]);

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

          setAgendas(
            [...(meetingResult.data?.agendas ?? [])].sort(
              (a, b) => (a.order ?? 0) - (b.order ?? 0),
            ),
          );

          const currentUserId = getCurrentUserId();
          const participants = meetingResult.data?.participants ?? [];

          const participant = participants.some(
            (p) =>
              String(p.userId ?? p.id ?? p.memberId) === String(currentUserId),
          );

          setIsParticipant(participant);

          setMySubmitted(
            meetingResult.data?.interviewStatus?.mySubmitted ?? false,
          );

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

  const handleEditOpen = (card) => {
    setSelectedCard(null);
    setEditingCard(card);
    setEditRows(buildEditRows(card, agendas));
  };

  const handleRowChange = (key, value) => {
    setEditRows((prev) =>
      prev.map((row) => (row.key === key ? { ...row, value } : row)),
    );
  };

  const handleEditSubmit = async () => {
    const coreOpinion = composeCoreOpinion(editRows);

    if (!coreOpinion) {
      alert("최소 한 개의 안건에 의견을 입력해주세요.");
      return;
    }

    if (coreOpinion.length > FIELD_LIMITS.IDEA_CORE_OPINION) {
      alert(
        `의견을 모두 합쳐 ${FIELD_LIMITS.IDEA_CORE_OPINION}자를 넘을 수 없습니다.`,
      );
      return;
    }

    try {
      setEditLoading(true);
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/meetings/${meetingId}/idea-cards/${editingCard.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            coreOpinion,
            rationale: editingCard.rationale ?? "",
            concern: editingCard.concern ?? "",
            alternative: editingCard.alternative ?? "",
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || "카드 수정에 실패했습니다.");
      }

      setIdeaCards((prev) =>
        prev.map((c) => (c.id === editingCard.id ? result.data : c)),
      );
      setEditingCard(null);
    } catch (err) {
      console.error("카드 수정 실패:", err);
      alert(toUserMessage(err));
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (cardId) => {
    if (!confirm("아이디어 카드를 삭제하시겠습니까?")) return;

    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/meetings/${meetingId}/idea-cards/${cardId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error?.message || "카드 삭제에 실패했습니다.");
      }

      setIdeaCards((prev) => prev.filter((c) => c.id !== cardId));
      setSelectedCard(null);
    } catch (err) {
      console.error("카드 삭제 실패:", err);
      alert(toUserMessage(err));
    }
  };

  const composedLength = composeCoreOpinion(editRows).length;
  const composedOverflow = composedLength > FIELD_LIMITS.IDEA_CORE_OPINION;

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
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 lg:mt-[93px]">
          <p className="text-24 min-w-0 flex-1 break-words font-semibold text-ink lg:text-28">
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

            {!mySubmitted && (
              <Button
                size="action"
                variant="subtle"
                onClick={() =>
                  navigate(meetingPath("INTERVIEW", projectId, meetingId))
                }
              >
                <Plus size={26} strokeWidth={2} />
                아이디어 추가하기
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <StateView title="아이디어 카드를 불러오는 중입니다" />
        ) : error ? (
          <StateView
            variant="error"
            title={error}
            action={
              <Button
                size="action"
                variant="secondary"
                onClick={() => window.location.reload()}
              >
                다시 시도
              </Button>
            }
          />
        ) : ideaCards.length === 0 ? (
          <StateView
            variant="empty"
            title="아직 제출된 아이디어 카드가 없어요"
            description="첫 번째 카드의 주인공이 되어보세요!"
          />
        ) : (
          <ul className="mt-6 grid grid-cols-1 gap-[25px] sm:grid-cols-2 lg:mt-[25px] lg:grid-cols-3">
            {ideaCards.map((card, index) => {
              const blocks = parseCoreOpinion(card.coreOpinion);

              return (
                <li
                  key={card.id}
                  onClick={() => setSelectedCard({ data: card, index, blocks })}
                  style={{
                    backgroundColor: CARD_COLORS[index % CARD_COLORS.length],
                  }}
                  className="relative flex h-[265px] flex-col cursor-pointer rounded-[14px] px-[24px] py-[32px] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg sm:px-[40px]"
                >
                  <div className="flex min-h-0 w-full flex-1 flex-col gap-[20px] overflow-y-auto pr-2 [mask-image:linear-gradient(to_bottom,black_calc(100%-28px),transparent)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {blocks.map((block, idx) => (
                      <div key={idx} className="flex flex-col gap-[10px]">
                        {block.badge && (
                          <span className="w-fit max-w-full rounded-full bg-black/10 px-[14px] py-[6px] text-14 font-bold break-words text-ink lg:text-16">
                            {block.badge}
                          </span>
                        )}
                        {block.text && (
                          <p className="text-18 w-full break-words whitespace-pre-line font-medium text-ink lg:text-20">
                            {block.text}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {card.isMine && (
                    <div className="mt-[8px] flex h-[25px] shrink-0 items-center justify-end gap-[16px]">
                      <button
                        type="button"
                        aria-label="카드 수정"
                        title="수정"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditOpen(card);
                        }}
                        className="flex size-[20px] cursor-pointer items-center justify-center text-muted transition-colors hover:text-brand focus-visible:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                      >
                        <FiEdit2 size={20} />
                      </button>
                      <button
                        type="button"
                        aria-label="카드 삭제"
                        title="삭제"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(card.id);
                        }}
                        className="flex size-[20px] cursor-pointer items-center justify-center text-muted transition-colors hover:text-danger focus-visible:text-danger focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-danger"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  )}
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
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="relative flex w-full max-w-[700px] flex-col rounded-[24px] p-8 shadow-2xl sm:p-12"
            style={{
              backgroundColor:
                CARD_COLORS[selectedCard.index % CARD_COLORS.length],
              maxHeight: "80vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedCard(null)}
              className="absolute top-5 right-5 flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-full bg-ink/10 text-18 font-bold text-ink/60 transition-colors hover:bg-ink/20 hover:text-ink"
            >
              ✕
            </button>

            <div className="flex min-h-0 w-full flex-col gap-[24px] overflow-y-auto pr-3 [mask-image:linear-gradient(to_bottom,black_calc(100%-28px),transparent)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {selectedCard.blocks.map((block, idx) => (
                <div key={idx} className="flex flex-col gap-[12px]">
                  {block.badge && (
                    <span className="w-fit max-w-full rounded-full bg-black/10 px-[16px] py-[8px] text-16 font-bold break-words text-ink sm:text-18">
                      {block.badge}
                    </span>
                  )}
                  {block.text && (
                    <p className="text-20 w-full break-words whitespace-pre-line font-medium leading-relaxed text-ink sm:text-24">
                      {block.text}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {selectedCard.data.isMine && (
              <div className="mt-[16px] flex shrink-0 items-center justify-end gap-[16px]">
                <button
                  type="button"
                  aria-label="카드 수정"
                  title="수정"
                  onClick={() => handleEditOpen(selectedCard.data)}
                  className="flex size-[20px] cursor-pointer items-center justify-center text-muted transition-colors hover:text-brand focus-visible:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  <FiEdit2 size={20} />
                </button>
                <button
                  type="button"
                  aria-label="카드 삭제"
                  title="삭제"
                  onClick={() => handleDelete(selectedCard.data.id)}
                  className="flex size-[20px] cursor-pointer items-center justify-center text-muted transition-colors hover:text-danger focus-visible:text-danger focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-danger"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {editingCard && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm"
          onClick={() => setEditingCard(null)}
        >
          <div
            className="relative flex w-full max-w-[600px] flex-col gap-[20px] rounded-[24px] bg-white p-8 shadow-2xl sm:p-10"
            style={{ maxHeight: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-[6px]">
              <p className="text-24 font-bold text-ink">내 의견 수정</p>
              <p className="text-16 font-medium text-muted">
                안건마다 내 의견을 고칠 수 있어요. 비워 두면 그 안건은 보드에
                올라가지 않아요.
              </p>
            </div>

            <div className="flex flex-col gap-[20px] overflow-y-auto pr-1">
              {editRows.length === 0 ? (
                <p className="text-16 font-medium text-muted">
                  수정할 안건을 불러오지 못했습니다.
                </p>
              ) : (
                editRows.map((row) => (
                  <label key={row.key} className="flex flex-col gap-[8px]">
                    <span className="text-14 font-semibold text-muted">
                      {row.label}
                    </span>

                    {row.badge && (
                      <span className="w-fit max-w-full rounded-full bg-brand-soft px-[14px] py-[6px] text-14 font-bold break-words text-ink">
                        {row.badge}
                      </span>
                    )}

                    <textarea
                      value={row.value}
                      onChange={(e) => handleRowChange(row.key, e.target.value)}
                      placeholder="이 안건에 대한 의견을 적어주세요."
                      className="h-[92px] w-full resize-none rounded-[8px] border border-line px-[16px] py-[12px] text-16 font-medium text-ink outline-none placeholder:text-line focus:border-brand"
                    />
                  </label>
                ))
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-[12px] border-t border-divider pt-[16px]">
              <span
                className={`text-14 font-medium ${
                  composedOverflow ? "text-danger" : "text-muted"
                }`}
              >
                전체 {composedLength}/{FIELD_LIMITS.IDEA_CORE_OPINION}
              </span>

              <div className="flex items-center gap-[12px]">
                <Button
                  size="pill"
                  variant="secondary"
                  onClick={() => setEditingCard(null)}
                  disabled={editLoading}
                >
                  취소
                </Button>
                <Button
                  size="pill"
                  onClick={handleEditSubmit}
                  disabled={editLoading || composedOverflow}
                >
                  {editLoading ? "수정 중..." : "수정 완료"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </HeroLayout>
  );
}
