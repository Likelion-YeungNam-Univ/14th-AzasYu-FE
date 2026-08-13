import { Link } from 'react-router'
import { PATHS } from '@/routes/paths'

/*
 * 없는 경로로 들어왔을 때 보여주는 화면.
 *
 * **대응하는 Figma 시안이 없다.** 그래서 디자인을 지어내지 않고, 이 프로젝트가 이미 쓰는
 * 타이포·색만으로 최소한의 안내와 돌아갈 링크만 둔다 (§ 1). 시안이 나오면 교체할 것.
 */
export function NotFoundPage() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-4 bg-white px-5 text-center">
      <p className="text-28 font-semibold text-black">
        페이지를 찾을 수 없습니다
      </p>
      <p className="text-16 font-medium text-[#717171]">
        주소가 바뀌었거나 삭제된 페이지일 수 있어요.
      </p>
      <Link
        to={PATHS.PROJECTS}
        className="text-18 mt-2 font-medium text-[#606060] underline underline-offset-4"
      >
        홈으로 가기
      </Link>
    </div>
  )
}
