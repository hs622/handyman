import { connection } from "next/server";
import { sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { services } from "@/db/schema";

export async function GET() {
  await connection(); // always run at request time

  try {
    const db = getDb();
    await db.execute(sql`select 1`);
    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(services);
    return Response.json({ status: "ok", db: "up", services: count });
  } catch (error) {
    console.error("health check failed", error);
    return Response.json({ status: "error", db: "down" }, { status: 503 });
  }
}
