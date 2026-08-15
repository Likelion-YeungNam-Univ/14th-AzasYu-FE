import { useEffect, useState } from "react";
import { useParams } from "react-router";
import warningIcon from "@/assets/icons/warning-triangle.svg";
import { Footer, Header, Hero, HeroLayout } from "@/components/layout";
import { API_BASE_URL, HEADER_PRESETS, MEETING_TITLE } from "@/lib";

const MEETING_TIME = "2026. 08. 12 오후 2:00 - 4:00";

const RESULT_CONTAINER = "mx-auto w-full max-w-[1460px] px-5 sm:px-8 lg:px-0";

export function MeetingResultPage() {
  const { projectId = "", meetingId = "" } = useParams();

  const [result, setResult] = useState(null);
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

        const response = await fetch(
          `${API_BASE_URL}/api/v1/meetings/${meetingId}/result`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error?.message || "회의 분석 결과를 불러오지 못했습니다.",
          );
        }

        setResult(data.data);
      } catch (error) {
        console.error("회의 분석 결과 조회 실패:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [meetingId]);

  if (loading) {
    return <p>회의 분석 결과를 불러오는 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!result) {
    return <p>회의 분석 결과가 없습니다.</p>;
  }

  if (result.status !== "GENERATED") {
    return <p>{result.failureMessage || "회의 분석에 실패했습니다."}</p>;
  }

  const resultSections = [
    {
      label: "회의 목적",
      content: result.meetingPurpose,
    },
    {
      label: "주요 논의 내용",
      content: result.keyDiscussions,
    },
    {
      label: "회의에서 결정된 내용",
      content: result.decisions,
    },
    {
      label: "추가로 확인할 내용",
      content: result.followUpChecks,
    },
  ];

  return (
    <HeroLayout
      header={<Header {...HEADER_PRESETS.appOnLight} />}
      hero={
        <Hero
          size="sm"
          align="left"
          title={`${MEETING_TITLE} 결과`}
          description={MEETING_TIME}
        />
      }
    >
      <div
        className={`${RESULT_CONTAINER} mt-10 flex flex-col gap-[52px] lg:mt-[82px]`}
      >
        {resultSections.map((section) => (
          <section key={section.label} className="flex flex-col gap-[28px]">
            <h2 className="text-24 font-semibold text-[#717171] lg:text-28">
              {section.label}
            </h2>

            <div className="text-18 rounded-[14px] bg-[#eee] px-6 py-6 leading-[1.5] font-medium text-[#717171] sm:px-10 sm:py-[36px] lg:text-20">
              {section.content}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-20 w-full bg-[#eee] py-12 lg:mt-[161px] lg:py-[79px]">
        <div className={`${RESULT_CONTAINER} flex flex-col gap-[28px]`}>
          <div className="flex items-center gap-[12px]">
            <img
              src={warningIcon}
              alt=""
              className="block h-[31px] w-[34px] max-w-none shrink-0"
            />

            <h2 className="text-24 font-semibold text-[#717171] lg:text-28">
              다르게 이해될 수 있는 부분
            </h2>
          </div>

          <ol className="flex flex-col gap-[18px]">
            {result.ambiguities?.map((ambiguity, i) => (
              <li key={ambiguity.id} className="flex items-start gap-[14px]">
                <span className="text-20 flex size-[36px] shrink-0 items-center justify-center rounded-[10px] bg-white leading-[1.5] font-medium text-[#717171] lg:text-24">
                  {i + 1}
                </span>

                <div className="flex flex-col gap-[4px]">
                  <p className="text-18 font-medium text-[#717171] lg:text-24">
                    {ambiguity.expression}
                  </p>

                  <p className="text-16 font-medium text-[#878787] lg:text-20">
                    {ambiguity.reason}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="h-16 lg:h-[531px]" />

      <Footer />
    </HeroLayout>
  );
}
