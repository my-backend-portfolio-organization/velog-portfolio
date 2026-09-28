import type { Appearance, Chapter, Post, Project } from "@/domain/content";

export const initialAppearance: Appearance = {
  siteTitle: "JINSU.DEV",
  ownerName: "김진수",
  headline: "복잡한 도메인을 단단한 시스템으로.",
  introduction: "복잡한 도메인을 명확한 모델과 안정적인 시스템으로 바꿉니다. 트래픽이 늘어도 예측 가능하고, 팀이 오래 유지보수할 수 있는 서버를 만듭니다.",
  accentColor: "#12b886",
  showSidebar: true,
};

export const initialChapters: Chapter[] = [
  { id: "chapter-spring", title: "Spring", slug: "spring", description: "트랜잭션과 애플리케이션 설계", sortOrder: 1, visible: true },
  { id: "chapter-database", title: "Database", slug: "database", description: "정합성, 동시성, 쿼리 튜닝", sortOrder: 2, visible: true },
  { id: "chapter-architecture", title: "Architecture", slug: "architecture", description: "분산 시스템과 메시징", sortOrder: 3, visible: true },
];

export const initialPosts: Post[] = [
  { id: "post-transaction", chapterId: "chapter-spring", title: "트랜잭션 경계는 어디까지 잡아야 할까", slug: "transaction-boundary", summary: "데이터 정합성과 외부 연동 사이에서 트랜잭션 범위를 정한 기준", content: "하나의 유스케이스가 지켜야 하는 불변식을 기준으로 트랜잭션을 묶었습니다. 외부 API 호출은 가능한 한 트랜잭션 밖으로 이동하고, 데이터 저장과 이벤트 발행 사이의 틈은 아웃박스 패턴으로 메웠습니다.", status: "PUBLISHED", updatedAt: "2026-04-18" },
  { id: "post-idempotency", chapterId: "chapter-architecture", title: "재시도에 안전한 API를 만드는 멱등성", slug: "idempotent-api", summary: "중복 요청을 감지하고 같은 결과를 반환하는 결제 API 설계", content: "클라이언트 타임아웃과 네트워크 재전송으로 같은 요청이 여러 번 도착할 수 있습니다. 요청 키와 처리 결과를 함께 보관하고 원자적 저장과 유니크 제약으로 중복 실행을 차단했습니다.", status: "PUBLISHED", updatedAt: "2026-03-02" },
  { id: "post-concurrency", chapterId: "chapter-database", title: "재고 차감에서 발생한 동시성 문제 해결기", slug: "concurrency-stock", summary: "비관적 락과 낙관적 락을 비교하고 부하 테스트로 선택을 검증", content: "조회와 저장 사이에 다른 요청이 값을 바꾸는 문제를 동시 요청 테스트로 재현했습니다. 충돌 빈도와 처리량을 측정해 낙관적 락과 제한된 재시도를 적용했습니다.", status: "PUBLISHED", updatedAt: "2026-01-21" },
];

export const projects: Project[] = [
  { id: "project-order", title: "Order Flow", slug: "order-flow", summary: "재고 정합성과 장애 복구를 고려한 주문 처리 플랫폼", stack: ["Java", "Spring Boot", "PostgreSQL"], accent: "#b2f2bb", period: "2026.01 — 2026.04" },
  { id: "project-pay", title: "Pay Core", slug: "pay-core", summary: "멱등성과 감사 로그를 갖춘 간편 결제 백엔드", stack: ["Spring Boot", "Redis", "Kafka"], accent: "#a5d8ff", period: "2025.08 — 2025.11" },
  { id: "project-event", title: "Event Bridge", slug: "event-bridge", summary: "실패 격리와 관측성을 갖춘 비동기 알림 서비스", stack: ["Kotlin", "RabbitMQ", "Docker"], accent: "#ffd8a8", period: "2025.03 — 2025.06" },
];
