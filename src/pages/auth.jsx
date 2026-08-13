import { Link, useNavigate } from 'react-router'
import checkBadge from '@/assets/icons/check-badge.svg'
import { ArrowRight } from '@/components/icons'
import { Header, Hero, HeroLayout } from '@/components/layout'
import { Button, Checkbox, TextField } from '@/components/ui'
import { HEADER_PRESETS, PATHS } from '@/lib'

export function WelcomePage() {
  const navigate = useNavigate()

  return (
    <HeroLayout
      overlapHeader
      background="bg-[#f4f4f4]"
      header={<Header {...HEADER_PRESETS.landing} />}
      hero={
        <Hero
          size="lg"
          align="left"
          title="우리... 같은 얘기하고 있는 거 맞죠?"
          description="모두가 같은 의미로 이해할 수 있도록, 협업의 시작"
          descriptionWeight="semibold"
          footer={
            <Button
              size="inline"
              variant="secondaryOnHero"
              onClick={() => navigate(PATHS.LOGIN)}
            >
              로그인하기
              <ArrowRight />
            </Button>
          }
        />
      }
    >
      {null}
    </HeroLayout>
  )
}

const LOGIN_COLUMN = 'w-full max-w-[501px]'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-svh w-full bg-white">
      <Header {...HEADER_PRESETS.auth} />

      <main className="flex flex-col items-center px-5 pb-16 sm:px-8 lg:pb-[313px]">
        <h1 className="text-28 mt-16 font-semibold whitespace-nowrap text-black sm:mt-24 sm:text-34 lg:mt-[233px] lg:text-48">
          로그인
        </h1>

        <div className={`${LOGIN_COLUMN} mt-8 flex flex-col gap-[14px] lg:mt-[51px]`}>
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

        <div className={`${LOGIN_COLUMN} mt-[18px]`}>
          <Checkbox label="이메일 저장" name="remember" />
        </div>

        <Button
          size="blockSm"
          className={`${LOGIN_COLUMN} mt-8 lg:mt-[46px]`}
          onClick={() => navigate(PATHS.PROJECTS)}
        >
          로그인
        </Button>

        <Button
          variant="secondaryMuted"
          size="blockSm"
          className={`${LOGIN_COLUMN} mt-[14px]`}
          onClick={() => navigate(PATHS.SIGNUP)}
        >
          회원가입
        </Button>
      </main>
    </div>
  )
}

const SIGNUP_FIELDS = [
  { label: '이메일', placeholder: '이메일', type: 'email', autoComplete: 'email' },
  {
    label: '비밀번호',
    placeholder: '비밀번호(8-15자)',
    type: 'password',
    autoComplete: 'new-password',
  },
  {
    label: '비밀번호 확인',
    placeholder: '비밀번호 확인',
    type: 'password',
    autoComplete: 'new-password',
  },
  { label: '이름', placeholder: '이름', type: 'text', autoComplete: 'name' },
]

export function SignUpPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-svh w-full bg-white">
      <Header {...HEADER_PRESETS.auth} />

      <main className="flex flex-col items-center px-5 pb-16 sm:px-8 lg:pb-[193px]">
        <h1 className="text-28 mt-16 font-semibold whitespace-nowrap text-black sm:mt-24 sm:text-34 lg:mt-[113px] lg:text-48">
          회원가입
        </h1>

        <div className="mt-8 flex w-full max-w-[501px] flex-col items-center gap-[22px] rounded-[10px] border border-solid border-[#d0d0d0] px-5 py-[28px] sm:px-[26px] lg:mt-[50.8px]">
          {SIGNUP_FIELDS.map((field) => (
            <TextField
              key={field.label}
              label={field.label}
              placeholder={field.placeholder}
              type={field.type}
              autoComplete={field.autoComplete}
              required
              tone="auth"
              wrapperClassName="w-full max-w-[445px]"
            />
          ))}
        </div>

        <Button
          className="mt-6 w-full max-w-[501px] lg:mt-[34px]"
          onClick={() => navigate(PATHS.SIGNUP_COMPLETE)}
        >
          가입 완료
        </Button>
      </main>
    </div>
  )
}

export function SignUpCompletePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-svh w-full bg-white">
      <Header {...HEADER_PRESETS.auth} />

      <main className="flex flex-col items-center px-5 pb-16 sm:px-8 lg:pb-[140px]">
        <div className="mt-24 flex flex-col items-center gap-[27px] sm:mt-40 lg:mt-[347px]">
          <img src={checkBadge} alt="" className="block size-[56.186px] shrink-0" />

          <h1 className="text-28 text-center font-semibold text-black sm:text-34 lg:text-48 lg:whitespace-nowrap">
            회원가입이 완료되었습니다
          </h1>

          <Button
            variant="secondary"
            size="inline"
            onClick={() => navigate(PATHS.LOGIN)}
          >
            로그인하러 가기
            <ArrowRight />
          </Button>
        </div>
      </main>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-4 bg-white px-5 text-center">
      <p className="text-28 font-semibold text-black">페이지를 찾을 수 없습니다</p>
      <p className="text-16 font-medium text-[#717171]">
        주소가 바뀌었거나 삭제된 페이지일 수 있어요.
      </p>
      <Link
        to={PATHS.PROJECTS}
        className="text-18 mt-2 font-medium text-[#606060] underline underline-offset-4"
      >
        홈으로 가기
      </Link>
    </div>
  )
}
