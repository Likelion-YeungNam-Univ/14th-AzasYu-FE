import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import uploadIcon from "@/assets/icons/upload.svg";
import { Footer, Header, Hero, HeroLayout } from "@/components/layout";
import { StateView } from "@/components/states";
import { Button, Card } from "@/components/ui";
import {
  API_BASE_URL,
  getCurrentUserId,
  HEADER_PRESETS,
  meetingPath,
  toUserMessage,
} from "@/lib";

export function MeetingUploadPage() {
  const { projectId = "", meetingId = "" } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
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

  if (checking) {
    return <StateView size="screen" title="권한을 확인하고 있습니다" />;
  }

  if (!isParticipant) {
    return (
      <StateView
        variant="error"
        size="screen"
        title="회의 참여자만 접근할 수 있습니다"
        description="이 회의에 참여하지 않아 업로드 권한이 없습니다."
      />
    );
  }
  const handleTextUpload = async () => {
    if (!content.trim()) {
      alert("회의 내용을 입력해주세요.");
      return;
    }

    try {
      setUploading(true);

      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/meetings/${meetingId}/record`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            content,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error?.message || "회의 원문 등록에 실패했습니다.",
        );
      }

      navigate(meetingPath("LOADING", projectId, meetingId));
    } catch (error) {
      console.error("회의 원문 등록 실패:", error);
      alert(toUserMessage(error));
    } finally {
      setUploading(false);
    }
  };
  const handleFileUpload = async (file) => {
    try {
      setUploading(true);

      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/meetings/${meetingId}/record/file`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error?.message || "회의 원문 등록에 실패했습니다.",
        );
      }

      navigate(meetingPath("LOADING", projectId, meetingId));
    } catch (error) {
      console.error("회의 파일 업로드 실패:", error);
      alert(toUserMessage(error));
    } finally {
      setUploading(false);
    }
  };
  return (
    <HeroLayout
      header={<Header {...HEADER_PRESETS.appOnLight} />}
      hero={
        <Hero
          size="sm"
          align="center"
          title="회의 내용을 분석해볼까요?"
          description="회의 대화를 올리면 주요 결과와 모호한 부분을 확인할 수 있어요."
          descriptionWeight="medium"
        />
      }
    >
      <div className="flex w-full justify-center px-5 pt-12 pb-16 sm:px-8 lg:pt-[60px] lg:pb-[97px]">
        <Card
          shadow="meeting"
          style={{ animationDelay: "700ms" }}
          className="animate-lift-in w-full max-w-[878px] px-6 py-10 sm:px-10 lg:px-[40px] lg:py-[99px]"
        >
          <div className="flex w-full flex-col items-center gap-[20px]">
            <img
              src={uploadIcon}
              alt=""
              className="block h-[36px] w-[48px] max-w-none shrink-0"
            />

            <div className="flex flex-col items-center gap-[12px] py-[10px] text-center">
              <p className="text-20 font-semibold text-[#1c232b] lg:text-24">
                회의 내용을 분석해볼까요?
              </p>
              <p className="text-16 font-medium text-[#858894] lg:text-18">
                회의 내용을 담은 TXT, DOCX, PDF 파일을 업로드해주세요.
              </p>
            </div>

            <label className="text-20 flex w-[152px] cursor-pointer items-center justify-center rounded-[62px] bg-[#1c232b] px-[24px] py-[14px] font-semibold whitespace-nowrap text-white focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#1c232b]">
              파일 선택
              <input
                type="file"
                accept=".txt,.docx,.pdf"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    handleFileUpload(file);
                  }
                }}
              />
            </label>

            <p className="text-14 font-semibold text-[#858894]">또는</p>

            <textarea
              placeholder="텍스트 직접 입력하기"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="text-14 h-[491px] w-full max-w-[516px] resize-none rounded-[8px] bg-[#f5f5f5] px-[24px] py-[20px] font-semibold text-[#1c232b] outline-none placeholder:text-[#858894] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#0075d3]"
            />

            <Button
              className="w-full max-w-[516px]"
              onClick={handleTextUpload}
              disabled={uploading}
            >
              {uploading ? "회의 내용 등록 중..." : "분석 시작하기"}
            </Button>
          </div>
        </Card>
      </div>

      <Footer />
    </HeroLayout>
  );
}
