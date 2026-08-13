import { useNavigate } from 'react-router'
import { ChevronRight } from '@/components/icons/ChevronRight'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { meetingPath, projectPath } from '@/routes/paths'

/*
 * 프로젝트 상세의 회의 카드. Figma node `3:647` — Desktop-46.
 *
 *   카드      878 폭, px-158 py-80, rounded-30, shadow **drop**
 *             (30/31의 soft와 다른 값이다 — Card의 shadow prop으로 구분)
 *   내부 폭   562, 섹션 간 gap 30
 *
 * 카드 내부 y (카드 상단 기준, Figma 절대값)
 *   제목 블록   80   34 Bold + gap4 + 16 Medium #9d9d9d      = 74
 *   구분선     184  1px #c7c7c7
 *   진행 블록   214  **참여 현황 행(39) + gap28 + 버튼 2개(144)** = 211
 *   구분선     455
 *   안내 블록   485  24 Bold + gap4 + 16 Medium               = 60
 *   버튼 2개   575  66 + gap12 + 66                          = 144
 *   카드 높이   799  (= 80 + 639 + 80)
 *
 * **참여 현황 행은 Figma가 absolute로 잡는다** — 높이 39 안에서 라벨은 top 0,
 * 진행 바는 top 31.5다. 라벨 행높이(22.4) + 바(9) = 31.4라서 flex gap으로는 39가
 * 안 나온다. 시안 그대로 absolute로 두어 블록 높이 39를 정확히 맞춘다.
 *
 * **진행 바는 데이터에서 계산한다.** 시안은 562 중 392(69.75%)를 채워 두었지만
 * 표시값은 4/6(66.7% = 374.7px)이다. 숫자와 막대가 어긋나면 그게 버그이므로
 * 참여 인원 비율로 그린다 — lg에서 시안보다 약 17px 짧다.
 */
export interface Meeting {
  id: string
  title: string
  /** "2026. 08. 12 오후 2:00" — 화면에 그대로 보여준다 */
  startsAt: string
  /** 최근순 정렬용 (표시에는 쓰지 않는다) */
  sortKey: number
  participantsDone: number
  participantsTotal: number
}

/*
 * 구분선. **레이아웃 높이를 0으로 유지해야 한다.**
 * Figma도 `h-0` 프레임 위에 stroke를 바깥으로 그린다(`inset-[-1px_0_0_0]`).
 * `border-t`를 그냥 주면 1px이 높이에 더해져서, 구분선 2개에 카드가 2px 커진다.
 * (실제로 891 대신 892.95가 나왔다.)
 */
function Divider() {
  return (
    <div className="relative h-0 w-full">
      <span className="absolute inset-x-0 -top-px block border-t border-[#c7c7c7]" />
    </div>
  )
}

interface MeetingCardProps {
  projectId: string
  meeting: Meeting
}

export function MeetingCard({ projectId, meeting }: MeetingCardProps) {
  const { id, title, startsAt, participantsDone, participantsTotal } = meeting
  const navigate = useNavigate()
  const ratio = participantsTotal
    ? (participantsDone / participantsTotal) * 100
    : 0

  return (
    <Card
      shadow="drop"
      className="w-full max-w-[878px] px-6 py-10 sm:px-10 lg:px-[158px] lg:py-[80px]"
    >
      <div className="mx-auto flex w-full max-w-[562px] flex-col gap-[30px]">
        <div className="flex flex-col gap-[4px]">
          <p className="text-28 font-bold text-black lg:text-34">{title}</p>
          <p className="text-16 font-medium text-[#9d9d9d]">{startsAt}</p>
        </div>

        <Divider />

        {/* 참여 현황 + 액션 버튼이 한 블록이다 (gap 28) */}
        <div className="flex flex-col gap-[28px]">
          {/* 높이 39 고정. 라벨 top 0 / 바 top 31.5 — Figma 구조 그대로 */}
          <div className="relative h-[39px] w-full">
            <p className="text-16 absolute top-0 left-0 font-medium text-[#9d9d9d]">
              참여 현황
            </p>
            <p className="text-16 absolute top-0 right-0 font-medium text-[#9d9d9d]">
              {participantsDone}/{participantsTotal}명 완료
            </p>
            <div className="absolute top-[31.5px] left-0 h-[9px] w-full overflow-clip rounded-[33px] bg-[#d9d9d9]">
              <div
                className="h-full rounded-[33px] bg-[#606060]"
                style={{ width: `${ratio}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-[12px]">
            <Button
              className="w-full"
              onClick={() => navigate(meetingPath('INTERVIEW', projectId, id))}
            >
              AI 사전 인터뷰 하기
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate(meetingPath('BOARD', projectId, id))}
            >
              익명 아이디어 보드 보기
            </Button>
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-[4px]">
          <p className="text-20 font-bold text-black lg:text-24">
            회의가 끝났나요?
          </p>
          <p className="text-16 font-medium text-[#9d9d9d]">
            회의 내용을 업로드하면 AI가 분석해드려요.
          </p>
        </div>

        <div className="flex flex-col gap-[12px]">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => navigate(meetingPath('UPLOAD', projectId, id))}
          >
            회의 텍스트 업로드
          </Button>
          {/*
           * 시안에서 이 버튼은 회의 카드 안에 있다. 카드가 여러 개면 그만큼 반복된다 —
           * 시안 그대로다. 목적지는 카드와 무관하게 프로젝트의 회의 생성 화면이다.
           */}
          <Button
            className="w-full"
            onClick={() => navigate(projectPath('MEETING_NEW', projectId))}
          >
            다음 회의 생성하기
            <ChevronRight />
          </Button>
        </div>
      </div>
    </Card>
  )
}
