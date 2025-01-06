import { Router, type Request, type Response } from "express";
import db from "@/services/db";
import { success } from "@/utils/response";

type NandoNodeData = {
  node_id: number;
  gateway_id: number;

  temperature: number;
  humidity: number;
  lux: number;
  tips: number;

  raw: string; // on base64 -> bytes

  snr: number;
  rssi: number;
};

const router = Router();

router.post(
  "/gateway",
  async (req: Request<{}, {}, NandoNodeData>, res: Response) => {
    const {
      node_id,
      gateway_id,
      temperature,
      humidity,
      lux,
      tips,
      raw,
      snr,
      rssi,
    } = req.body;

    const gateway = await db.nandoNode.create({
      data: {
        node_id,
        gateway_id,
        temperature,
        humidity,
        lux,
        tips,
        snr,
        rssi,
        raw: Buffer.from(raw, "base64"),
      },
    });

    return success(res, "Gateway data saved");
  }
);

router.get("/gateway", async (req: Request, res: Response) => {
  const gateways = await db.nandoNode.findMany();

  return success(res, "Gateway data fetched", gateways);
});

router.get("/gateway/:node_id", async (req: Request, res: Response) => {
  const { node_id } = req.params;
  const gateways = await db.nandoNode.findMany({
    where: {
      node_id: parseInt(node_id),
    },
  });

  return success(res, "Gateway data fetched", gateways);
});

router.get("/gateway/latest", async (req: Request, res: Response) => {
  const gateways = await db.nandoNode.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  return success(res, "Gateway data fetched", gateways);
});

router.get("/gateway/latest/:node_id", async (req: Request, res: Response) => {
  const { node_id } = req.params;
  const gateways = await db.nandoNode.findFirst({
    where: {
      node_id: parseInt(node_id),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return success(res, "Gateway data fetched", gateways);
});

export default router;
