import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib";

const DROP_ANIMATION = {
  normal: "animate-drop-in",
  fast: "animate-drop-in-fast",
};

const RISE_ANIMATION = {
  normal: "animate-rise-in",
  fast: "animate-rise-in-fast",
};

export function DroppingChars({
  text,
  delay = 0,
  step = 45,
  speed = "normal",
  paused = false,
}) {
  return [...text].map((char, index) => (
    <span
      key={`${char}-${index}`}
      className={cn("inline-block whitespace-pre", DROP_ANIMATION[speed])}
      style={{
        animationDelay: `${delay + index * step}ms`,
        animationPlayState: paused ? "paused" : "running",
      }}
    >
      {char}
    </span>
  ));
}

export function RisingWords({
  text,
  delay = 0,
  step = 70,
  speed = "normal",
  paused = false,
}) {
  const words = text.split(" ");

  return words.map((word, index) => (
    <span
      key={`${word}-${index}`}
      className={cn("inline-block whitespace-pre", RISE_ANIMATION[speed])}
      style={{
        animationDelay: `${delay + index * step}ms`,
        animationPlayState: paused ? "paused" : "running",
      }}
    >
      {index === words.length - 1 ? word : `${word} `}
    </span>
  ));
}

export function RisingBlock({ children, delay = 0, speed = "fast", className }) {
  return (
    <span
      className={cn("block", RISE_ANIMATION[speed], className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </span>
  );
}

export function RevealOnScroll({ children, delay = 0, after = 0, className }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const [wait, setWait] = useState(delay);
  const mountedAtRef = useRef(0);

  if (mountedAtRef.current === 0) {
    mountedAtRef.current = performance.now();
  }

  useEffect(() => {
    const target = ref.current;

    if (!target) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const elapsed = performance.now() - mountedAtRef.current;

        setWait(Math.max(0, after - elapsed) + delay);
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(target);

    const fallback = window.setTimeout(() => {
      const box = target.getBoundingClientRect();

      if (box.top >= window.innerHeight || box.bottom <= 0) return;

      setWait(Math.max(0, after - (performance.now() - mountedAtRef.current)) + delay);
      setShown(true);
      observer.disconnect();
    }, 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [after, delay]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${wait}ms` : "0ms" }}
      className={cn(
        "transition-[opacity,translate] duration-[600ms] ease-out",
        shown ? "translate-y-0 opacity-100" : "translate-y-[36px] opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
