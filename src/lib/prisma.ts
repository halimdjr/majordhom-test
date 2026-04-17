import "dotenv/config"; // Charge les variables d'environnement depuis .env (ex: DATABASE_URL)
import { PrismaClient } from "@/generated/prisma/client"; // Client généré par Prisma 7 dans src/generated/
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"; // Adapter obligatoire en Prisma 7 pour SQLite

// URL de la base de données
const connectionString = process.env.DATABASE_URL || "file:./prisma/dev.db";

// on passe un objet { url } à l'adapter
const adapter = new PrismaBetterSqlite3({ url: connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};


export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });


if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}