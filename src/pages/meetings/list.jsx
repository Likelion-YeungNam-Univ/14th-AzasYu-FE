import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import clockIcon from "@/assets/icons/clock.svg";
import { Footer, Header, Hero, HeroLayout } from "@/components/layout";
import { Pagination } from "@/components/pagination";
import { SkeletonRows, StateView } from "@/components/states";
import { Button, Table } from "@/components/ui";
import {
  API_BASE_URL,
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

    return (result.data ?? []).map((meeting) => ({
      ...meeting,
      projectId: project.id,
      projectName: project.name,
    }));
  } catch {
    return [];
  }
};

const MEETINGS_PER_PAGE = 8;

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

  const tableRows = meetings.map((meeting) => ({
    id: `${meeting.projectId}-${meeting.id}`,

    label: `${meeting.title} 회의 결과 보기`,

    cells: [
      <span key="title" className="flex items-center justify-between overflow-hidden">
        <span className="truncate">{meeting.title}</span>
        {meeting.participating && (
          <span className="shrink-0 rounded-[4px] bg-[#def4ec] px-[6px] py-[2px] text-12 font-semibold text-[#0d7a4d]">
            참여중
          </span>
        )}
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

  const [page, setPage] = useState(1);

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
        <div style={{ animationDelay: "700ms" }}
          className="animate-lift-in mt-[40px] lg:mt-[82px]">
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
                  className="text-18 rounded-[8px] bg-[#e6f3fe] px-6 py-3 font-semibold text-[#0075d3]"
                >
                  회의 생성하기
                </Link>
              }
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
        </div>
      </div>

      <Footer />
    </HeroLayout>
  );
}
