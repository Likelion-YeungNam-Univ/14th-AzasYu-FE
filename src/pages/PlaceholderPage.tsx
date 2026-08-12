import { useLocation } from 'react-router'

/*
 * 아직 구현하지 않은 화면 자리. 라우트 트리를 먼저 깔아두고 화면을 하나씩 채운다.
 *
 * 여기에 디자인을 지어내지 않는다 (§ 1). Figma 화면 이름과 node ID만 보여주고,
 * 시안이 아직 없는 화면은 그 사실을 그대로 적는다.
 */
interface PlaceholderPageProps {
  /** 화면 이름 (한글) */
  title: string
  /** Figma 화면 이름. 시안이 있고 아직 구현만 안 한 경우 */
  figma?: string
  /** Figma node ID */
  nodeId?: string
  /** 라우트는 필요한데 대응 Figma 시안이 아예 없는 경우 (예: 프로젝트 설정) */
  designMissing?: boolean
}

export function PlaceholderPage({
  title,
  figma,
  nodeId,
  designMissing,
}: PlaceholderPageProps) {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-3 bg-white px-5 text-center">
      <p className="text-28 font-semibold text-black">{title}</p>
      <p className="text-16 font-medium text-[#717171]">{pathname}</p>
      {figma && (
        <p className="text-14 font-medium text-[#9d9d9d]">
          Figma {figma}
          {nodeId ? ` (node ${nodeId})` : ''} — 아직 구현하지 않음
        </p>
      )}
      {designMissing && (
        <p className="text-14 font-medium text-[#da1e51]">
          Figma 시안 없음 — 디자이너 확인 필요
        </p>
      )}
    </div>
  )
}
