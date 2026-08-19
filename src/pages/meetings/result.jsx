import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import pencilIcon from "@/assets/icons/pencil.svg";
import warningIcon from "@/assets/icons/warning-triangle.svg";
import { Footer, Header, Hero, HeroLayout } from "@/components/layout";
import { StateView } from "@/components/states";
import { RevealOnScroll } from "@/components/motion";
import { Button } from "@/components/ui";
import {
  API_BASE_URL,
  HEADER_PRESETS,
  MEETING_TITLE,
  meetingPath,
  PATHS,
  toUserMessage,
} from "@/lib";

const RESULT_CONTAINER = "mx-auto w-full max-w-[1460px] px-5 sm:px-8 lg:px-8 xl:px-12";

const toLines = (text) =>
  String(text ?? "")
    .split("\n")
    .map((line) => line.replace(/^[-•\s]+/, "").trim())
    .filter(Boolean);

const RECORD_SOURCE_LABEL = {
  TEXT: "직접 입력한 텍스트",
  TXT: "TXT 파일",
  DOCX: "DOCX 파일",
  PDF: "PDF 파일",
};

const formatRecordSource = (record) => {
  const label = RECORD_SOURCE_LABEL[record?.sourceType] ?? "등록한 회의 내용";

  return record?.originalFileName
    ? `${label} · ${record.originalFileName}`
    : label;
};

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
      className="flex size-[36px] shrink-0 items-center justify-center text-brand"
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

          <p className="text-16 leading-[1.5] font-medium text-ink lg:text-20">
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
          className="ms-[30px] leading-[1.5] font-medium text-ink"
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
      <h2 className="text-24 font-semibold text-ink lg:text-28">
        {title}
      </h2>

      {children}
    </section>
  );
}

export function MeetingResultPage() {
  const { projectId = "", meetingId = "" } = useParams();

  const [result, setResult] = useState(null);
  const [meeting, setMeeting] = useState(null);
  const [record, setRecord] = useState(null);
  const [recordOpen, setRecordOpen] = useState(false);
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

        const [resultResponse, meetingResponse, recordResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/api/v1/meetings/${meetingId}/result`, {
              headers,
            }),
            fetch(`${API_BASE_URL}/api/v1/meetings/${meetingId}`, { headers }),
            fetch(`${API_BASE_URL}/api/v1/meetings/${meetingId}/record`, {
              headers,
            }),
          ]);

        let meetingData = null;

        if (meetingResponse.ok) {
          const meetingResult = await meetingResponse.json();

          if (meetingResult.success) meetingData = meetingResult.data;
        }

        setMeeting(meetingData);

        if (recordResponse.ok) {
          const recordResult = await recordResponse.json();

          if (recordResult.success) setRecord(recordResult.data);
        }

        const data = await resultResponse.json();

        if (!resultResponse.ok || !data.success) {
          // 회의는 있는데 분석만 없는 경우는 오류가 아니라 빈 상태로 안내한다
          if (meetingData) return;

          throw new Error(
            data.error?.message || "회의 분석 결과를 불러오지 못했습니다.",
          );
        }

        setResult(data.data);
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

  if (error || !result || result.status !== "GENERATED") {
    if (!meeting) {
      return (
        <StateView
          variant="error"
          size="screen"
          title="회의를 찾을 수 없습니다"
          description="이미 삭제되었거나 접근할 수 없는 회의예요."
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

    if (!record) {
      return (
        <StateView
          variant="empty"
          size="screen"
          title="아직 회의 내용이 등록되지 않았어요"
          description="회의 내용을 올리면 AI가 주요 결과와 모호한 부분을 정리해드려요."
          action={
            <div className="flex flex-wrap items-center justify-center gap-[12px]">
              <Link to={meetingPath("UPLOAD", projectId, meetingId)}>
                <Button size="action">회의 내용 올리기</Button>
              </Link>

              <Link to={PATHS.PROJECTS}>
                <Button size="action" variant="secondary">
                  홈으로 가기
                </Button>
              </Link>
            </div>
          }
        />
      );
    }

    const analyzing = result?.status === "PENDING";

    return (
      <StateView
        variant={analyzing ? "loading" : "error"}
        size="screen"
        title={
          analyzing
            ? "회의 내용을 분석하고 있어요"
            : (result?.failureMessage ?? "아직 회의 분석 결과가 없어요")
        }
        description={formatRecordSource(record)}
        action={
          <Link
            to={
              analyzing
                ? meetingPath("LOADING", projectId, meetingId)
                : PATHS.PROJECTS
            }
          >
            <Button size="action" variant="secondary">
              {analyzing ? "분석 진행 보기" : "홈으로 가기"}
            </Button>
          </Link>
        }
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
        style={{ animationDelay: "700ms" }}
        className={`animate-lift-in ${RESULT_CONTAINER} mt-10 flex flex-col gap-[52px] lg:mt-[80px] lg:gap-[80px]`}
      >
        <Section title="회의 목적">
          <CheckList items={toLines(result.meetingPurpose)} />
        </Section>

        <Section title="주요 논의 내용">
          <div className="rounded-[14px] bg-surface px-6 py-6 sm:px-[34px] sm:py-[28px]">
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

            <h2 className="text-24 font-semibold text-ink lg:text-28">
              다르게 이해될 수 있는 부분
            </h2>
          </div>

          <ol className="flex flex-col gap-[18px]">
            {result.ambiguities?.map((ambiguity, i) => (
              <li key={ambiguity.id ?? i} className="flex items-start gap-[14px]">
                <span className="text-16 flex size-[36px] shrink-0 items-center justify-center rounded-[10px] bg-white leading-[1.5] font-medium text-muted lg:text-18">
                  {i + 1}
                </span>

                <div className="flex flex-col gap-[4px] pt-[2px]">
                  <p className="text-16 font-semibold text-ink lg:text-20">
                    {ambiguity.expression}
                  </p>

                  {ambiguity.reason && (
                    <p className="text-14 font-medium text-muted lg:text-18">
                      {ambiguity.reason}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </RevealOnScroll>

      {record && (
        <div
          className={`${RESULT_CONTAINER} mt-12 mb-16 flex flex-col gap-[20px] lg:mt-[80px] lg:mb-[120px]`}
        >
          <div className="flex flex-wrap items-center justify-between gap-[12px]">
            <div className="flex min-w-0 flex-col gap-[4px]">
              <h2 className="text-24 font-semibold text-ink lg:text-28">
                회의 원문
              </h2>

              <p className="text-14 font-medium break-all text-muted lg:text-16">
                {formatRecordSource(record)}
              </p>
            </div>

            <Button
              size="action"
              variant="secondary"
              onClick={() => setRecordOpen((open) => !open)}
              aria-expanded={recordOpen}
            >
              {recordOpen ? "접기" : "원문 보기"}
            </Button>
          </div>

          {recordOpen && (
            <p className="text-14 max-h-[420px] w-full overflow-y-auto rounded-[14px] bg-surface px-6 py-6 leading-[1.7] font-medium whitespace-pre-line text-ink sm:px-[34px] sm:py-[28px] lg:text-16">
              {record.content}
            </p>
          )}
        </div>
      )}

      <Footer />
    </HeroLayout>
  );
}
