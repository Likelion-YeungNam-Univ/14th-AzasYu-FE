import { Link } from 'react-router'
import { cn } from '@/lib/cn'
import { projectPath } from '@/routes/paths'

/*
 * 프로젝트 카드. Figma node `1:588` — Desktop-29 내 프로젝트.
 *
 * **썸네일 박스는 빈 프레임이다.** 채우기만 있고 안에 아무것도 없다.
 * 나중에 프로젝트 대표 이미지가 들어갈 자리로 보이지만 시안에 없으므로
 * 지어내지 않고 색 박스 그대로 둔다 (§ 1).
 *
 *   썸네일   470x275 / bg #d1d1d1 / rounded-14
 *   참여자   18px Medium #999
 *   제목     24px SemiBold 검정
 *   날짜     18px Medium **#d1d1d1**  ← 썸네일과 같은 색이라 매우 흐리다. 시안 그대로다
 *
 * 세로 간격은 Figma 절대 y좌표에서 역산했다 (행높이 1.4 기준).
 *   썸네일 bottom 900 → 참여자 922        gap 22
 *   참여자 bottom 947.2 → 제목 951        gap 3.8
 *   제목   bottom 984.6 → 날짜 1014       gap 29.4
 * 카드 전체 높이 = 275 + 22 + 25.2 + 3.8 + 33.6 + 29.4 + 25.2 = **414.2**
 * (Figma 행 간격 484 = 414.2 + 69.8 → 그리드 gap-y가 69.8이 된다)
 *
 * lg에서 그리드 컬럼 폭이 정확히 470이므로 `aspect-[470/275]`가 275를 만든다.
 * 좁은 화면에서는 컬럼이 줄어도 비율이 유지된다.
 */
export interface Project {
  id: string
  name: string
  /** "이지혜 외 5명" — 참여자 요약 문자열 */
  participants: string
  /** "2026. 08. 09" */
  date: string
}

interface ProjectCardProps {
  project: Project
  className?: string
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Link
      to={projectPath('DETAIL', project.id)}
      className={cn('flex flex-col', className)}
    >
      <div className="aspect-[470/275] w-full rounded-[14px] bg-[#d1d1d1]" />

      <p className="text-18 mt-[22px] font-medium text-[#999]">
        {project.participants}
      </p>
      <p className="text-24 mt-[3.8px] font-semibold text-black">
        {project.name}
      </p>
      <p className="text-18 mt-[29.4px] font-medium text-[#d1d1d1]">
        {project.date}
      </p>
    </Link>
  )
}
