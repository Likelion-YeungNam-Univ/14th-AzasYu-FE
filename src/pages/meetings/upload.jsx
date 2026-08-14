import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import uploadIcon from "@/assets/icons/upload.svg";
import { Header, Hero, HeroLayout } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import {
  API_BASE_URL,
  HEADER_PRESETS,
  HERO_CARD_OVERLAP,
  MEETING_TITLE,
  meetingPath,
} from "@/lib";

export function MeetingUploadPage() {
  const { projectId = "", meetingId = "" } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
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

      // 원문 등록 성공 → 자동 분석 → 결과 페이지
      navigate(meetingPath("LOADING", projectId, meetingId));
    } catch (error) {
      console.error("회의 원문 등록 실패:", error);
      alert(error.message);
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

      // 원문 등록 성공 → 자동 분석 → 결과 페이지
      navigate(meetingPath("LOADING", projectId, meetingId));
    } catch (error) {
      console.error("회의 파일 업로드 실패:", error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };
  return (
    <HeroLayout
      overlapHeader
      cardOverlap={HERO_CARD_OVERLAP}
      header={<Header {...HEADER_PRESETS.appOnHero} />}
      hero={
        <Hero
          size="lg"
          align="center"
          title={`${MEETING_TITLE} 텍스트 업로드`}
          contentTop={258}
        />
      }
    >
      <div className="flex w-full justify-center px-5 pb-16 sm:px-8 lg:pb-[191px]">
        <Card className="w-full max-w-[878px] px-6 py-10 sm:px-10 lg:px-[40px] lg:py-[99px]">
          <div className="flex w-full flex-col items-center gap-[20px]">
            <img
              src={uploadIcon}
              alt=""
              className="block h-[36px] w-[48px] max-w-none shrink-0"
            />

            <div className="flex flex-col items-center gap-[12px] py-[10px] text-center">
              <p className="text-20 font-semibold text-[#717171] lg:text-24">
                회의 내용을 분석해볼까요?
              </p>
              <p className="text-16 font-medium text-[#878787] lg:text-18">
                회의 내용을 담은 TXT, DOCX, PDF 파일을 업로드해주세요.
              </p>
            </div>

            <label className="text-20 flex w-full max-w-[282px] cursor-pointer items-center justify-center rounded-[8px] bg-[#d0d0d0] px-[24px] py-[14px] font-semibold whitespace-nowrap text-[#717171] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#606060]">
              파일 업로드
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

            <p className="text-14 font-semibold text-[#717171]">또는</p>

            <textarea
              placeholder="텍스트 직접 입력하기"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="text-14 h-[491px] w-full max-w-[514px] resize-none rounded-[8px] bg-[#eaeaea] px-[24px] py-[14px] font-semibold text-[#717171] placeholder:text-[#717171]"
            />

            <Button
              className="w-full max-w-[514px]"
              onClick={handleTextUpload}
              disabled={uploading}
            >
              {uploading ? "회의 내용 등록 중..." : "회의 내용 등록"}
            </Button>
          </div>
        </Card>
      </div>
    </HeroLayout>
  );
}
