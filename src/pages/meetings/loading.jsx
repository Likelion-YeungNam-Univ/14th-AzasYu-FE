import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import analyzingIllustration from "@/assets/icons/analyzing.svg";
import { Header } from "@/components/layout";
import { API_BASE_URL, HEADER_PRESETS, meetingPath } from "@/lib";

export function MeetingLoadingPage() {
  const { projectId = "", meetingId = "" } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!meetingId) return;

    let stopped = false;

    const checkResult = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          alert("로그인이 필요합니다.");
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/v1/meetings/${meetingId}/result`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (response.status === 404) {
          console.log("아직 분석 결과가 생성되지 않았습니다.");
          return;
        }

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error?.message || "회의 분석 결과를 확인하지 못했습니다.",
          );
        }

        const status = result.data?.status;

        console.log("회의 분석 상태:", status);

        if (status === "GENERATED") {
          if (stopped) return;

          navigate(meetingPath("DETAIL", projectId, meetingId), {
            replace: true,
          });

          return;
        }

        if (status === "FAILED") {
          throw new Error(
            result.data?.failureMessage || "회의 분석에 실패했습니다.",
          );
        }

        // PENDING, PROCESSING 등의 상태라면
        // 아무것도 하지 않고 다음 polling을 기다린다.
      } catch (error) {
        console.error("회의 분석 상태 확인 실패:", error);

        if (!stopped) {
          alert(error.message);
        }
      }
    };

    // 처음 한 번 바로 확인
    checkResult();

    // 이후 2초마다 상태 확인
    const intervalId = setInterval(checkResult, 2000);

    return () => {
      stopped = true;
      clearInterval(intervalId);
    };
  }, [meetingId, projectId, navigate]);

  return (
    <div className="min-h-svh w-full bg-white">
      <Header {...HEADER_PRESETS.appOnWhite} />

      <main
        className="flex flex-col items-center px-5 pb-16 sm:px-8"
        aria-live="polite"
      >
        <img
          src={analyzingIllustration}
          alt=""
          className="mt-24 block h-[165px] w-[176.084px] max-w-none shrink-0 sm:mt-40 lg:mt-[296px]"
        />

        <div className="mt-10 flex flex-col items-center gap-[12px] text-center lg:mt-[50px]">
          <h1 className="text-28 font-semibold text-black sm:text-34 lg:text-48">
            회의 내용을 꼼꼼히 분석하고 있어요
          </h1>

          <p className="text-18 font-semibold text-[#606060] sm:text-20 lg:text-24">
            회의 내용에 따라 최대 @분 정도 소요될 수 있어요.
          </p>
        </div>
      </main>
    </div>
  );
}
