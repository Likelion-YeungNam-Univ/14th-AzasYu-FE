import { useNavigate } from "react-router";
import { useState } from "react";
import { SIGNUP_COMPLETE_KEY } from "@/components/guards";
import { Header } from "@/components/layout";
import { Button, TextField } from "@/components/ui";
import { API_BASE_URL, HEADER_PRESETS, PATHS } from "@/lib";

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

  const [signingUp, setSigningUp] = useState(false);

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
      setSigningUp(true);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            password: formData.password,
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        sessionStorage.setItem(SIGNUP_COMPLETE_KEY, "1");
        navigate(PATHS.SIGNUP_COMPLETE, { replace: true });
      } else {
        alert(result.error?.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      alert("서버와 연결할 수 없습니다.");
    } finally {
      setSigningUp(false);
    }
  };

  return (
    <div className="min-h-svh w-full bg-white">
      <Header {...HEADER_PRESETS.auth} />

      <main className="flex flex-col items-center px-5 pb-16 sm:px-8 lg:pb-[193px]">
        <h1 className="text-28 mt-16 font-semibold whitespace-nowrap text-[#1c232b] sm:mt-24 sm:text-34 lg:mt-[113px] lg:text-48">
          회원가입
        </h1>

        <div className="mt-8 flex w-full max-w-[501px] flex-col items-center gap-[22px] rounded-[30px] border border-solid border-[#b8bccc] px-5 py-[28px] sm:px-[26px] lg:mt-[50.8px]">
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
          disabled={signingUp}
        >
          가입 완료
        </Button>
      </main>

      {signingUp && (
        <div
          role="status"
          aria-label="회원가입 처리 중"
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/70"
        >
          <span className="block size-[56px] animate-spin rounded-full border-4 border-solid border-[#d0d0d0] border-t-[#606060]" />
        </div>
      )}
    </div>
  );
}
