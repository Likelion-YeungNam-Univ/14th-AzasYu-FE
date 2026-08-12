/**
 * 화면 전반에서 공유하는 상수.
 * 컴포넌트 파일에서 같이 export하면 Fast Refresh가 깨져 별도 파일로 둔다.
 */
import { PATHS, projectPath } from '@/routes/paths'

/** Figma 헤더 로고 텍스트 */
export const SERVICE_NAME = '이해했습니다! (아님)'

/**
 * 시안에 적혀 있는 프로젝트명("신규 서비스 기획").
 *
 * **메뉴 라벨이 아니라 데이터다.** Desktop - 11에서 이 문자열이 헤더 nav와 히어로 제목에
 * 두 번 나오고, Desktop - 29에서는 프로젝트 카드의 제목으로 나온다.
 * 프로젝트명이 "앱 개선 프로젝트"면 nav에도 그렇게 찍힌다.
 *
 * 서버 연동은 범위 밖이라(§ 1) 실제 이름이 없을 때 쓰는 더미다.
 * API가 붙으면 페이지가 Header에 projectName으로 넘겨주면 된다.
 */
export const SAMPLE_PROJECT_NAME = '신규 서비스 기획'

export interface NavItem {
  label: string
  href: string
}

/**
 * 상단 nav 항목. **현재 프로젝트가 있느냐에 따라 항목 수가 달라진다.**
 *
 *   프로젝트 안 (/projects/:projectId/…)  홈 · {프로젝트명} · 지난 회의 · 프로젝트 설정
 *   프로젝트 밖 (/projects, /meetings)    홈 · 지난 회의
 *
 * 시안에는 `Desktop - 29`(프로젝트 목록)·`37`(지난 회의) 헤더에도 "신규 서비스 기획"과
 * "프로젝트 설정"이 그대로 박혀 있다. 하지만 두 화면은 특정 프로젝트에 속하지 않아
 * projectId를 만들 수 없으므로 링크가 성립하지 않는다. 디자이너가 헤더를 복사해 붙인
 * 것으로 보고 프로젝트 밖에서는 두 항목을 숨긴다. **시안과 의도적으로 다른 부분이다.**
 */
export function buildNavItems(
  projectId?: string,
  projectName: string = SAMPLE_PROJECT_NAME,
): NavItem[] {
  const items: NavItem[] = [{ label: '홈', href: PATHS.PROJECTS }]

  if (projectId) {
    items.push({ label: projectName, href: projectPath('DETAIL', projectId) })
  }

  items.push({ label: '지난 회의', href: PATHS.MEETINGS })

  if (projectId) {
    items.push({
      label: '프로젝트 설정',
      href: projectPath('SETTINGS', projectId),
    })
  }

  return items
}

/**
 * 히어로(670px) 위로 카드를 top-401px에 올리기 위한 겹침 값.
 * 670 - 401 = 269
 */
export const HERO_CARD_OVERLAP = 269
