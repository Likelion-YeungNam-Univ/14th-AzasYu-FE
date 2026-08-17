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
