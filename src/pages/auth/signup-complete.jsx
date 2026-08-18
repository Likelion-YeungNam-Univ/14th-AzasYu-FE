import { useNavigate } from "react-router";
import checkBadge from "@/assets/icons/check-badge.svg";
import { ArrowRight } from "@/components/icons";
import { SIGNUP_COMPLETE_KEY } from "@/components/guards";
import { Header } from "@/components/layout";
import { Button } from "@/components/ui";
import { HEADER_PRESETS, PATHS } from "@/lib";

export function SignUpCompletePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-svh w-full bg-white">
      <Header {...HEADER_PRESETS.auth} />

      <main className="flex flex-col items-center px-5 pb-16 sm:px-8 lg:pb-[140px]">
        <div className="mt-24 flex flex-col items-center gap-[26px] sm:mt-40 lg:mt-[342px]">
          <img
            src={checkBadge}
            alt=""
            className="block size-[56.186px] shrink-0 max-w-none"
          />

          <h1 className="text-28 text-center font-bold text-ink sm:text-34 lg:text-48 lg:whitespace-nowrap">
            회원가입이 완료되었습니다.
          </h1>

          <Button
            variant="secondary"
            size="inline"
            onClick={() => {
              sessionStorage.removeItem(SIGNUP_COMPLETE_KEY);
              navigate(PATHS.WELCOME, { replace: true });
            }}
          >
            로그인하러 가기
            <ArrowRight />
          </Button>
        </div>
      </main>
    </div>
  );
}
