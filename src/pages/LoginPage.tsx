import { useNavigate } from 'react-router'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { TextField } from '@/components/ui/TextField'
import { HEADER_PRESETS } from '@/constants/header'
import { PATHS } from '@/routes/paths'

/*
 * Figma: Desktop - 26 (node 3:492), 1920 x 1089
 * 같은 화면의 다른 상태: Desktop - 27 (이메일 입력됨), Desktop - 28 (에러)
 *
 * lg(1024px) 이상에서 시안 실측값과 일치한다.
 *   헤더        0 ~ 80
 *   "로그인"     중심 y=293.5 → top 260  (Desktop-8 "회원가입"과 동일)
 *   이메일       top 373  h54 w501   (Desktop-8 카드 top과 동일)
 *   비밀번호      top 441            gap 14
 *   이메일 저장    top 513  h28      gap 18
 *   로그인 버튼    top 587            gap 46
 *   회원가입 버튼   top 655            gap 14
 *
 * 체크박스 **행 높이는 28**이다 (박스는 18이지만 라벨이 20px x 1.4 = 28).
 * 이걸 18로 착각하면 버튼 간격을 56으로 잡아 10px 밀린다 — 실측으로 잡았다.
 *   바닥 709 → 아래 여백 1089 - 709 = 380
 *
 * 전부 left 711 w 501이다. 1920 - 711 - 501 = 708이라 1.5px 비대칭인데
 * § 3-3에 따라 정중앙(709.5)으로 맞춘다.
 *
 * lg 미만은 Figma에 시안이 없다. 세로 리듬만 줄이고 폭은 max-w로 상한을 둔다.
 *
 * Desktop-28의 에러 문구("없는 아이디이거나 비밀번호가 일치하지 않습니다.")는
 * 아직 스타일을 읽지 않았다. 인증 로직도 범위 밖이므로 여기서는 다루지 않는다.
 */
const COLUMN = 'w-full max-w-[501px]'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-svh w-full bg-white">
      <Header {...HEADER_PRESETS.auth} />

      <main className="flex flex-col items-center px-5 pb-16 sm:px-8 lg:pb-[380px]">
        <h1 className="text-28 mt-16 font-semibold whitespace-nowrap text-black sm:mt-24 sm:text-34 lg:mt-[180px] lg:text-48">
          로그인
        </h1>

        {/* 인풋 2개, 라벨 없이 placeholder만 */}
        <div
          className={`${COLUMN} mt-8 flex flex-col gap-[14px] lg:mt-[46px]`}
        >
          <TextField
            tone="login"
            type="email"
            autoComplete="email"
            placeholder="이메일"
            aria-label="이메일"
          />
          <TextField
            tone="login"
            type="password"
            autoComplete="current-password"
            placeholder="비밀번호"
            aria-label="비밀번호"
          />
        </div>

        {/* 인풋과 같은 좌측 라인에 맞춘다 */}
        <div className={`${COLUMN} mt-[18px]`}>
          <Checkbox label="이메일 저장" name="remember" />
        </div>

        <Button
          size="blockSm"
          className={`${COLUMN} mt-8 lg:mt-[46px]`}
          onClick={() => navigate(PATHS.PROJECTS)}
        >
          로그인
        </Button>

        <Button
          variant="secondaryMuted"
          size="blockSm"
          className={`${COLUMN} mt-[14px]`}
          onClick={() => navigate(PATHS.SIGNUP)}
        >
          회원가입
        </Button>
      </main>
    </div>
  )
}
