require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set.");
  }

  const prisma = new PrismaClient();

  try {
    const result = await prisma.$queryRaw`SELECT 1 as ok`;
    console.log("Prisma DB connection successful:", result);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Prisma DB connection failed.");
  console.error(message);

  if (message.includes("P1001") || message.includes("Can't reach database server")) {
    console.error("Hint: Network path failed. Prefer Supabase pooler URL on port 6543 and test from another network/hotspot.");
  }

  if (message.includes("Tenant or user not found")) {
    console.error(
      "Hint: Pooler host is reachable, but project-ref/username is incorrect. Use exact Supabase Dashboard > Database > Connection string (Transaction mode).",
    );
  }

  process.exit(1);
});
