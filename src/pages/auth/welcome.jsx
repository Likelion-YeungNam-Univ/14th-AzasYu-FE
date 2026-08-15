import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import welcomeRings from "@/assets/welcome-rings.jpg";
import { Header } from "@/components/layout";
import { API_BASE_URL, HEADER_PRESETS, PATHS } from "@/lib";

const REMEMBERED_EMAIL_KEY = "rememberedEmail";

const LANDING_TEXT = "text-[#1c232b]";

const LANDING_GRADIENT =
  "linear-gradient(-90deg, rgb(255,255,255) 0%, rgba(255,255,255,0) 51.923%, rgb(255,255,255) 100%)";

const LANDING_FIELD =
  "text-20 h-[54px] w-full rounded-[10px] border border-solid bg-white px-[16px] font-medium text-[#1c232b] outline-none placeholder:text-[#b8bccc]";

const landingFieldBorder = (filled) =>
  filled ? "border-[#1c232b]" : "border-[#b8bccc]";

export function WelcomePage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    () => localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? "",
  );
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(
    () => localStorage.getItem(REMEMBERED_EMAIL_KEY) !== null,
  );

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setError("");
  }, [email, password]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("accessToken", result.data.accessToken);
        localStorage.setItem("userId", result.data.userId);
        localStorage.setItem("userName", result.data.name);

        if (rememberEmail) {
          localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
        } else {
          localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        }

        navigate(PATHS.PROJECTS);
      } else {
        setError(
          result.error?.message ||
            "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.",
        );
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      setError("서버와 연결할 수 없습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = email.trim() !== "" && password.trim() !== "";

  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <img
          src={welcomeRings}
          alt=""
          className="absolute top-[0.56%] left-[7.66%] h-[98.8%] w-[89.74%] max-w-none object-contain"
        />

        <div
          className="absolute inset-y-0 right-0 left-[7.66%]"
          style={{ backgroundImage: LANDING_GRADIENT }}
        />
      </div>

      <div className="relative min-h-svh w-full">
        <div className="absolute inset-x-0 top-0 z-10">
          <Header {...HEADER_PRESETS.landing} />
        </div>

        <div className="flex min-h-svh items-center py-28 lg:py-0">
          <div className="mx-auto flex w-full max-w-[1920px] flex-col items-center gap-14 pr-5 pl-5 sm:pr-8 sm:pl-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:pr-[17.135%] lg:pl-[10.781%]">
            <div
              className={`${LANDING_TEXT} flex w-full max-w-[634px] flex-col gap-[16px] text-center lg:-translate-y-[43px] lg:text-left`}
            >
              <h1 className="text-28 font-bold sm:text-34 lg:text-48">
                우리... 같은 얘기하고 있는 거 맞죠?
              </h1>

              <p className="text-16 font-semibold sm:text-18 lg:text-22">
                모두가 같은 의미로 이해할 수 있도록, 협업의 시작
              </p>
            </div>

            <div className="w-full max-w-[501px] shrink-0 lg:translate-y-[7px]">
              <div className="flex flex-col items-center gap-[9px]">
                <h2
                  className={`${LANDING_TEXT} text-28 font-semibold sm:text-34 lg:text-48`}
                >
                  로그인
                </h2>

                {error && (
                  <p
                    role="alert"
                    className="text-16 w-full text-center font-semibold text-[#da1e51] lg:text-20"
                  >
                    {error}
                  </p>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-[14px] lg:mt-[51px]">
                <input
                  className={`${LANDING_FIELD} ${landingFieldBorder(Boolean(email))}`}
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLogin();
                  }}
                  autoComplete="email"
                  placeholder="이메일"
                  aria-label="이메일"
                />

                <input
                  className={`${LANDING_FIELD} ${landingFieldBorder(Boolean(password))}`}
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLogin();
                  }}
                  autoComplete="current-password"
                  placeholder="비밀번호"
                  aria-label="비밀번호"
                />
              </div>

              <label className="mt-[18px] flex w-fit cursor-pointer items-center gap-[8px]">
                <input
                  type="checkbox"
                  name="remember"
                  checked={rememberEmail}
                  onChange={(e) => setRememberEmail(e.target.checked)}
                  className="peer sr-only"
                />

                <span
                  aria-hidden
                  className="flex size-[18px] shrink-0 items-center justify-center rounded-[2px] border border-solid border-[#1c232b] bg-white text-transparent peer-checked:bg-[#1c232b] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#1c232b]"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="block"
                  >
                    <path
                      d="M2.5 6.2L4.8 8.6L9.5 3.4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span
                  className={`${LANDING_TEXT} text-20 font-medium whitespace-nowrap`}
                >
                  이메일 저장
                </span>
              </label>

              <button
                type="button"
                onClick={handleLogin}
                disabled={submitting}
                className={`text-20 mt-8 flex h-[54px] w-full items-center justify-center rounded-[59px] border border-solid font-medium whitespace-nowrap disabled:opacity-60 lg:mt-[46px] ${
                  canSubmit
                    ? "border-[#0075d3] bg-[#0075d3] text-white"
                    : "border-[#1c232b] bg-white text-[#1c232b]"
                }`}
              >
                {submitting ? "로그인 중..." : "로그인"}
              </button>

              <button
                type="button"
                onClick={() => navigate(PATHS.SIGNUP)}
                className={`${LANDING_TEXT} text-20 mt-[14px] flex h-[54px] w-full items-center justify-center rounded-[65px] border border-solid border-[#1c232b] bg-white font-medium whitespace-nowrap`}
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
