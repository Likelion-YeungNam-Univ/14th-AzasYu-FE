import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import clockIcon from "@/assets/icons/clock.svg";
import { Footer, Header, Hero, HeroLayout } from "@/components/layout";
import { Pagination } from "@/components/pagination";
import { SkeletonRows, StateView } from "@/components/states";
import { Button, Table } from "@/components/ui";
import {
  API_BASE_URL,
  cn,
  formatDateWithWeekday,
  HEADER_PRESETS,
  PATHS,
  meetingPath,
  projectPath,
  toUserMessage,
} from "@/lib";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

const toDateTime = (meeting) =>
  meeting.startTime
    ? `${meeting.meetingDate}T${meeting.startTime}`
    : meeting.meetingDate;

const getMyProjects = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects`, {
    headers: authHeaders(),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error?.message || "프로젝트를 불러오지 못했습니다.");
  }

  return result.data ?? [];
};

const getProjectMeetings = async (project) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/projects/${project.id}/meetings`,
      { headers: authHeaders() },
    );

    const result = await response.json();

    if (!response.ok || !result.success) return [];

    const meetings = result.data ?? [];

    const records = await Promise.all(
      meetings.map(async (meeting) => {
        try {
          const res = await fetch(
            `${API_BASE_URL}/api/v1/meetings/${meeting.id}/record`,
            { headers: authHeaders() },
          );
          return res.ok;
        } catch {
          return false;
        }
      }),
    );

    return meetings.map((meeting, i) => ({
      ...meeting,
      projectId: project.id,
      projectName: project.name,
      hasRecord: records[i],
    }));
  } catch {
    return [];
  }
};

const MEETINGS_PER_PAGE = 8;

const STATUS_FILTERS = [
  { value: "ALL", label: "전체" },
  { value: "NOT_JOINED", label: "미참여" },
  { value: "IN_PROGRESS", label: "회의중" },
  { value: "DONE", label: "참여완료" },
];

const meetingStatus = (meeting) =>
  meeting.hasRecord
    ? "DONE"
    : meeting.participating
      ? "IN_PROGRESS"
      : "NOT_JOINED";

const BADGE_LABEL = {
  DONE: "회의완료",
  IN_PROGRESS: "회의중",
  NOT_JOINED: "미참여",
};

const BADGE_STYLE = {
  DONE: "bg-[#e6f3fe] text-[#0075d3]",
  IN_PROGRESS: "bg-[#def4ec] text-[#0d7a4d]",
  NOT_JOINED: "bg-[#f0f0f0] text-[#858894]",
};

const TABLE_COLUMNS = [
  { label: "회의명", width: 310 },
  { label: "프로젝트", width: 250 },
  { label: "주요 안건", width: 510 },
  { label: "날짜", width: 180 },
];

export function MeetingsPage() {
  const { projectId = "" } = useParams();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const fetchMeetings = async () => {
      try {
        setLoading(true);
        setError("");

        const projects = await getMyProjects();

        const scoped = projectId
          ? projects.filter(
              (project) => String(project.id) === String(projectId),
            )
          : projects;

        const lists = await Promise.all(scoped.map(getProjectMeetings));

        if (cancelled) return;

        setMeetings(
          lists
            .flat()
            .sort(
              (a, b) =>
                new Date(toDateTime(b)).getTime() -
                new Date(toDateTime(a)).getTime(),
            ),
        );
      } catch (error) {
        console.error("회의 목록 조회 실패:", error);

        if (!cancelled) setError(toUserMessage(error));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMeetings();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const visibleMeetings =
    status === "ALL"
      ? meetings
      : meetings.filter((meeting) => meetingStatus(meeting) === status);

  const tableRows = visibleMeetings.map((meeting) => ({
    id: `${meeting.projectId}-${meeting.id}`,

    label: `${meeting.title} 회의 결과 보기`,

    cells: [
      <span key="title" className="flex items-center justify-between overflow-hidden">
        <span className="truncate">{meeting.title}</span>
        <span
          className={cn(
            "shrink-0 rounded-[4px] px-[6px] py-[2px] text-12 font-semibold",
            BADGE_STYLE[meetingStatus(meeting)],
          )}
        >
          {BADGE_LABEL[meetingStatus(meeting)]}
        </span>
      </span>,

      <Link
        key="project"
        to={projectPath("DETAIL", meeting.projectId)}
        className="relative z-20 hover:underline"
      >
        {meeting.projectName || "프로젝트"}
      </Link>,

      meeting.agendas?.length
        ? meeting.agendas.map((agenda) => agenda.content ?? agenda).join(", ")
        : meeting.purpose,

      formatDateWithWeekday(meeting.meetingDate),
    ],

    href: meetingPath("DETAIL", meeting.projectId, meeting.id),
  }));

  const totalPages = Math.max(1, Math.ceil(tableRows.length / MEETINGS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = tableRows.slice(
    (currentPage - 1) * MEETINGS_PER_PAGE,
    currentPage * MEETINGS_PER_PAGE,
  );

  return (
    <HeroLayout
      header={<Header {...HEADER_PRESETS.appOnLight} />}
      hero={
        <Hero
          size="sm"
          align="left"
          title={
            <span className="flex items-center gap-[14px]">
              <img
                src={clockIcon}
                alt=""
                className="block h-[47px] w-[46px] max-w-none shrink-0"
              />
              지난 회의
            </span>
          }
          description="회의를 클릭하면 회의 결과와 다르게 이해될 수 있는 부분을 다시 확인할 수 있어요."
        />
      }
    >
      <div className="mx-auto w-full max-w-[1460px] px-5 pb-16 sm:px-8 lg:px-8 xl:px-12 lg:pb-[186px]">
        <div
          className="mt-[40px] lg:mt-[82px]">
          {loading ? (
            <SkeletonRows count={8} />
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
          ) : meetings.length === 0 ? (
            <StateView
              variant="empty"
              title="아직 등록된 회의가 없어요"
              description="새로운 회의를 생성해보세요."
              action={
                <Link
                  to={
                    projectId
                      ? projectPath("MEETING_NEW", projectId)
                      : PATHS.PROJECTS
                  }
                  className="text-18 rounded-[8px] bg-brand-soft px-6 py-3 font-semibold text-brand"
                >
                  회의 생성하기
                </Link>
              }
            />
          ) : (
            <>
              <div
                role="group"
                aria-label="회의 상태 필터"
                className="mb-[18px] flex flex-wrap items-center gap-[10px] lg:mb-[24px]"
              >
                {STATUS_FILTERS.map((filter) => {
                  const selected = status === filter.value;

                  return (
                    <button
                      key={filter.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        setStatus(filter.value);
                        setPage(1);
                      }}
                      className={cn(
                        "text-16 flex h-[41px] cursor-pointer items-center justify-center rounded-[8px] border border-solid px-[16px] font-medium whitespace-nowrap transition-colors duration-150",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                        selected
                          ? "border-brand bg-brand text-white"
                          : "border-line bg-white text-muted hover:border-ink hover:text-ink",
                      )}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>

              {visibleMeetings.length === 0 ? (
                <StateView
                  variant="empty"
                  title={`'${STATUS_FILTERS.find((filter) => filter.value === status)?.label}'에 해당하는 회의가 없어요`}
                  description="다른 상태를 선택해보세요."
                />
              ) : (
                <>
                  <Table columns={TABLE_COLUMNS} rows={pageRows} />

                  <Pagination
                    page={currentPage}
                    totalPages={totalPages}
                    onChange={setPage}
                    className="mt-10 lg:mt-[56px]"
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </HeroLayout>
  );
}
