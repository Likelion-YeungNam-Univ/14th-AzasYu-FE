import { useEffect, useState } from "react";
import { useParams } from "react-router";
import pencilIcon from "@/assets/icons/pencil.svg";
import warningIcon from "@/assets/icons/warning-triangle.svg";
import { Footer, Header, Hero, HeroLayout } from "@/components/layout";
import { StateView } from "@/components/states";
import { RevealOnScroll } from "@/components/ui";
import {
  API_BASE_URL,
  HEADER_PRESETS,
  MEETING_TITLE,
  toUserMessage,
} from "@/lib";

const RESULT_CONTAINER = "mx-auto w-full max-w-[1460px] px-5 sm:px-8 lg:px-8 xl:px-12";

const toLines = (text) =>
  String(text ?? "")
    .split("\n")
    .map((line) => line.replace(/^[-•\s]+/, "").trim())
    .filter(Boolean);

const formatMeetingRange = (meeting) => {
  if (!meeting?.meetingDate) return "";

  const start = new Date(`${meeting.meetingDate}T${meeting.startTime ?? "00:00:00"}`);

  if (Number.isNaN(start.getTime())) return "";

  const time = (date) =>
    date.toLocaleTimeString("ko-KR", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const pad = (part) => String(part).padStart(2, "0");

  const date = `${start.getFullYear()}. ${pad(start.getMonth() + 1)}. ${pad(start.getDate())}`;

  if (!meeting.expectedDurationMinutes) return `${date} ${time(start)}`;

  const end = new Date(
    start.getTime() + meeting.expectedDurationMinutes * 60 * 1000,
  );

  // 끝 시각은 시안처럼 오전/오후를 빼고 시간만 붙인다
  const endLabel = time(end).replace(/^(오전|오후)\s*/, "");

  return `${date} ${time(start)} - ${endLabel}`;
};

function CheckMark() {
  return (
    <span
      aria-hidden
      className="flex size-[36px] shrink-0 items-center justify-center text-[#0075d3]"
    >
      <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
        <path
          d="M1.5 7.5L6.2 12L16.5 1.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function CheckList({ items }) {
  return (
    <ul className="flex w-full flex-col gap-[8px]">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-[10px]">
          <CheckMark />

          <p className="text-18 leading-[1.5] font-medium text-[#1c232b] lg:text-24">
            {item}
          </p>
        </li>
      ))}
    </ul>
  );
}

function BulletList({ items, className }) {
  return (
    <ul className={`text-16 flex w-full list-disc flex-col lg:text-20 ${className ?? ""}`}>
      {items.map((item) => (
        <li
          key={item}
          className="ms-[30px] leading-[1.5] font-medium text-[#1c232b]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function Section({ title, children }) {
  return (
    <section className="flex w-full flex-col gap-[32px]">
      <h2 className="text-28 font-semibold text-[#1c232b] lg:text-34">
        {title}
      </h2>

      {children}
    </section>
  );
}

export function MeetingResultPage() {
  const { meetingId = "" } = useParams();

  const [result, setResult] = useState(null);
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!meetingId) return;

    const fetchResult = async () => {
      try {
        setLoading(true);
        setError("");

        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("로그인이 필요합니다.");
        }

        const headers = { Authorization: `Bearer ${accessToken}` };

        const [resultResponse, meetingResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/v1/meetings/${meetingId}/result`, {
            headers,
          }),
          fetch(`${API_BASE_URL}/api/v1/meetings/${meetingId}`, { headers }),
        ]);

        const data = await resultResponse.json();

        if (!resultResponse.ok || !data.success) {
          throw new Error(
            data.error?.message || "회의 분석 결과를 불러오지 못했습니다.",
          );
        }

        setResult(data.data);

        if (meetingResponse.ok) {
          const meetingData = await meetingResponse.json();

          if (meetingData.success) setMeeting(meetingData.data);
        }
      } catch (error) {
        console.error("회의 분석 결과 조회 실패:", error);
        setError(toUserMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [meetingId]);

  if (loading) {
    return <StateView size="screen" title="회의 분석 결과를 불러오는 중입니다" />;
  }

  if (error || !result) {
    return (
      <StateView
        variant="error"
        size="screen"
        title={error || "회의 분석 결과가 없습니다."}
      />
    );
  }

  if (result.status !== "GENERATED") {
    return (
      <StateView
        variant="error"
        size="screen"
        title={result.failureMessage || "회의 분석에 실패했습니다."}
      />
    );
  }

  const title = meeting?.title ?? MEETING_TITLE;

  return (
    <HeroLayout
      header={<Header {...HEADER_PRESETS.appOnLight} />}
      hero={
        <Hero
          size="sm"
          align="left"
          contentTop={79.62}
          title={
            <span className="flex items-center gap-[14px]">
              <img
                src={pencilIcon}
                alt=""
                className="block size-[40px] max-w-none shrink-0"
              />
              {`${title} 내용을 정리했어요.`}
            </span>
          }
          description={formatMeetingRange(meeting)}
        />
      }
    >
      <div
        className={`${RESULT_CONTAINER} mt-10 flex flex-col gap-[52px] lg:mt-[80px] lg:gap-[80px]`}
      >
        <Section title="회의 목적">
          <CheckList items={toLines(result.meetingPurpose)} />
        </Section>

        <Section title="주요 논의 내용">
          <div className="rounded-[14px] bg-[#f5f5f5] px-6 py-6 sm:px-[34px] sm:py-[28px]">
            <BulletList items={toLines(result.keyDiscussions)} />
          </div>
        </Section>

        <Section title="회의에서 결정된 내용">
          <CheckList items={toLines(result.decisions)} />
        </Section>

        <Section title="추가로 확인할 내용">
          <BulletList items={toLines(result.followUpChecks)} />
        </Section>
      </div>

      <RevealOnScroll className="mt-20 w-full bg-[#fef1d8] py-12 lg:mt-[80px] lg:py-[79px]">
        <div className={`${RESULT_CONTAINER} flex flex-col gap-[28px]`}>
          <div className="flex items-center gap-[14px]">
            <img
              src={warningIcon}
              alt=""
              className="block h-[30px] w-[32px] max-w-none shrink-0"
            />

            <h2 className="text-24 font-semibold text-[#1c232b] lg:text-28">
              다르게 이해될 수 있는 부분
            </h2>
          </div>

          <ol className="flex flex-col gap-[18px]">
            {result.ambiguities?.map((ambiguity, i) => (
              <li key={ambiguity.id ?? i} className="flex items-start gap-[14px]">
                <span className="text-20 flex size-[36px] shrink-0 items-center justify-center rounded-[10px] bg-white leading-[1.5] font-medium text-[#858894] lg:text-24">
                  {i + 1}
                </span>

                <div className="flex flex-col gap-[4px] pt-[2px]">
                  <p className="text-18 font-medium text-[#1c232b] lg:text-24">
                    {ambiguity.expression}
                  </p>

                  {ambiguity.reason && (
                    <p className="text-16 font-medium text-[#858894] lg:text-20">
                      {ambiguity.reason}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </RevealOnScroll>

      <Footer />
    </HeroLayout>
  );
}
