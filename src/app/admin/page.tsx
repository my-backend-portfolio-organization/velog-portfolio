import { redirect } from "next/navigation";
import { AdminApp } from "@/features/admin/admin-app";
import { getAdminToken, verifyAdminSession } from "@/server/auth/session";
import { portfolioApi } from "@/server/portfolio/client";

export default async function AdminPage() {
  if (!(await verifyAdminSession())) redirect("/admin/login");
  const token = await getAdminToken();
  if (!token) redirect("/admin/login");
  const snapshot = await portfolioApi.getAdminSnapshot(token);
  return <AdminApp snapshot={snapshot} />;
}
