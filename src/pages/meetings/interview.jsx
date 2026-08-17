import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import sendIcon from "@/assets/icons/send.svg";
import { Header, Hero, HeroLayout } from "@/components/layout";
import { StateView } from "@/components/states";
import { Button, Card } from "@/components/ui";
import {
  API_BASE_URL,
  HEADER_PRESETS,
  meetingPath,
  toUserMessage,
} from "@/lib";

const buildIntro = (userName) => [
  [
    userName ? `안녕하세요, ${userName}님! 👋` : "안녕하세요! 👋",
    userName
      ? `회의를 시작하기 전에 ${userName}님의 생각을 먼저 들어볼게요.`
      : "회의를 시작하기 전에 생각을 먼저 들어볼게요.",
  ],
  [
    "이 대화에서 나눈 의견은 익명으로 수집되니 부담 갖지 말고 편하게 이야기해주세요.",
    "정해진 답은 없어요. 지금 떠오르는 생각을 솔직하게 들려주시면 됩니다.",
  ],
];

function BotMessage({ children, bubbleTop }) {
  return (
    <div className="flex gap-[8px]">
      <span className="mt-[2px] size-[32px] shrink-0 rounded-full bg-[#def4ec]" />

      <div className="flex min-w-0 flex-col">
        <p className="text-16 font-medium text-[#1c232b]">AI 챗봇</p>

        <div
          style={{ marginTop: bubbleTop - 22.4 }}
          className="text-16 w-fit rounded-[20px] border border-solid border-[#b8bccc] bg-white px-[20px] py-[12px] leading-[1.5] font-medium text-[#1c232b]"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function UserMessage({ children, tone = "primary" }) {
  return (
    <div className="flex w-full justify-end">
      <p
        className={`text-16 max-w-[479px] rounded-[26px] px-[20px] py-[12px] leading-[1.5] font-medium text-white ${
          tone === "dark" ? "bg-[#1c232b]" : "bg-[#0075d3]"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

const FIRST_SCROLL_DELAY_MS = 2400;

export function MeetingInterviewPage() {
  const { projectId = "", meetingId = "" } = useParams();
  const navigate = useNavigate();

  // API에서 받아온 질문 목록
  const [questions, setQuestions] = useState([]);

  // 공통 질문 상태 관리 (LOADING, PENDING, GENERATED, FAILED, NOT_CONFIGURED, NOT_FOUND, ERROR)
  const [status, setStatus] = useState("LOADING");
  const [errorMessage, setErrorMessage] = useState("");

  // 한 번에 한 질문씩 답한다
  const [answered, setAnswered] = useState([]);
  const [draft, setDraft] = useState("");

  // 답변 제출 및 카드 생성 관련 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardStatus, setCardStatus] = useState("NOT_SUBMITTED"); // NOT_SUBMITTED, LOADING, GENERATED, FAILED
  const [ideaCard, setIdeaCard] = useState(null);
  const [cardErrorMessage, setCardErrorMessage] = useState("");

  const submittedRef = useRef(false);

  const messagesEndRef = useRef(null);
  const mountedAtRef = useRef(0);

  if (mountedAtRef.current === 0) {
    mountedAtRef.current = performance.now();
  }

  useEffect(() => {
    const target = messagesEndRef.current;

    if (!target) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const remaining = reduced
      ? 0
      : Math.max(
          0,
          FIRST_SCROLL_DELAY_MS - (performance.now() - mountedAtRef.current),
        );

    if (remaining === 0) {
      target.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const timer = window.setTimeout(
      () => target.scrollIntoView({ behavior: "smooth" }),
      remaining,
    );

    return () => window.clearTimeout(timer);
  }, [answered, questions, status]);

  const intro = buildIntro(localStorage.getItem("userName") ?? "");

  // 공통 질문 조회 API (GET)
  const fetchQuestions = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/meetings/${meetingId}/interview/questions`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const result = await response.json();

      if (response.status === 404) {
        setStatus("NOT_FOUND");
        setErrorMessage("아직 생성된 AI 공통 질문이 없습니다.");
        return;
      }

      if (!response.ok || !result.success) {
        setStatus("ERROR");
        setErrorMessage(
          result.error?.message || "질문 조회 중 오류가 발생했습니다.",
        );
        return;
      }

      const genStatus = result.data.generationStatus;
      setStatus(genStatus);

      if (genStatus === "GENERATED") {
        setQuestions(result.data.questions || []);
      } else if (genStatus === "PENDING") {
        setTimeout(fetchQuestions, 2500);
      } else if (genStatus === "FAILED") {
        setErrorMessage(
          result.data.failureMessage || "질문 생성에 실패했습니다.",
        );
      } else if (genStatus === "NOT_CONFIGURED") {
        setErrorMessage(
          "서버에 AI 설정이 되어있지 않아 질문을 생성할 수 없습니다.",
        );
      }
    } catch (error) {
      console.error("질문 조회 실패:", error);
      setStatus("ERROR");
      setErrorMessage("서버와 연결할 수 없습니다.");
    }
  };

  useEffect(() => {
    if (meetingId) fetchQuestions();
  }, [meetingId]);

  // 공통 질문 생성/재생성 API (POST)
  const handleGenerateQuestions = async () => {
    try {
      setStatus("LOADING");
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/meetings/${meetingId}/interview/questions/generate`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.error?.message || "질문 생성 요청에 실패했습니다.");
        setStatus("ERROR");
        return;
      }

      fetchQuestions();
    } catch (error) {
      console.error("질문 생성 실패:", error);
      alert("서버와 연결할 수 없습니다.");
      setStatus("ERROR");
    }
  };

  // 답변 제출 및 아이디어 카드 생성 (POST)
  const submitAnswers = async (formattedAnswers) => {
    try {
      setIsSubmitting(true);
      setCardStatus("LOADING"); // 제출 즉시 로딩 모드
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/meetings/${meetingId}/interview/submissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ answers: formattedAnswers }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || "답변 제출에 실패했습니다.");
      }

      // 제출은 성공했으나 카드 생성이 실패한 경우
      if (result.data.cardGenerationStatus === "FAILED") {
        setCardStatus("FAILED");
        setCardErrorMessage(
          result.data.failureMessage || "아이디어 카드 생성에 실패했습니다.",
        );
      } else {
        // 성공적으로 아이디어 카드가 반환됨
        setCardStatus("GENERATED");
        setIdeaCard(result.data.ideaCard);
      }
    } catch (error) {
      console.error("답변 제출 실패:", error);
      alert(toUserMessage(error));
      setCardStatus("NOT_SUBMITTED"); // 에러 나면 다시 제출할 수 있게 원상복구
      submittedRef.current = false;
    } finally {
      setIsSubmitting(false);
    }
  };

  //  아이디어 카드 재생성
  const handleRegenerateCard = async () => {
    try {
      setCardStatus("LOADING");
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/meetings/${meetingId}/interview/submissions/me/idea-card/generate`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || "카드 재생성에 실패했습니다.");
      }

      if (result.data.cardGenerationStatus === "FAILED") {
        setCardStatus("FAILED");
        setCardErrorMessage(
          result.data.failureMessage ||
            "다시 시도했지만 카드 생성에 실패했습니다.",
        );
      } else {
        setCardStatus("GENERATED");
        setIdeaCard(result.data.ideaCard);
      }
    } catch (error) {
      console.error("카드 재생성 에러:", error);
      alert(toUserMessage(error));
      setCardStatus("FAILED"); // 실패 상태 유지 (재생성 버튼 계속 보이도록)
    }
  };

  const answeredCount = answered.length;
  const currentQuestion = questions[answeredCount];
  const allAnswered = questions.length > 0 && !currentQuestion;

  const handleSend = () => {
    const content = draft.trim();

    if (!content || !currentQuestion) return;

    const next = [...answered, { questionId: currentQuestion.id, content }];

    setAnswered(next);
    setDraft("");

    if (next.length === questions.length && !submittedRef.current) {
      submittedRef.current = true;
      submitAnswers(next);
    }
  };

  const canType = status === "GENERATED" && Boolean(currentQuestion);

  return (
    <HeroLayout
      header={<Header {...HEADER_PRESETS.appOnLight} />}
      hero={
        <Hero
          size="sm"
          align="center"
          title="몇 가지 질문으로 생각을 정리해요."
          description="답변은 익명으로 모여 회의 자료가 됩니다."
          descriptionWeight="medium"
        />
      }
    >
      <div className="flex w-full justify-center px-5 pt-12 pb-16 sm:px-8 lg:pt-[60px] lg:pb-[84px]">
        <Card
          shadow="meeting"
          className="w-full max-w-[878px] px-6 py-8 sm:px-10 lg:px-[48px] lg:py-[40px]"
        >
          <div className="flex w-full flex-col gap-[24px]">
            {/* 상단 인사말 */}
            <BotMessage bubbleTop={34}>
              {intro.map((lines, i) => (
                <p key={i}>
                  {lines[0]}
                  <br />
                  {lines[1]}
                </p>
              ))}
            </BotMessage>

            {/* 질문 로딩, 생성 중 */}
            {(status === "LOADING" || status === "PENDING") && (
              <StateView title="AI가 회의 안건을 분석하여 질문을 만들고 있습니다" />
            )}

            {/* 질문 생성 실패 또는 없음 */}
            {(status === "NOT_FOUND" ||
              status === "FAILED" ||
              status === "NOT_CONFIGURED" ||
              status === "ERROR") && (
              <StateView
                variant="error"
                title={errorMessage}
                action={
                  status !== "NOT_CONFIGURED" && (
                    <Button size="pill" onClick={handleGenerateQuestions}>
                      {status === "NOT_FOUND"
                        ? "AI 공통 질문 생성하기"
                        : "질문 다시 생성하기"}
                    </Button>
                  )
                }
              />
            )}

            {/* 질문 생성 완료 — 답한 만큼만 대화가 쌓인다 */}
            {status === "GENERATED" &&
              questions.map((question, index) => {
                if (index > answeredCount) return null;

                return (
                  <Fragment key={question.id}>
                    <div className="flex flex-col gap-[8px]">
                      <p className="text-14 font-medium text-[#858894]">
                        질문 {index + 1}/{questions.length}
                      </p>

                      <BotMessage bubbleTop={31}>{question.content}</BotMessage>
                    </div>

                    {answered[index] && (
                      <UserMessage>{answered[index].content}</UserMessage>
                    )}
                  </Fragment>
                );
              })}

            {allAnswered && <UserMessage tone="dark">답변완료</UserMessage>}

            {/* 카드 요약 중 (로딩) */}
            {cardStatus === "LOADING" && (
              <StateView
                size="inline"
                title="AI가 핵심 아이디어 카드를 생성하고 있습니다"
                description="작성해주신 답변을 바탕으로 정리하고 있어요."
              />
            )}

            {/* 카드 생성 실패 */}
            {cardStatus === "FAILED" && (
              <StateView
                variant="error"
                size="inline"
                title={cardErrorMessage}
                action={
                  <Button
                    size="pill"
                    variant="secondary"
                    onClick={handleRegenerateCard}
                  >
                    아이디어 카드 다시 생성하기
                  </Button>
                }
              />
            )}

            {/* 카드 생성 성공 (결과 렌더링) */}
            {cardStatus === "GENERATED" && ideaCard && (
              <div className="flex w-full max-w-[500px] flex-col gap-4 self-center rounded-[20px] border border-solid border-[#b8bccc] p-8">
                <div className="mb-2 text-center">
                  <span className="text-12 mb-2 inline-block rounded-full bg-[#0075d3] px-3 py-1 font-bold text-white">
                    나의 핵심 아이디어
                  </span>
                  <h3 className="text-20 font-bold text-[#1c232b]">
                    {ideaCard.coreOpinion}
                  </h3>
                </div>

                <div className="text-16 flex flex-col gap-3 leading-[1.5] text-[#858894]">
                  <p>
                    <strong>💡 근거:</strong> {ideaCard.rationale}
                  </p>
                  {ideaCard.concern && (
                    <p>
                      <strong>⚠️ 우려점:</strong> {ideaCard.concern}
                    </p>
                  )}
                  {ideaCard.alternative && (
                    <p>
                      <strong>✅ 대안:</strong> {ideaCard.alternative}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-[10px]">
                  <Button
                    className="w-full"
                    onClick={() =>
                      navigate(meetingPath("BOARD", projectId, meetingId))
                    }
                  >
                    익명 아이디어 보드로 이동하기
                  </Button>

                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() =>
                      navigate(meetingPath("SUMMARY", projectId, meetingId))
                    }
                  >
                    전체 의견 요약 보기
                  </Button>
                </div>
              </div>
            )}

            {/* 답변 입력 */}
            <div className="flex w-full items-center gap-[50px] rounded-[71px] bg-[#f5f5f5] px-[26px] py-[14px] outline-offset-2 transition-[outline-color] duration-150 focus-within:outline focus-within:outline-2 focus-within:outline-[#0075d3]">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={!canType || isSubmitting}
                placeholder="메세지 보내기..."
                aria-label="답변 입력"
                className="text-16 min-w-0 flex-1 bg-transparent leading-[1.5] font-medium text-[#1c232b] outline-none placeholder:text-[#b8bccc]"
              />

              <button
                type="button"
                onClick={handleSend}
                disabled={!canType || !draft.trim() || isSubmitting}
                aria-label="답변 보내기"
                className="shrink-0 cursor-pointer disabled:opacity-60"
              >
                <img src={sendIcon} alt="" className="size-[32px] max-w-none" />
              </button>
            </div>
            <div ref={messagesEndRef} />
          </div>
        </Card>
      </div>
    </HeroLayout>
  );
}
