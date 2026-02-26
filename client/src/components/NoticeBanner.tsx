import type { Notice } from "../types";

type NoticeBannerProps = {
  notice: Notice | null;
};

export default function NoticeBanner({ notice }: NoticeBannerProps) {
  if (!notice) return null;
  return <div className={`notice ${notice.type}`}>{notice.message}</div>;
}
