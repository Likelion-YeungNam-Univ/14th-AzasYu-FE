import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus } from "@/components/icons";
import { Footer, Header, Hero, HeroLayout } from "@/components/layout";
import { SkeletonCards, StateView } from "@/components/states";
import { ProjectCard } from "@/components/cards";
import { RevealOnScroll } from "@/components/motion";
import { Pagination } from "@/components/pagination";
import { Button, TextField } from "@/components/ui";
import { API_BASE_URL, HEADER_PRESETS, PATHS } from "@/lib";

const getMyProjects = async () => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}/api/v1/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`프로젝트 조회 실패: ${response.status}`);
  }

  return response.json();
};

const joinProject = async (joinCode) => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}/api/v1/projects/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      joinCode,
    }),
  });

  if (!response.ok) {
    throw new Error(`프로젝트 참여 실패: ${response.status}`);
  }

  return response.json();
};

const getMeetingCount = async (projectId) => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(
    `${API_BASE_URL}/api/v1/projects/${projectId}/meetings`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) return undefined;

  const result = await response.json();

  return Array.isArray(result.data) ? result.data.length : undefined;
};

const formatProjectDate = (value) => {
  const created = new Date(value);

  if (Number.isNaN(created.getTime())) return "";

  const pad = (part) => String(part).padStart(2, "0");

  return `${created.getFullYear()}. ${pad(created.getMonth() + 1)}. ${pad(created.getDate())}`;
};

const formatParticipants = (members) => {
  if (!members?.length) return "참여자 없음";

  return members.length === 1
    ? members[0].name
    : `${members[0].name} 외 ${members.length - 1}명`;
};

const toProjectCards = async (rawProjects) => {
  const counts = await Promise.all(
    rawProjects.map((project) =>
      getMeetingCount(project.id).catch(() => undefined),
    ),
  );

  return rawProjects.map((project, index) => ({
    ...project,

    // 프로젝트 생성일
    date: formatProjectDate(project.createdAt),

    // 프로젝트 참여자
    participants: formatParticipants(project.members),

    meetingCount: counts[index],
  }));
};

const PROJECTS_PER_PAGE = 9;

export function ProjectsPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 프로젝트 참여 관련 상태
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");

  // 내 프로젝트 목록 조회
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getMyProjects();

        setProjects(await toProjectCards(response.data));
      } catch (error) {
        console.error(error);
        setError("프로젝트를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(projects.length / PROJECTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageProjects = projects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE,
  );

  const handleJoinProject = async () => {
    if (!joinCode.trim()) {
      setJoinError("참여코드를 입력해주세요.");
      return;
    }

    try {
      setJoinLoading(true);
      setJoinError("");

      const response = await joinProject(joinCode.trim());

      if (!response.success) {
        setJoinError(
          response.error?.message || "프로젝트 참여에 실패했습니다.",
        );
        return;
      }

      setIsJoinModalOpen(false);
      setJoinCode("");
      setJoinError("");

      // 프로젝트 목록 다시 조회
      const projectsResponse = await getMyProjects();

      setProjects(await toProjectCards(projectsResponse.data));
    } catch (error) {
      console.error(error);
      setJoinError("프로젝트 참여에 실패했습니다.");
    } finally {
      setJoinLoading(false);
    }
  };

  useEffect(() => {
    if (!isJoinModalOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") handleCloseJoinModal();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isJoinModalOpen]);

  const handleCloseJoinModal = () => {
    setIsJoinModalOpen(false);
    setJoinCode("");
    setJoinError("");
  };

  return (
    <HeroLayout
      header={<Header {...HEADER_PRESETS.appOnLight} />}
      hero={
        <Hero
          size="md"
          align="left"
          title="내 프로젝트"
          description="진행 중인 프로젝트를 열거나, 참여코드로 새로운 팀에 합류해보세요."
          descriptionWeight="medium"
          footer={
            <Button
              size="inline"
              variant="secondary"
              className="bg-white"
              onClick={() => {
                setIsJoinModalOpen(true);
                setJoinError("");
              }}
            >
              참여코드 입력
            </Button>
          }
        />
      }
    >
      <div className="mx-auto w-full max-w-[1460px] px-5 pb-20 sm:px-8 lg:px-8 xl:px-12 lg:pb-[151px]">
        <div style={{ animationDelay: "700ms" }}
          className="animate-lift-in mt-10 flex lg:mt-[111px]">
          <Button
            variant="subtle"
            onClick={() => navigate(PATHS.PROJECT_NEW)}
            className="flex items-center gap-[10px] rounded-[12px] px-6 py-4 text-18 font-bold text-[#4263eb] sm:px-8 sm:text-20"
          >
            <Plus size={28} />
            새 프로젝트 만들기
          </Button>
        </div>

        {loading && <SkeletonCards className="mt-6 lg:mt-[35px]" count={9} />}

        {error && <StateView
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
          />}

        {!loading && !error && (
          <div className="mt-6 grid grid-cols-1 gap-x-[25px] gap-y-10 sm:grid-cols-2 lg:mt-[35px] lg:grid-cols-3 lg:gap-y-[70px]">
            {pageProjects.map((project, index) => (
              <RevealOnScroll
                key={project.id}
                after={700}
                delay={(index % 3) * 90}
              >
                <ProjectCard project={project} />
              </RevealOnScroll>
            ))}
          </div>
        )}

        {!loading && !error && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={setPage}
            className="mt-12 lg:mt-[70px]"
          />
        )}
      </div>

      {isJoinModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="프로젝트 참여"
          onClick={handleCloseJoinModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-[500px] rounded-[24px] bg-white p-8 shadow-[10px_10px_30px_0px_rgba(0,0,0,0.12)]"
          >
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-28 font-semibold text-[#1c232b]">
                  프로젝트 참여
                </h2>

                <p className="mt-2 text-16 text-[#858894]">
                  참여코드를 입력해주세요.
                </p>
              </div>

              <TextField
                tone="form"
                label="참여코드"
                placeholder="참여코드를 입력하세요."
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(
                    e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase(),
                  );
                  setJoinError("");
                }}
                wrapperClassName="w-full"
              />

              {joinError && (
                <p role="alert" className="text-14 font-medium text-[#da1e51]">
                  {joinError}
                </p>
              )}

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={handleCloseJoinModal}
                >
                  취소
                </Button>

                <Button
                  className="flex-1"
                  onClick={handleJoinProject}
                  disabled={joinLoading}
                >
                  {joinLoading ? "참여 중..." : "프로젝트 참여"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </HeroLayout>
  );
}
