import { PrismaClient } from "@prisma/client";
import ENV from "@/utils/env";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      ENV.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["info", "warn", "error"],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
