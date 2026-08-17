import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Footer, Header, Hero, HeroLayout } from "@/components/layout";
import { StateView } from "@/components/states";
import { Button } from "@/components/ui";
import { API_BASE_URL, HEADER_PRESETS, toUserMessage } from "@/lib";

const SUMMARY_CONTAINER = "mx-auto w-full max-w-[976px] px-5 sm:px-8 lg:px-0";

const toLines = (text) =>
  String(text ?? "")
    .split("\n")
    .map((line) => line.replace(/^[-•\s]+/, "").trim())
    .filter(Boolean);

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

function SectionTitle({ children }) {
  return (
    <h2 className="text-28 font-semibold text-[#1c232b] lg:text-34">
      {children}
    </h2>
  );
}

function SummaryBox({ content }) {
  const lines = toLines(content);

  return (
    <div className="rounded-[14px] bg-[#f5f5f5] px-6 py-6 sm:px-[40px] sm:py-[36px]">
      {lines.length > 1 ? (
        <ul className="text-16 flex list-disc flex-col lg:text-20">
          {lines.map((line) => (
            <li
              key={line}
              className="ms-[30px] leading-[1.5] font-medium text-[#1c232b]"
            >
              {line}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-16 leading-[1.5] font-medium whitespace-pre-wrap text-[#1c232b] lg:text-20">
          {lines[0] || "내용이 없습니다."}
        </p>
      )}
    </div>
  );
}

export function MeetingSummaryPage() {
  const { meetingId = "" } = useParams();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [isParticipant, setIsParticipant] = useState(false);

  useEffect(() => {
    if (!meetingId) return;

    const checkParticipant = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        const response = await fetch(
          `${API_BASE_URL}/api/v1/meetings/${meetingId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        const result = await response.json();
        if (!response.ok || !result.success) return;

        const currentUserId = getCurrentUserId();
        const participants = result.data?.participants ?? [];

        setIsParticipant(
          participants.some(
            (p) =>
              String(p.userId ?? p.id ?? p.memberId) ===
              String(currentUserId),
          ),
        );
      } catch {
        setIsParticipant(false);
      } finally {
        setChecking(false);
      }
    };

    checkParticipant();
  }, [meetingId]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError("");

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/meetings/${meetingId}/idea-summary`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const result = await response.json();

      if (response.status === 404) {
        setError("의견 요약을 찾을 수 없습니다.");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.error?.message || "요약 데이터를 불러오지 못했습니다.",
        );
      }

      setSummary(result.data);
    } catch (err) {
      console.error("의견 요약 조회 실패:", err);
      setError(toUserMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (meetingId && !checking && isParticipant) fetchSummary();
  }, [meetingId, checking, isParticipant]);

  if (checking) {
    return <StateView size="screen" title="권한을 확인하고 있습니다" />;
  }

  if (!isParticipant) {
    return (
      <StateView
        variant="error"
        size="screen"
        title="회의 참여자만 접근할 수 있습니다"
        description="이 회의에 참여하지 않아 전체 의견 요약을 볼 수 없습니다."
      />
    );
  }

  const handleRefreshSummary = async () => {
    try {
      setRefreshing(true);
      setError("");

      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/meetings/${meetingId}/idea-summary/refresh`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const result = await response.json();

      if (response.status === 409) {
        alert(
          "요약할 아이디어 카드가 아직 하나도 없습니다! 카드를 먼저 제출해주세요.",
        );
        return;
      } else if (response.status === 503) {
        alert("서버에 AI 키가 설정되지 않았습니다.");
        return;
      } else if (response.status === 502) {
        alert("AI 요약 생성에 실패했습니다. 다시 시도해주세요.");
        return;
      } else if (!response.ok || !result.success) {
        throw new Error(
          result.error?.message || "요약 새로고침 중 오류가 발생했습니다.",
        );
      }

      setSummary(result.data);
      alert("최신 의견 요약이 생성되었습니다!");
    } catch (err) {
      console.error("의견 요약 생성 실패:", err);
      alert(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <HeroLayout
      header={<Header {...HEADER_PRESETS.appOnLight} />}
      hero={
        <Hero
          size="sm"
          align="center"
          title="의견을 모아봤어요."
          description="팀원들이 미리 남긴 의견을 확인해보세요."
          descriptionWeight="medium"
        />
      }
    >
      <div
        className={`${SUMMARY_CONTAINER} mt-10 flex flex-col gap-[36px] pb-20 lg:mt-[68.62px] lg:gap-[60px] lg:pb-[150px]`}
      >
        {loading ? (
          <StateView title="요약 데이터를 확인하고 있습니다" />
        ) : error ? (
          <StateView variant="error" title={error} />
        ) : refreshing ? (
          <StateView
            title="AI가 팀원들의 아이디어 카드를 종합하고 있습니다"
            description="수 초 정도 소요될 수 있으니 잠시만 기다려주세요."
          />
        ) : !summary ? (
          <StateView
            variant="empty"
            title="아직 전체 의견 요약이 생성되지 않았어요"
            description="팀원들이 아이디어 카드를 제출했다면 아래 버튼을 눌러 요약을 확인해보세요."
            action={
              <Button onClick={handleRefreshSummary} size="action">
                AI 전체 의견 요약 생성하기
              </Button>
            }
          />
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-solid border-[#f6f5fa] pb-6">
              <div>
                <p className="text-18 font-semibold text-[#1c232b]">
                  현재 요약 버전: v{summary.version}
                </p>
                <p className="text-14 mt-1 text-[#858894]">
                  종합된 카드 수: {summary.sourceCardCount}개
                </p>
              </div>

              <Button
                size="pill"
                variant="secondary"
                onClick={handleRefreshSummary}
              >
                최신 내용으로 새로고침
              </Button>
            </div>

            <section className="flex flex-col gap-[32px]">
              <SectionTitle>의견이 나뉘는 부분</SectionTitle>
              <SummaryBox content={summary.differingOpinions} />
            </section>

            <section className="flex flex-col gap-[32px]">
              <SectionTitle>공통적으로 나온 의견</SectionTitle>
              <SummaryBox content={summary.commonOpinions} />
            </section>

            <section className="flex flex-col gap-[32px]">
              <SectionTitle>주요 우려사항</SectionTitle>
              <SummaryBox content={summary.keyConcerns} />
            </section>

            <section className="flex flex-col gap-[32px]">
              <SectionTitle>회의에서 확인하면 좋을 내용</SectionTitle>
              <SummaryBox content={summary.discussionPoints} />
            </section>
          </>
        )}
      </div>

      <Footer />
    </HeroLayout>
  );
}
