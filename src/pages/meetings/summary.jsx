import { Header, Hero, HeroLayout } from "@/components/layout";
import { HEADER_PRESETS } from "@/lib";

const SUMMARY_CONTAINER = "mx-auto w-full max-w-[1460px] px-5 sm:px-8 lg:px-0";

const SAMPLE_SUMMARY = {
  highlights: [
    {
      id: 1,
      title: "일정 조정이 필요해요",
      description: "대부분의 팀원이 현재 일정이 촉박하다고 생각하고 있어요.",
    },
    {
      id: 2,
      title: "역할 분담을 명확히 해야 해요",
      description: "업무 범위가 겹치는 부분에 대한 의견이 여러 번 나타났어요.",
    },
    {
      id: 3,
      title: "완성도와 일정 사이의 우선순위가 필요해요",
      description:
        "빠른 출시를 원하는 의견과 완성도를 높이자는 의견이 나뉘었어요.",
    },
  ],
  conflicts: [
    { id: 1, opinion: "완성도를 높이는 것이 중요하다.", count: 4 },
    { id: 2, opinion: "일정을 맞추는 것이 우선이다.", count: 6 },
  ],
  commonOpinions: [
    "일정이 촉박하다.",
    "역할 분담이 필요하다.",
    "우선순위 정리가 필요하다.",
  ],
  checkPoints: [
    "역할 범위가 겹치는 업무의 담당자를 어떻게 정할까요?",
    "일정과 완성도 중 무엇을 우선할까요?",
  ],
};

function SectionTitle({ children }) {
  return (
    <h2 className="text-24 font-semibold text-[#717171] lg:text-28">
      {children}
    </h2>
  );
}

function BulletBox({ items }) {
  return (
    <ul className="flex flex-col rounded-[14px] bg-[#eee] px-6 py-6 sm:px-10 sm:py-[36px]">
      {items.map((item) => (
        <li
          key={item}
          className="text-18 flex gap-[10px] leading-[1.5] font-medium text-[#717171] lg:text-20"
        >
          <span aria-hidden className="shrink-0">
            •
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function MeetingSummaryPage() {
  const summary = SAMPLE_SUMMARY;

  return (
    <HeroLayout
      header={<Header {...HEADER_PRESETS.appOnLight} />}
      hero={
        <Hero
          size="sm"
          align="left"
          title="전체 의견 요약"
          description="팀원들이 미리 남긴 의견을 확인해보세요."
        />
      }
    >
      <div
        className={`${SUMMARY_CONTAINER} mt-10 flex flex-col gap-[36px] pb-20 lg:mt-[82px] lg:pb-[240px]`}
      >
        <section className="flex flex-col gap-[24px]">
          <SectionTitle>한눈에 보는 의견</SectionTitle>

          <ol className="flex flex-col gap-[24px]">
            {summary.highlights.map((highlight, index) => (
              <li key={highlight.id} className="flex items-start gap-[16px]">
                <span className="text-20 flex size-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#eee] font-medium text-[#878787] lg:text-24">
                  {index + 1}
                </span>

                <div className="flex flex-col gap-[4px]">
                  <p className="text-20 font-semibold text-[#717171] lg:text-24 lg:leading-[36px]">
                    {highlight.title}
                  </p>

                  <p className="text-16 font-medium text-[#878787] lg:text-20">
                    {highlight.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-[24px]">
          <SectionTitle>의견이 나뉘는 부분</SectionTitle>

          <div className="flex flex-col items-stretch gap-[24px] sm:flex-row sm:items-center sm:gap-[40px]">
            {summary.conflicts.map((conflict, index) => (
              <div key={conflict.id} className="contents">
                {index > 0 && (
                  <span
                    aria-hidden
                    className="flex shrink-0 justify-center text-[#bcc2d2] sm:w-[65px]"
                  >
                    <svg
                      width="65"
                      height="12"
                      viewBox="0 0 65 12"
                      fill="none"
                      className="block"
                    >
                      <path
                        d="M6 1L1 6L6 11M59 1L64 6L59 11M1 6H64"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}

                <div className="flex min-h-[186px] w-full max-w-[421px] flex-col justify-between rounded-[14px] border border-solid border-[#dfe6fa] bg-[#eef1fb] px-[24px] py-[33px] sm:px-[40px]">
                  <p className="text-18 leading-[1.5] font-medium text-[#717171] lg:text-20">
                    {conflict.opinion}
                  </p>

                  <p className="text-16 mt-[10px] text-right font-semibold text-[#6d93f8]">
                    {conflict.count}명
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-[24px]">
          <SectionTitle>공통적으로 나온 의견</SectionTitle>
          <BulletBox items={summary.commonOpinions} />
        </section>

        <section className="flex flex-col gap-[24px]">
          <SectionTitle>회의에서 확인하면 좋을 내용</SectionTitle>
          <BulletBox items={summary.checkPoints} />
        </section>
      </div>
    </HeroLayout>
  );
}
