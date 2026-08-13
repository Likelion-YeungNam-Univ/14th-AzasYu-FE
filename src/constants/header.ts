import type { HeaderProps } from '@/components/layout/Header'
import { PATHS } from '@/routes/paths'

/**
 * 화면별로 반복해서 쓰는 헤더 조합. 페이지에서 tone/nav/action을 매번 적지 않게 한다.
 * Figma 화면 번호와 1:1로 대응한다 (Header.tsx 주석의 표 참고).
 *
 * Header.tsx가 아니라 여기 두는 이유: 컴포넌트 파일에서 상수를 같이 export하면
 * oxlint가 Fast Refresh 경고를 낸다 (§ 3-3).
 */
export const HEADER_PRESETS = {
  /** 로그인 후 + 히어로가 y=0이라 헤더가 히어로 위에 겹침 (11, 30, 31, 33, 35) */
  appOnHero: { tone: 'onHero', nav: true },
  /** 로그인 후 + 히어로가 y=80이라 헤더는 흰 배경 위 (29, 34, 36, 41) */
  appOnLight: { tone: 'onLight', nav: true },
  /**
   * 로그인 후 + **히어로가 아예 없는** 화면 (58 분석 로딩).
   * appOnLight와 같은 흰 배경인데 글자색이 `#717171`이 아니라 **검정**이다.
   * 히어로 없는 화면이 58 하나뿐이라 디자이너 편차일 수 있지만 시안을 따랐다.
   */
  appOnWhite: { tone: 'onDark', nav: true },
  /**
   * 가입/로그인 계열 — nav 없이 "홈"만, 검정 글씨 (8, 39, 40, 26, 27, 28).
   * 여기서 "홈"은 로그인 전 홈(랜딩)이다. 로그인 후 홈은 /projects다.
   */
  auth: {
    tone: 'onDark',
    nav: false,
    action: { label: '홈', href: PATHS.WELCOME },
  },
  /**
   * 로그인 후인데 nav가 없는 화면 (40 프로젝트 생성 완료).
   * 생김새는 auth와 같지만 "홈"이 로그인 후 홈(/projects)을 가리킨다.
   */
  authApp: {
    tone: 'onDark',
    nav: false,
    action: { label: '홈', href: PATHS.PROJECTS },
  },
  /** 랜딩 — nav 없이 "회원가입", 히어로 위 흰 글씨 (25) */
  landing: {
    tone: 'onHero',
    nav: false,
    action: { label: '회원가입', href: PATHS.SIGNUP },
  },
} satisfies Record<string, Omit<HeaderProps, 'className'>>
