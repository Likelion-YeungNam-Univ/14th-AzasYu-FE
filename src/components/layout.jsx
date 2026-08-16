import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import githubIcon from "@/assets/icons/github.svg";
import instagramIcon from "@/assets/icons/instagram.svg";
import likelionLogo from "@/assets/likelion-logo.svg";
import { ChevronRight } from "@/components/icons";
import { API_BASE_URL, buildNavItems, cn, PATHS, SERVICE_NAME } from "@/lib";
import { clearSession } from "@/session";

const TONE = {
  onLight: "text-[#1c232b]",
  onDark: "text-[#1c232b]",
};

const DEFAULT_ACTION = { label: "로그아웃", href: PATHS.WELCOME, logout: true };

const projectNameCache = new Map();

function useProjectName(projectId) {
  const [name, setName] = useState(() => projectNameCache.get(projectId) ?? "");

  useEffect(() => {
    if (!projectId) {
      setName("");
      return;
    }

    const cached = projectNameCache.get(projectId);

    if (cached) {
      setName(cached);
      return;
    }

    let cancelled = false;

    const fetchProjectName = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) return;

        const response = await fetch(
          `${API_BASE_URL}/api/v1/projects/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success || !result.data?.name) return;

        projectNameCache.set(projectId, result.data.name);

        if (!cancelled) {
          setName(result.data.name);
        }
      } catch (error) {
        console.error("헤더 프로젝트 이름 조회 실패:", error);
      }
    };

    fetchProjectName();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return name;
}

export function Header({
  tone = "onLight",
  nav = false,
  action = DEFAULT_ACTION,
  projectName,
  omitProjectNav = false,
  className,
}) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const fetchedName = useProjectName(
    omitProjectNav || projectName ? "" : projectId,
  );
  const navItems = buildNavItems(
    omitProjectNav ? "" : projectId,
    projectName || fetchedName,
  );

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 스크롤이 맨 위 0
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    clearSession();
    projectNameCache.clear();
    navigate(PATHS.WELCOME, { replace: true });
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-100 flex h-[80px] w-full items-center justify-between px-5 sm:px-8 lg:px-[52px] transition-all duration-300",
        isScrolled ? "bg-white/30 backdrop-blur-md shadow-sm" : "bg-white",
        TONE[tone],
        className,
      )}
    >
      <Link
        to={nav ? PATHS.PROJECTS : PATHS.WELCOME}
        className="text-18 font-semibold whitespace-nowrap sm:text-20 lg:text-24"
      >
        {SERVICE_NAME}
      </Link>

      {nav && (
        <nav className="text-16 absolute left-1/2 flex w-full max-w-[40%] -translate-x-1/2 items-center justify-center gap-[16px] sm:gap-[32px] font-medium">
          {navItems.map((item) => {
            const isProjectName = item.label === (projectName || fetchedName);

            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "block min-w-0",
                  isProjectName ? "truncate" : "shrink-0 whitespace-nowrap",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}

      {action &&
        (action.logout ? (
          <button
            type="button"
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-[6px]"
          >
            <span className="text-18 font-medium whitespace-nowrap">
              {action.label}
            </span>
            <ChevronRight />
          </button>
        ) : (
          <Link to={action.href} className="flex items-center gap-[6px]">
            <span className="text-18 font-medium whitespace-nowrap">
              {action.label}
            </span>
            <ChevronRight />
          </Link>
        ))}
    </header>
  );
}

const HERO_HEIGHT = {
  md: "h-[350px]",
  sm: "h-[270px]",
};

const HERO_CONTENT_TOP = {
  md: { center: 71, left: 71 },
  sm: { center: 81, left: 82 },
};

const HERO_DESC_WEIGHT = {
  semibold: "font-semibold",
  medium: "font-medium",
  normal: "font-normal",
};

export function Hero({
  title,
  description,
  footer,
  decoration,
  size = "sm",
  align = "center",
  descriptionWeight,
  contentTop,
  className,
}) {
  const isCenter = align === "center";
  const top = contentTop ?? HERO_CONTENT_TOP[size][align];
  const weight = descriptionWeight ?? (isCenter ? "semibold" : "normal");

  return (
    <div
      className={cn(
        "relative w-full bg-[#f5f5f5]",
        HERO_HEIGHT[size],
        className,
      )}
    >
      {decoration}

      <div
        className={cn(
          "absolute flex flex-col gap-[40px] px-5 text-[#1c232b] sm:px-8 lg:px-0",
          isCenter
            ? "left-1/2 w-full -translate-x-1/2 items-center text-center lg:w-max"
            : "inset-x-0 mx-auto w-full max-w-[1460px] items-start",
        )}
        style={{ top }}
      >
        <div
          className={cn(
            "flex w-full flex-col",
            isCenter
              ? "items-center gap-[14px]"
              : "items-start gap-[14px] lg:w-[634px]",
          )}
        >
          <p className="text-28 font-bold sm:text-34 lg:text-48 lg:whitespace-nowrap">
            {title}
          </p>

          {description && (
            <p
              className={cn(
                isCenter
                  ? "text-16 sm:text-18 lg:text-20"
                  : "text-18 lg:text-20",
                HERO_DESC_WEIGHT[weight],
                "text-[#858894]",
              )}
            >
              {description}
            </p>
          )}
        </div>

        {footer}
      </div>
    </div>
  );
}

export function HeroLayout({
  header,
  hero,
  children,
  background = "bg-white",
  className,
}) {
  return (
    <div className={cn("min-h-svh w-full", background, className)}>
      {header}
      {hero}

      <div className="relative w-full">{children}</div>
    </div>
  );
}

const SOCIAL_ICONS = [
  {
    src: instagramIcon,
    label: "Instagram",
    href: "https://www.instagram.com/likelion_yu/?hl=en",
  },
  {
    src: githubIcon,
    label: "GitHub",
    href: "https://github.com/Likelion-YeungNam-Univ",
  },
];

export function Footer({ className }) {
  return (
    <footer className={cn("w-full bg-white", className)}>
      <div className="flex w-full items-start justify-between px-5 pt-[20px] pb-10 sm:px-8 lg:h-[174px] lg:px-[52px] lg:pb-0">
        <div className="flex w-[128px] flex-col gap-[12px]">
          <img
            src={likelionLogo}
            alt=""
            className="size-[70px] max-w-none shrink-0"
          />

          <span className="text-18 font-bold whitespace-nowrap text-[#a66822]">
            LIKELION YU
          </span>
        </div>

        <ul className="flex items-center gap-[16px] lg:pt-[25px]">
          {SOCIAL_ICONS.map((icon) => {
            const glyph = (
              <img
                src={icon.src}
                alt={icon.label}
                className="size-[24px] max-w-none"
              />
            );

            return (
              <li
                key={icon.label}
                className="flex size-[50px] shrink-0 items-center justify-center rounded-[30px] bg-white/10"
              >
                {icon.href ? (
                  <a
                    href={icon.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex size-full items-center justify-center"
                  >
                    {glyph}
                  </a>
                ) : (
                  glyph
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
