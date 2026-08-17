import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import githubIcon from "@/assets/icons/github.svg";
import instagramIcon from "@/assets/icons/instagram.svg";
import likelionLogo from "@/assets/likelion-logo.svg";
import { ChevronRight } from "@/components/icons";
import {
  DroppingChars,
  RisingBlock,
  RisingWords,
} from "@/components/motion";
import { buildNavItems, cn, PATHS, SERVICE_NAME } from "@/lib";
import { clearSession } from "@/session";

const TONE = {
  onLight: "text-[#1c232b]",
  onDark: "text-[#1c232b]",
};

const DEFAULT_ACTION = { label: "로그아웃", href: PATHS.WELCOME, logout: true };

export function Header({
  tone = "onLight",
  nav = false,
  action = DEFAULT_ACTION,
  className,
}) {
  const { projectId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const navItems = buildNavItems(projectId);

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
    navigate(PATHS.WELCOME, { replace: true });
  };

  const activeNavHref = resolveActiveNavHref(pathname, navItems);

  return (
    <header
      className={cn(
        "sticky top-0 z-100 flex h-[80px] w-full items-center justify-between border-b border-solid px-5 sm:px-8 lg:px-[52px] transition-all duration-300",
        isScrolled
          ? "border-[#e6e8ef] bg-white/80 shadow-[0_2px_12px_0_rgba(28,35,43,0.08)] backdrop-blur-md"
          : "border-[#f6f5fa] bg-white",
        TONE[tone],
        className,
      )}
    >
      <Link
        to={nav ? PATHS.PROJECTS : PATHS.WELCOME}
        className="text-18 font-semibold whitespace-nowrap transition-opacity duration-150 hover:opacity-70 sm:text-20 lg:text-24"
      >
        {SERVICE_NAME}
      </Link>

      {nav && (
        <nav className="text-16 absolute left-1/2 flex w-full max-w-[40%] -translate-x-1/2 items-center justify-center gap-[16px] sm:gap-[32px] font-medium">
          {navItems.map((item) => {
            const isActive = item.href === activeNavHref;

            return (
              <Link
                key={item.label}
                to={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative block min-w-0 transition-opacity duration-150 hover:opacity-70",
                  "after:absolute after:inset-x-0 after:-bottom-[6px] after:h-[2px] after:rounded-full after:bg-current after:transition-opacity after:duration-150",
                  isActive
                    ? "font-semibold after:opacity-100"
                    : "after:opacity-0",
                  "shrink-0 whitespace-nowrap",
                )}
              >
                <span className="block">{item.label}</span>
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
            className="flex cursor-pointer items-center gap-[6px] transition-opacity duration-150 hover:opacity-70"
          >
            <span className="text-18 font-medium whitespace-nowrap">
              {action.label}
            </span>
            <ChevronRight />
          </button>
        ) : (
          <Link
            to={action.href}
            className="flex items-center gap-[6px] transition-opacity duration-150 hover:opacity-70"
          >
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

const HERO_STEP = 22;

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

  const titleText = typeof title === "string" ? title : null;
  const descriptionText = typeof description === "string" ? description : null;

  const titleSpread = titleText ? (titleText.length - 1) * HERO_STEP : 0;
  const descriptionDelay = titleSpread + 200;

  const descriptionSpread = descriptionText
    ? (descriptionText.split(" ").length - 1) * HERO_STEP
    : 0;

  const footerDelay = descriptionDelay + descriptionSpread + 250;

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
          "absolute flex flex-col gap-[40px] px-5 text-[#1c232b] sm:px-8 lg:px-8",
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
            {titleText ? (
              <DroppingChars text={titleText} step={HERO_STEP} speed="fast" />
            ) : (
              <RisingBlock speed="fast">{title}</RisingBlock>
            )}
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
              {descriptionText ? (
                <RisingWords
                  text={descriptionText}
                  delay={descriptionDelay}
                  step={HERO_STEP}
                  speed="fast"
                />
              ) : (
                <RisingBlock delay={descriptionDelay}>{description}</RisingBlock>
              )}
            </p>
          )}
        </div>

        {footer && <RisingBlock delay={footerDelay}>{footer}</RisingBlock>}
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
                    className="flex size-full items-center justify-center transition-opacity duration-150 hover:opacity-70"
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
