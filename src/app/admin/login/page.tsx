import { redirect } from "next/navigation";
import { LoginForm } from "@/features/admin/login-form";
import { verifyAdminSession } from "@/server/auth/session";

export default async function LoginPage() {
  if (await verifyAdminSession()) redirect("/admin");
  return <main className="login-page"><LoginForm showDevelopmentHint={process.env.NODE_ENV === "development"} /></main>;
}
