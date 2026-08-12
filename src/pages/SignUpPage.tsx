import { useNavigate } from 'react-router'
import { AuthHeader } from '@/components/layout/AuthHeader'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { PATHS } from '@/routes/paths'

/*
 * Figma: Desktop - 8 (node 767:1564), 1920 x 1089
 *
 * lg(1024px) 이상에서 시안 실측값과 일치한다.
 *   헤더            0 ~ 80
 *   "회원가입" 중심  y=293.5  (헤더 80 + mt-180 + 행높이 67/2)
 *   카드            top 373, w-501, rounded-10, border #d0d0d0, px-26 py-28, gap-22
 *   인풋            w-445, h-55
 *   가입 완료 버튼   top 883, w-501, h-66
 *   문서 높이        1089 (버튼 바닥 949 + pb-140)
 *
 * lg 미만은 Figma에 시안이 없다. 좌우 여백과 세로 리듬만 줄이고,
 * 폰트는 시안이 실제로 쓰는 스케일(48 / 34 / 28) 안에서만 내린다.
 * 카드·인풋·버튼은 max-w로 시안 폭을 상한으로 두고 그 아래에서는 꽉 채운다.
 */
const FIELDS = [
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
] as const

export function SignUpPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-svh w-full bg-white">
      <AuthHeader />

      <main className="flex flex-col items-center px-5 pb-16 sm:px-8 lg:pb-[140px]">
        <h1 className="text-28 mt-16 font-semibold whitespace-nowrap text-black sm:mt-24 sm:text-34 lg:mt-[180px] lg:text-48">
          회원가입
        </h1>

        <div className="mt-8 flex w-full max-w-[501px] flex-col items-center gap-[22px] rounded-[10px] border border-solid border-[#d0d0d0] px-5 py-[28px] sm:px-[26px] lg:mt-[46px]">
          {FIELDS.map((field) => (
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

        {/* lg에서 카드 바닥 849 → 버튼 top 883 */}
        {/* 인증 미구현. 와이어프레임 흐름을 걸어볼 수 있게 완료 화면으로만 보낸다 */}
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
