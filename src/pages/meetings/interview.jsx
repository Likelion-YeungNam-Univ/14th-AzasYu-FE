import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Header, Hero, HeroLayout } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import {
  API_BASE_URL,
  HEADER_PRESETS,
  HERO_CARD_OVERLAP,
  meetingPath,
} from "@/lib";

const INTRO = [
  [
    "안녕하세요, 지혜님! 👋",
    "회의를 시작하기 전에 @@님의 생각을 먼저 들어볼게요.",
  ],
  [
    "이 대화에서 나눈 의견은 익명으로 수집되니 부담 갖지 말고 편하게 이야기해주세요.",
    "정해진 답은 없어요. 지금 떠오르는 생각을 솔직하게 들려주시면 됩니다.",
  ],
];

function BotMessage({ children, bubbleTop }) {
  return (
    <div className="flex gap-[8px]">
      <span className="mt-[2px] size-[32px] shrink-0 rounded-full bg-[#d9d9d9]" />
      <div className="flex min-w-0 flex-col">
        <p className="text-16 font-medium text-[#717171]">AI 챗봇</p>
        <div
          style={{ marginTop: bubbleTop - 22.4 }}
          className="text-16 w-fit rounded-[20px] bg-[#e3e3e3] px-[20px] py-[12px] leading-[1.5] font-medium text-[#717171]"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function MeetingInterviewPage() {
  const { projectId = "", meetingId = "" } = useParams();
  const navigate = useNavigate();

  // API에서 받아온 질문 목록
  const [questions, setQuestions] = useState([]);

  // 공통 질문 상태 관리 (LOADING, PENDING, GENERATED, FAILED, NOT_CONFIGURED, NOT_FOUND, ERROR)
  const [status, setStatus] = useState("LOADING");
  const [errorMessage, setErrorMessage] = useState("");

  const [answers, setAnswers] = useState({});

  // 답변 제출 및 카드 생성 관련 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardStatus, setCardStatus] = useState("NOT_SUBMITTED"); // NOT_SUBMITTED, LOADING, GENERATED, FAILED
  const [ideaCard, setIdeaCard] = useState(null);
  const [cardErrorMessage, setCardErrorMessage] = useState("");

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

  // 답변 텍스트 입력 핸들러
  const handleAnswerChange = (questionId, text) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: text,
    }));
  };

  // 답변 제출 및 아이디어 카드 생성 (POST)
  const handleSubmitAnswers = async () => {
    // 유효성 검사
    const unansweredCount = questions.length - Object.keys(answers).length;
    const hasEmptyText = Object.values(answers).some(
      (text) => text.trim() === "",
    );

    if (unansweredCount > 0 || hasEmptyText) {
      alert("모든 질문에 답변을 작성해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setCardStatus("LOADING"); // 제출 즉시 로딩 모드
      const accessToken = localStorage.getItem("accessToken");

      const formattedAnswers = Object.entries(answers).map(([qId, text]) => ({
        questionId: Number(qId),
        content: text.trim(),
      }));

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
      alert(error.message);
      setCardStatus("NOT_SUBMITTED"); // 에러 나면 다시 제출할 수 있게 원상복구
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
      alert(error.message);
      setCardStatus("FAILED"); // 실패 상태 유지 (재생성 버튼 계속 보이도록)
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
          title="AI 사전 인터뷰"
          description="6개의 질문으로 생각을 정리해보세요."
        />
      }
    >
      <div className="flex w-full justify-center px-5 pb-16 sm:px-8 lg:pb-[220px]">
        <Card className="w-full max-w-[878px] px-6 py-8 sm:px-10 lg:min-h-[800px] lg:px-[48px] lg:py-[40px]">
          <div className="flex w-full flex-col gap-[36px]">
            {/* 상단 인사말 */}
            <BotMessage bubbleTop={34}>
              {INTRO.map((lines, i) => (
                <p key={i}>
                  {lines[0]}
                  <br />
                  {lines[1]}
                </p>
              ))}
            </BotMessage>

            {/* 질문 로딩, 생성 중 */}
            {(status === "LOADING" || status === "PENDING") && (
              <div className="flex flex-col items-center justify-center gap-4 py-20">
                <span className="text-18 font-medium text-[#717171]">
                  AI가 회의 안건을 분석하여 질문을 만들고 있습니다... 🤖
                </span>
              </div>
            )}

            {/* 질문 생성 실패 또는 없음 */}
            {(status === "NOT_FOUND" ||
              status === "FAILED" ||
              status === "NOT_CONFIGURED" ||
              status === "ERROR") && (
              <div className="flex flex-col items-center justify-center gap-6 py-20">
                <p className="text-18 font-medium text-red-500 text-center leading-[1.5]">
                  {errorMessage}
                </p>
                {status !== "NOT_CONFIGURED" && (
                  <Button
                    onClick={handleGenerateQuestions}
                    className="w-fit px-8"
                  >
                    {status === "NOT_FOUND"
                      ? "AI 공통 질문 생성하기"
                      : "질문 다시 생성하기"}
                  </Button>
                )}
              </div>
            )}

            {/* 질문 생성 완료 , 답변 입력 및 카드 결과 화면 */}
            {status === "GENERATED" && questions.length > 0 && (
              <div className="flex flex-col gap-[32px]">
                {/*  질문 , 텍스트  */}
                {questions.map((q, index) => (
                  <div key={q.id} className="contents">
                    <div className="flex flex-col gap-[8px]">
                      <p className="text-14 font-medium text-[#717171]">
                        질문 {index + 1}/{questions.length}
                      </p>
                      <BotMessage bubbleTop={31}>{q.content}</BotMessage>
                    </div>

                    <div className="flex justify-end">
                      <textarea
                        value={answers[q.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(q.id, e.target.value)
                        }
                        disabled={cardStatus !== "NOT_SUBMITTED"}
                        className={`text-16 w-full resize-none rounded-[26px] bg-[#f6f6f6] px-[20px] py-[14px] font-medium text-[#717171] placeholder:text-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#d0d0d0] lg:w-[439px] ${
                          cardStatus !== "NOT_SUBMITTED"
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }`}
                        rows={3}
                        placeholder="이곳에 답변을 작성해주세요..."
                      />
                    </div>
                  </div>
                ))}

                {/* 제출 버튼 , 최종 카드 */}
                <div className="mt-8 pt-8 border-t border-[#eaeaea] flex flex-col items-center gap-6">
                  {/* 제출 전 */}
                  {cardStatus === "NOT_SUBMITTED" && (
                    <Button
                      className="w-full max-w-[300px]"
                      onClick={handleSubmitAnswers}
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "답변 제출 중..."
                        : "답변 제출하고 요약 카드 받기"}
                    </Button>
                  )}

                  {/* 카드 요약 중 (로딩) */}
                  {cardStatus === "LOADING" && (
                    <div className="text-16 font-medium text-[#717171] py-8">
                      작성해주신 답변을 바탕으로 AI가 핵심 아이디어 카드를
                      생성하고 있습니다... ⏳
                    </div>
                  )}

                  {/* 카드 생성 실패 */}
                  {cardStatus === "FAILED" && (
                    <div className="flex flex-col items-center gap-4 py-8">
                      <p className="text-16 font-medium text-red-500">
                        {cardErrorMessage}
                      </p>
                      <Button
                        variant="secondary"
                        onClick={handleRegenerateCard}
                      >
                        아이디어 카드 다시 생성하기
                      </Button>
                    </div>
                  )}

                  {/* 카드 생성 완벽 성공 (결과 렌더링) */}
                  {cardStatus === "GENERATED" && ideaCard && (
                    <div className="w-full max-w-[500px] flex flex-col gap-4 bg-[#f8f9fa] rounded-[20px] p-8 border border-[#e0e0e0]">
                      <div className="text-center mb-2">
                        <span className="inline-block bg-[#717171] text-white text-12 font-bold px-3 py-1 rounded-full mb-2">
                          나의 핵심 아이디어
                        </span>
                        <h3 className="text-20 font-bold text-[#333]">
                          {ideaCard.coreOpinion}
                        </h3>
                      </div>

                      <div className="flex flex-col gap-3 text-15 text-[#555]">
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

                      <div className="mt-4 pt-4 border-t border-[#ddd] flex justify-center">
                        <Button
                          onClick={() =>
                            navigate(meetingPath("BOARD", projectId, meetingId))
                          }
                          className="w-full"
                        >
                          익명 아이디어 보드로 이동하기
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </HeroLayout>
  );
}
