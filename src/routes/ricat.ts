import { Router, type Request, type Response } from "express";
import db from "@/services/db";
import { success } from "@/utils/response";

type GatewayData = {
  node_id: number;
  latitude: number;
  longitude: number;
  rssi: number;
  snr: number;
  receivedAt: number;
  beforeAPIHit: number;
};

type NodeDebugData = {
  node_id: number;
  before_wifi_ntp_millis: number;
  after_wifi_ntp_millis: number;

  before_gps_setup_epoch: number;
  data_gps_ready_epoch: number;
  before_send_epoch: number;
  after_send_epoch: number;
};

const router = Router();

router.post(
  "/gateway",
  async (req: Request<{}, {}, GatewayData>, res: Response) => {
    const {
      node_id,
      latitude,
      longitude,
      rssi,
      snr,
      receivedAt,
      beforeAPIHit,
    } = req.body;

    const gateway = await db.ricatGateway.create({
      data: {
        node_id,
        latitude,
        longitude,
        rssi,
        snr,
        receivedAt: new Date(receivedAt * 1000),
        beforeAPIHit: new Date(beforeAPIHit * 1000),
      },
    });

    return success(res, "Gateway data saved");
  }
);

router.get("/gateway", async (req: Request, res: Response) => {
  const gateways = await db.ricatGateway.findMany();

  return success(res, "Gateway data fetched", gateways);
});

router.get("/gateway/latest", async (req: Request, res: Response) => {
  const gateways = await db.ricatGateway.findFirst({
    orderBy: { createdAt: "desc" },
  });

  return success(res, "Gateway data fetched", gateways);
});

router.post(
  "/node",
  async (req: Request<{}, {}, NodeDebugData>, res: Response) => {
    const {
      node_id,
      before_wifi_ntp_millis,
      after_wifi_ntp_millis,
      before_gps_setup_epoch,
      data_gps_ready_epoch,
      before_send_epoch,
      after_send_epoch,
    } = req.body;

    const node = await db.ricatNodeDebug.create({
      data: {
        node_id,
        before_wifi_ntp_millis,
        after_wifi_ntp_millis,
        before_gps_setup_epoch: new Date(before_gps_setup_epoch * 1000),
        data_gps_ready_epoch: new Date(data_gps_ready_epoch * 1000),
        before_send_epoch: new Date(before_send_epoch * 1000),
        after_send_epoch: new Date(after_send_epoch * 1000),
      },
    });

    return success(res, "Node data saved");
  }
);

router.get("/node", async (req: Request, res: Response) => {
  const nodes = await db.ricatNodeDebug.findMany();

  return success(res, "Node data fetched", nodes);
});

router.get("/node/latest", async (req: Request, res: Response) => {
  const nodes = await db.ricatNodeDebug.findFirst({
    orderBy: { createdAt: "desc" },
  });

  return success(res, "Node data fetched", nodes);
});

export default router;
