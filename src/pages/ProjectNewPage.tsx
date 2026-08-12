import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Header } from '@/components/layout/Header'
import { Hero, HeroLayout } from '@/components/layout/Hero'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { ColorSwatches } from '@/components/ui/ColorSwatches'
import { TextAreaField, TextField } from '@/components/ui/TextField'
import { HEADER_PRESETS } from '@/constants/header'
import { HERO_CARD_OVERLAP } from '@/constants/site'
import { projectPath } from '@/routes/paths'

/*
 * Figma: Desktop - 30 (node 1:295), 1920 x 1487 — 프로젝트 생성
 *
 * 구조가 Desktop-31(회의 생성)과 거의 같다. 히어로 lg(670)@y0 + 헤더 겹침 +
 * 카드 top-401. 컴포넌트도 대부분 그대로 재사용한다.
 *
 * lg(1024px) 이상에서 시안 실측값과 일치한다.
 *   히어로        0 ~ 670, 헤더가 위에 겹침 (tone onHero)
 *   히어로 텍스트  y220, 제목 48 Bold + gap16 + 부제 18 SemiBold
 *   카드          x525 y401 **869x954** — px-152 py-88, rounded-30, shadow soft
 *   폼 컬럼        565 x 778, 섹션 간 gap 34
 *   문서 높이      1487
 *
 * 폼 컬럼 안쪽 y (컬럼 상단 기준)
 *   프로젝트 이름   0    라벨 28 + gap18 + 인풋 66      = 112
 *   프로젝트 설명   146  라벨 28 + gap18 + 텍스트영역 132 = 178
 *   프로젝트 색상   358  라벨 28 + gap18 + 스와치 40     = 86
 *   팀원 초대      478  라벨 28 + gap18 + 인풋 66 + gap13 + 칩 41 = 166
 *   프로젝트 생성   678  562x66                        → 바닥 744
 *
 * **컬럼 높이 778은 콘텐츠 744보다 34px 크다.** Desktop-31의 1097과 같은 상황으로
 * 디자이너가 프레임을 늘린 것이다. 카드 높이 954(= 88x2 + 778)를 맞추려면 필요하다.
 *
 * **히어로 텍스트가 정중앙이 아니다.** Figma는 x791 w308이라 중심이 945로 15px 왼쪽이다
 * (카드는 x525 w869로 중심 959.5 = 정중앙). 같은 화면에서 카드만 중앙이고 제목이
 * 틀어져 있으면 버그로 보이므로 § 3-3대로 정중앙에 맞췄다. **시안과 다른 부분이다.**
 */
const COLUMN = 'w-full max-w-[562px]'

/** 시안의 더미 데이터. 실제 API 연동은 범위 밖이다 (§ 1) */
const INITIAL_MEMBERS = ['이지혜', '박소연', '이승민']

export function ProjectNewPage() {
  const [members, setMembers] = useState(INITIAL_MEMBERS)
  const [color, setColor] = useState(0)
  const navigate = useNavigate()

  return (
    <HeroLayout
      overlapHeader
      cardOverlap={HERO_CARD_OVERLAP}
      header={<Header {...HEADER_PRESETS.appOnHero} />}
      hero={
        <Hero
          size="lg"
          align="center"
          title="프로젝트 생성"
          description="함께할 프로젝트의 기본 정보를 입력해주세요."
          contentTop={220}
        />
      }
    >
      <div className="flex w-full justify-center px-5 pb-16 sm:px-8 lg:pb-[132px]">
        <Card className="w-full max-w-[869px] px-6 py-10 sm:px-10 lg:px-[152px] lg:py-[88px]">
          <div className="mx-auto flex w-full max-w-[565px] flex-col items-center gap-[34px] lg:min-h-[778px]">
            <TextField
              tone="form"
              label="프로젝트 이름"
              placeholder="프로젝트 이름을 입력하세요."
              wrapperClassName={COLUMN}
            />

            <TextAreaField
              tone="form"
              label="프로젝트 설명"
              placeholder="프로젝트에 대해 간단히 설명해주세요."
              wrapperClassName={COLUMN}
            />

            {/* 색상 선택은 TextField 껍데기를 쓸 수 없어 직접 조립한다 */}
            <div className={`${COLUMN} flex flex-col gap-[18px]`}>
              <span className="text-20 font-medium text-[#717171]">
                프로젝트 색상
              </span>
              <ColorSwatches value={color} onChange={setColor} />
            </div>

            <div className={`${COLUMN} flex flex-col gap-[18px]`}>
              <TextField
                tone="form"
                label="팀원 초대 (선택)"
                type="email"
                placeholder="이메일을 입력하세요."
              />
              {/* 인풋 바닥 → 칩 top 간격 13 (섹션 gap 18에서 5 당긴다) */}
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

            {/*
             * 생성 후 참여코드 공유 화면(Desktop - 40)으로 간다.
             * 실제로는 서버가 만든 projectId를 받아야 한다 — API가 범위 밖이라 더미다.
             */}
            <Button
              className={COLUMN}
              onClick={() => navigate(projectPath('COMPLETE', '1'))}
            >
              프로젝트 생성
            </Button>
          </div>
        </Card>
      </div>
    </HeroLayout>
  )
}
