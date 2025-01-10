import { Router, type Request, type Response } from "express";
import db from "@/services/db";
import { success } from "@/utils/response";
import admin from "firebase-admin";
import firebase_service_key from "../../json/firebase_service_key.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: firebase_service_key.client_email,
      privateKey: firebase_service_key.private_key,
      projectId: firebase_service_key.project_id,
    }),
  });
}

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
        receivedAt: new Date(receivedAt),
        beforeAPIHit: new Date(beforeAPIHit),
      },
    });

    const tokens = [
      "c6SxJOfi95ic8fih4KI5YO:APA91bGsfbJnZOqYtw29doR8Ivx4vGRW88VmuU321MHrI9DG0BTFbSV8C--nJeDp_HLlBhZe16gMH89Y9bZRAL3gU_j0nF9H0VZcb7w88I6Wh6b35ZQPVxU", //
      "emTJp4HOW9Df9i4TMX-k5M:APA91bG_WUqcJy276WeSZyoMRjQAhMwkuU3x13B_XkeNsPQzFQVNGHhH_tQtNHLDk0XWF2Ez0z0wJgSKXAVKMGCH7smHei4nzFzFO86Wu8OiLcT-h_DAW00", //
    ];

    const beforeSendNotification = new Date().toISOString();
    await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title: "Node Alert",
        body: `Node ${node_id} is at longitude: ${longitude}, latitude: ${latitude}`,
      },
    });
    const afterSendNotification = new Date().toISOString();

    const backendDebug = await db.backendDebug.create({
      data: {
        node_id,
        latitude,
        longitude,
        rssi,
        snr,
        before_send_notification: beforeSendNotification,
        after_send_notification: afterSendNotification,
      },
    });

    return success(res, "Notification sent successfully");
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
        before_gps_setup_epoch: new Date(before_gps_setup_epoch),
        data_gps_ready_epoch: new Date(data_gps_ready_epoch),
        before_send_epoch: new Date(before_send_epoch),
        after_send_epoch: new Date(after_send_epoch),
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
