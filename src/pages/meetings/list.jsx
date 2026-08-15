import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Footer, Header, Hero, HeroLayout } from "@/components/layout";
import { Table } from "@/components/ui";
import {
  API_BASE_URL,
  HEADER_PRESETS,
  PATHS,
  meetingPath,
  projectPath,
} from "@/lib";

function formatMeetingDate(value) {
  if (!value) return "";

  const date = new Date(value);

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const TABLE_COLUMNS = [
  { label: "회의명", width: 300 },
  { label: "프로젝트", width: 280 },
  { label: "회의 목적", width: 530 },
  { label: "날짜", width: 180 },
];

export function MeetingsPage() {
  const { projectId = "" } = useParams();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      setError("프로젝트 정보가 없습니다.");
      return;
    }

    const fetchMeetings = async () => {
      try {
        setLoading(true);
        setError("");

        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch(
          `${API_BASE_URL}/api/v1/projects/${projectId}/meetings`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const result = await response.json();

        console.log("회의 목록 조회 응답:", result);

        if (!response.ok || !result.success) {
          throw new Error(
            result.error?.message || "회의 목록을 불러오지 못했습니다.",
          );
        }

        setMeetings(result.data);
      } catch (error) {
        console.error("회의 목록 조회 실패:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [projectId]);

  const tableRows = meetings.map((meeting) => ({
    id: meeting.id,

    label: `${meeting.title} 회의 결과 보기`,

    cells: [
      meeting.title,

      <Link
        key="project"
        to={projectPath("DETAIL", projectId)}
        className="relative z-20 hover:underline"
      >
        프로젝트
      </Link>,

      meeting.purpose,

      formatMeetingDate(meeting.meetingDate),
    ],

    href: meetingPath("DETAIL", projectId, meeting.id),
  }));

  return (
    <HeroLayout
      header={<Header {...HEADER_PRESETS.appOnLight} />}
      hero={
        <Hero
          size="sm"
          align="left"
          title="지난 회의"
          description="회의를 클릭하면 회의 결과와 다르게 이해될 수 있는 부분을 다시 확인할 수 있어요."
        />
      }
    >
      <div className="mx-auto w-full max-w-[1460px] px-5 pb-16 sm:px-8 lg:px-0 lg:pb-[92px]">
        <div className="mt-[40px] lg:mt-[82px]">
          {loading ? (
            <p>회의 목록을 불러오는 중...</p>
          ) : error ? (
            <p>{error}</p>
          ) : meetings.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <p className="text-24 font-semibold text-[#717171]">
                아직 등록된 회의가 없어요.
              </p>

              <p className="mt-3 text-16 font-medium text-[#878787]">
                새로운 회의를 생성해보세요.
              </p>

              <Link
                to={
                  projectId
                    ? projectPath("MEETING_NEW", projectId)
                    : PATHS.PROJECTS
                }
                className="mt-8 rounded-[8px] bg-[#d0d0d0] px-6 py-3 text-16 font-semibold text-[#717171]"
              >
                회의 생성하기
              </Link>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="mb-8 flex justify-end">
                <Link
                  to={projectPath("MEETING_NEW", projectId)}
                  className="rounded-[8px] bg-[#d0d0d0] px-6 py-3 text-16 font-semibold text-[#717171]"
                >
                  다음 회의 생성하기
                </Link>
              </div>

              <Table columns={TABLE_COLUMNS} rows={tableRows} />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </HeroLayout>
  );
}
