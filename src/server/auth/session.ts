import "server-only";

import { cookies } from "next/headers";
import { PortfolioApiError, portfolioApi } from "@/server/portfolio/client";

const COOKIE_NAME = "portfolio-admin-token";

export async function authenticateAdmin(password: string) {
  const { accessToken, expiresIn } = await portfolioApi.login(password);
  (await cookies()).set(COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: expiresIn,
    path: "/",
    priority: "high",
  });
}

export async function verifyAdminSession() {
  const token = await getAdminToken();
  if (!token) return false;
  try {
    return (await portfolioApi.verifyAdmin(token)).authenticated;
  } catch (error) {
    if (error instanceof PortfolioApiError && error.status === 401) return false;
    throw error;
  }
}

export async function getAdminToken() {
  return (await cookies()).get(COOKIE_NAME)?.value ?? null;
}

export async function requireAdminToken() {
  const token = await getAdminToken();
  if (!token) throw new Error("Unauthorized");
  try {
    await portfolioApi.verifyAdmin(token);
    return token;
  } catch (error) {
    if (error instanceof PortfolioApiError && error.status === 401) throw new Error("Unauthorized");
    throw error;
  }
}

export async function deleteAdminSession() {
  (await cookies()).delete(COOKIE_NAME);
}
