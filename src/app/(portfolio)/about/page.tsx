import { portfolioApi } from "@/server/portfolio/client";

export default async function AboutPage() {
  const { appearance } = await portfolioApi.getPublicSnapshot();
  return <div className="page about-layout"><section className="about-sticky"><p className="eyebrow">About me</p><h1 className="page-title">안녕하세요,<br />{appearance.ownerName}입니다.</h1><p className="about-quote">“안정적인 시스템은 실패를 미리 상상한 결과라고 믿습니다.”</p></section><section><p className="page-intro">{appearance.introduction}</p><div className="timeline"><article className="timeline-item"><time>NOW</time><h3>도메인과 인프라의 접점</h3><p>Spring 기반 도메인 모델링, 데이터 정합성, 메시징과 관측성을 탐구합니다.</p></article><article className="timeline-item"><time>PRINCIPLE</time><h3>결정을 기록합니다</h3><p>선택의 근거와 포기한 대안을 남겨 다음 판단의 비용을 줄입니다.</p></article></div></section></div>;
}
