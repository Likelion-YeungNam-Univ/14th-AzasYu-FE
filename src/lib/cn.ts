type ClassValue = string | false | null | undefined

/** 조건부 className을 합친다. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
