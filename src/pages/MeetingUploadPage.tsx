import uploadIcon from '@/assets/icons/upload.svg'
import { Header } from '@/components/layout/Header'
import { Hero, HeroLayout } from '@/components/layout/Hero'
import { Card } from '@/components/ui/Card'
import { HEADER_PRESETS } from '@/constants/header'
import { HERO_CARD_OVERLAP } from '@/constants/site'

/*
 * Figma: Desktop - 35 (node 1:117), 1920 x 1564 — 회의 텍스트 업로드
 *
 * lg(1024px) 이상에서 시안 실측값과 일치한다.
 *   히어로        0 ~ 670, 헤더가 위에 겹침 (tone onHero)
 *   히어로 제목    x704 y258 w514 — **부제가 없다.** 48 Bold
 *   카드          x521 y401 878x972 — px-40 py-99, rounded-30, shadow soft
 *   문서 높이      1564
 *
 * 카드 내부 y (카드 상단 기준) — 모든 섹션 간 gap 20
 *   업로드 아이콘   99   48x36
 *   안내 텍스트    155  **h91 = py10 + 71 + py10**
 *   파일 업로드    266  282x56
 *   또는          342  14px, h20
 *   텍스트 입력    382  514x491
 *   카드 바닥      873 → +py99 = 972
 *
 * **안내 텍스트의 py-10을 빼먹으면 안 된다.** Figma가 이 블록만 p-10 래퍼로 감싸는데,
 * 없애면 아래 요소가 전부 20px씩 위로 밀린다 (버튼 266 → 246).
 *
 * 히어로 제목 중심은 704 + 257 = 961로 정중앙(960)에서 1px 어긋난다 —
 * § 3-3에 따라 미세 오차로 보고 정중앙 정렬했다.
 */

/* 시안의 회의명. 실제로는 회의 조회 응답에서 받아야 한다 (§ 1) */
const MEETING_TITLE = '6차 기획 회의'

export function MeetingUploadPage() {
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

            {/* Figma가 이 블록만 p-10으로 감싼다 — 빼면 아래가 전부 밀린다 */}
            <div className="flex flex-col items-center gap-[12px] py-[10px] text-center">
              <p className="text-20 font-semibold text-[#717171] lg:text-24">
                회의 내용을 분석해볼까요?
              </p>
              <p className="text-16 font-medium text-[#878787] lg:text-18">
                회의 내용을 담은 TXT, DOCX, PDF 파일을 업로드해주세요.
              </p>
            </div>

            {/*
             * 파일 선택. 시안은 버튼 하나지만 실제로 파일을 고를 수 있어야 하므로
             * label + 숨긴 input으로 만든다. 업로드 전송은 API가 범위 밖이라 없다.
             * Button 컴포넌트에 없는 조합(bg #d0d0d0 / px24 py14 / rounded-8 / 20 SemiBold)이라
             * 여기서 직접 조립했다. 다른 화면에 또 나오면 variant로 승격할 것.
             */}
            <label className="text-20 flex w-full max-w-[282px] cursor-pointer items-center justify-center rounded-[8px] bg-[#d0d0d0] px-[24px] py-[14px] font-semibold whitespace-nowrap text-[#717171] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#606060]">
              파일 업로드
              <input type="file" accept=".txt,.docx,.pdf" className="sr-only" />
            </label>

            <p className="text-14 font-semibold text-[#717171]">또는</p>

            <textarea
              placeholder="텍스트 직접 입력하기"
              className="text-14 h-[491px] w-full max-w-[514px] resize-none rounded-[8px] bg-[#eaeaea] px-[24px] py-[14px] font-semibold text-[#717171] placeholder:text-[#717171]"
            />
          </div>
        </Card>
      </div>
    </HeroLayout>
  )
}
