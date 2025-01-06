import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import ENV from "@/utils/env";
import { notFound, internalServerError } from "@/utils/response";

import RicatRoute from "@/routes/ricat";
import NandoRoute from "@/routes/nando";

const app = express();
app.use(express.json());
app.use(cors());

// [Routes]
app.use("/ricat", RicatRoute);
app.use("/nando", NandoRoute);

// [Global 404]
app.all("/*path", (_req: Request, res: Response) => {
  return notFound(res, "Route not found");
});

// [Global Error Handler]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  return internalServerError(res);
});

app.listen(ENV.APP_PORT, () => {
  console.log(`Server running on ${ENV.APP_FQDN}`);
});
