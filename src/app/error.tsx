"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="page"><p className="eyebrow">Temporary error</p><h1 className="page-title">페이지를 불러오지 못했습니다.</h1><p className="page-intro">잠시 후 다시 시도해주세요. 관리자라면 데이터베이스 환경변수와 마이그레이션 상태를 확인해주세요.</p><button className="button primary" onClick={reset}>다시 시도</button></main>;
}
