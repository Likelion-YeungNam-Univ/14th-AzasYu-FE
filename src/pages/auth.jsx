import { Link, useNavigate } from "react-router";
import { useState } from "react";
import checkBadge from "@/assets/icons/check-badge.svg";
import { ArrowRight } from "@/components/icons";
import { Header, Hero, HeroLayout } from "@/components/layout";
import { Button, Checkbox, TextField } from "@/components/ui";
import { HEADER_PRESETS, PATHS } from "@/lib";

export function WelcomePage() {
  const navigate = useNavigate();

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
  );
}

const LOGIN_COLUMN = "w-full max-w-[501px]";

export function LoginPage() {
  const navigate = useNavigate();

  // 1. 이메일과 비밀번호 입력값 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 2. 로그인 버튼 클릭 시 실행할 함수
  const handleLogin = async () => {
    // 간단한 빈 값 검사
    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      // 🚨 주의: 스웨거에서 로그인 API 주소가 맞는지 한 번 더 확인하세요! (보통 /login 입니다)
      const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 3. 가장 중요한 부분: 로그인 성공 시 발급받은 토큰을 브라우저에 저장
        // 이렇게 저장해두면 나중에 내 정보 조회나 프로젝트 생성 등 다른 API를 쏠 때 꺼내 쓸 수 있습니다.
        localStorage.setItem("accessToken", result.data.accessToken);

        // 4. 로그인 성공 후 메인 페이지(프로젝트 목록 등)로 이동
        navigate(PATHS.PROJECTS);
      } else {
        // 백엔드에서 비밀번호 틀림 등의 에러를 내려준 경우
        alert(
          result.error?.message ||
            "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.",
        );
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      alert("서버와 연결할 수 없습니다.");
    }
  };

  return (
    <div className="min-h-svh w-full bg-white">
      <Header {...HEADER_PRESETS.auth} />

      <main className="flex flex-col items-center px-5 pb-16 sm:px-8 lg:pb-[313px]">
        <h1 className="text-28 mt-16 font-semibold whitespace-nowrap text-black sm:mt-24 sm:text-34 lg:mt-[233px] lg:text-48">
          로그인
        </h1>

        <div
          className={`${LOGIN_COLUMN} mt-8 flex flex-col gap-[14px] lg:mt-[51px]`}
        >
          {/* 5. TextField에 상태(state) 연결 */}
          <TextField
            tone="login"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="이메일"
            aria-label="이메일"
          />
          <TextField
            tone="login"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          onClick={handleLogin} // 6. 버튼에 클릭 이벤트 연결
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
  );
}

const SIGNUP_FIELDS = [
  {
    name: "email",
    label: "이메일",
    placeholder: "이메일",
    type: "email",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "비밀번호",
    placeholder: "비밀번호(8-15자)",
    type: "password",
    autoComplete: "new-password",
  },
  {
    name: "passwordConfirm",
    label: "비밀번호 확인",
    placeholder: "비밀번호 확인",
    type: "password",
    autoComplete: "new-password",
  },
  {
    name: "name",
    label: "이름",
    placeholder: "이름",
    type: "text",
    autoComplete: "name",
  },
];

export function SignUpPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = async () => {
    if (formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/api/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        navigate(PATHS.SIGNUP_COMPLETE);
      } else {
        alert(result.error?.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      alert("서버와 연결할 수 없습니다.");
    }
  };

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
              // 🚨 수정 포인트 2: 입력값이 상태(formData)에 연결되도록 속성을 추가합니다.
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              // 기존 코드 유지
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
          onClick={handleSignUp}
        >
          가입 완료
        </Button>
      </main>
    </div>
  );
}

export function SignUpCompletePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-svh w-full bg-white">
      <Header {...HEADER_PRESETS.auth} />

      <main className="flex flex-col items-center px-5 pb-16 sm:px-8 lg:pb-[140px]">
        <div className="mt-24 flex flex-col items-center gap-[27px] sm:mt-40 lg:mt-[347px]">
          <img
            src={checkBadge}
            alt=""
            className="block size-[56.186px] shrink-0"
          />

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
  );
}

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-4 bg-white px-5 text-center">
      <p className="text-28 font-semibold text-black">
        페이지를 찾을 수 없습니다
      </p>
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
  );
}
