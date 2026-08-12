import { useNavigate } from 'react-router'
import { ChevronRight } from '@/components/icons/ChevronRight'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { meetingPath, projectPath } from '@/routes/paths'

/*
 * 프로젝트 상세의 회의 카드. Figma node `1:219` — Desktop-11.
 *
 *   카드      878 폭, px-158 py-80, rounded-30, shadow **drop**
 *             (30/31의 soft와 다른 값이다 — Card의 shadow prop으로 구분)
 *   내부 폭   562, 섹션 간 gap 44
 *
 * 카드 내부 y (카드 상단 기준, Figma 절대값)
 *   제목 블록   80   34 Bold + gap4 + 16 Medium #9d9d9d      = 74
 *   구분선     198  1px #c7c7c7
 *   참여 현황   242  라벨 행 22.4 + gap13.6 + 바 9            = 45
 *   버튼 2개   331  66 + gap12 + 66                          = 144
 *   구분선     519
 *   안내 블록   563  24 Bold + gap4 + 16 Medium               = 60
 *   버튼 2개   667  66 + gap12 + 66                          = 144
 *   카드 높이   891  (= 80 + 811)
 *
 * **진행 바 폭이 데이터와 맞지 않는다.** 시안은 562 중 392(69.75%)를 채우는데
 * 표시된 값은 4/6(66.7% = 374.7px)이다. 디자이너가 눈대중으로 그린 것으로 보고
 * **데이터에서 계산**하도록 구현했다 — 숫자와 막대가 어긋나면 그게 버그다.
 * 그래서 lg에서 시안보다 약 17px 짧다. § 1에 따라 사용자에게 알렸다.
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
      <div className="mx-auto flex w-full max-w-[562px] flex-col gap-[44px]">
        <div className="flex flex-col gap-[4px]">
          <p className="text-28 font-bold text-black lg:text-34">{title}</p>
          <p className="text-16 font-medium text-[#9d9d9d]">{startsAt}</p>
        </div>

        <Divider />

        {/* 라벨 행 22.4 → 바 top 36이므로 gap 13.6 */}
        <div className="flex flex-col gap-[13.6px]">
          <div className="text-16 flex justify-between font-medium text-[#9d9d9d]">
            <span>참여 현황</span>
            <span>
              {participantsDone}/{participantsTotal}명 완료
            </span>
          </div>
          <div className="h-[9px] w-full overflow-clip rounded-[33px] bg-[#d9d9d9]">
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
           * 시안에서 이 버튼은 회의 카드 안에 있다. 회의가 여러 개로 늘어나면
           * 카드마다 반복되는데, 프로젝트에 하나만 있으면 되는 동작이라 어색해진다.
           * 디자이너의 수정 시안이 나오면 카드 밖으로 빼야 할 수 있다.
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
