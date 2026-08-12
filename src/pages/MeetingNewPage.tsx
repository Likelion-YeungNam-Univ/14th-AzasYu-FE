import { useState } from 'react'
import { Calendar } from '@/components/icons/Calendar'
import { Plus } from '@/components/icons/Plus'
import { Header } from '@/components/layout/Header'
import { Hero, HeroLayout } from '@/components/layout/Hero'
import { AgendaList, type AgendaItem } from '@/components/ui/AgendaList'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { FieldBox } from '@/components/ui/FieldBox'
import { TextAreaField, TextField } from '@/components/ui/TextField'
import { HEADER_PRESETS } from '@/constants/header'
import { HERO_CARD_OVERLAP } from '@/constants/site'

/*
 * Figma: Desktop - 31 (node 759:1074), 1920 x 1849
 *
 * lg(1024px) 이상에서 시안 실측값과 일치한다.
 *   히어로      0 ~ 670, 헤더가 위에 겹침 (tone onHero, nav 있음)
 *   히어로 텍스트 중앙 정렬, top 229 — 제목 48 Bold + gap16 + 부제 18 SemiBold
 *   카드        x525 y401 w869 h1273, rounded-30, shadow soft, px-152 py-88
 *   카드 내부    w565, flex-col gap-34, items-center
 *   문서 높이    1849 (카드 바닥 1674 + 175)
 *
 * 카드가 히어로(670) 위 top-401에 걸치므로 HERO_CARD_OVERLAP(269)만큼 끌어올린다.
 *
 * 섹션별 높이 (라벨 h28, 라벨→입력 간격 18 = Figma "라벨 top 기준 46" - 28)
 *   회의 제목   112 = 28 + 18 + 66
 *   회의 목적   178 = 28 + 18 + 132
 *   회의 안건   256 = 28 + 18 + 154(목록) + 14 + 42(안건 추가)
 *   회의 일시   86  = 28 + 18 + 40
 *   참여자      166 = 28 + 18 + 66 + 13 + 41(칩)
 *   회의 생성   66
 *   합 864 + gap 34x5 = 1034
 *
 * **카드 내부 프레임은 1097인데 콘텐츠는 1034다.** 시안에 63px 여백이 남아 있고
 * `overflow-clip`이 걸려 있다. 디자이너가 프레임을 수동으로 늘린 것으로 보이는데,
 * 카드 높이 1273(=88+1097+88)을 맞추려면 이 값이 필요하므로 min-h로 재현한다.
 *
 * 대부분의 자식이 w562인데 회의 일시 행만 w565다. 그래서 컬럼 폭이 565가 되고
 * items-center 때문에 562 요소들이 x=1.5에 놓인다 (Figma도 x=1.5로 보고한다).
 *
 * lg 미만은 Figma에 시안이 없다. 카드/컬럼 폭은 max-w로 상한을 두고 padding만 줄인다.
 *
 * 폼 상태는 UI 확인용 로컬 state다. API 연동은 범위 밖 (§ 1).
 */
const INITIAL_AGENDA: AgendaItem[] = [
  { id: 'a1', text: '주요 기능 확정' },
  { id: 'a2', text: '타겟 논의' },
  { id: 'a3', text: '개발 일정 및 역할 분담' },
]

const INITIAL_MEMBERS = ['이지혜', '박소연', '이승민']

const COLUMN = 'w-full max-w-[562px]'

export function MeetingNewPage() {
  const [agenda, setAgenda] = useState(INITIAL_AGENDA)
  const [members, setMembers] = useState(INITIAL_MEMBERS)

  return (
    <HeroLayout
      overlapHeader
      cardOverlap={HERO_CARD_OVERLAP}
      header={<Header {...HEADER_PRESETS.appOnHero} />}
      hero={
        <Hero
          size="lg"
          align="center"
          title="회의 생성"
          description="새로운 회의를 시작해보세요."
        />
      }
    >
      <div className="flex w-full justify-center px-5 pb-16 sm:px-8 lg:pb-[175px]">
        <Card className="w-full max-w-[869px] px-6 py-10 sm:px-10 lg:px-[152px] lg:py-[88px]">
          <div className="mx-auto flex w-full max-w-[565px] flex-col items-center gap-[34px] lg:min-h-[1097px]">
            <TextField
              tone="form"
              label="회의 제목"
              placeholder="회의 제목을 입력하세요."
              wrapperClassName={COLUMN}
            />

            <TextAreaField
              tone="form"
              label="회의 목적"
              placeholder="이번 회의의 목적을 간단히 작성해주세요."
              wrapperClassName={COLUMN}
            />

            {/* 회의 안건 — 라벨 + 목록 + 안건 추가. TextField 껍데기를 쓸 수 없어 직접 조립 */}
            <div className={`${COLUMN} flex flex-col gap-[18px]`}>
              <span className="text-20 font-medium text-[#717171]">
                회의 안건
              </span>
              <AgendaList
                items={agenda}
                onRemove={(id) =>
                  setAgenda((prev) => prev.filter((a) => a.id !== id))
                }
              />
              {/* 목록 바닥 → 버튼 top 간격 14 */}
              <Button
                variant="secondary"
                size="small"
                className="-mt-[4px] w-[117px]"
              >
                <Plus />
                안건 추가
              </Button>
            </div>

            <div className={`${COLUMN} flex flex-col gap-[18px] lg:max-w-[565px]`}>
              <span className="text-20 font-medium text-[#717171]">
                회의 일시
              </span>
              <div className="flex flex-wrap items-center gap-[22px]">
                <FieldBox className="w-[217px]" icon={<Calendar />}>
                  2026. 08. 12 (수)
                </FieldBox>
                <FieldBox className="w-[163px]">오전 10:00</FieldBox>
                <FieldBox className="w-[139px]">약 1시간 30분</FieldBox>
              </div>
            </div>

            <div className={`${COLUMN} flex flex-col gap-[18px]`}>
              <TextField
                tone="form"
                label="참여자"
                placeholder="이름을 입력하여 검색하세요."
              />
              {/* 인풋 바닥 → 칩 top 간격 13 */}
              <div className="-mt-[5px] flex flex-wrap gap-[12px]">
                {members.map((name) => (
                  <Chip
                    key={name}
                    label={name}
                    onRemove={() =>
                      setMembers((prev) => prev.filter((m) => m !== name))
                    }
                  />
                ))}
              </div>
            </div>

            <Button className={COLUMN}>회의 생성</Button>
          </div>
        </Card>
      </div>
    </HeroLayout>
  )
}
