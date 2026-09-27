import express from "express";
import logger from "./logger";

const app = express();
const PORT = process.env.HEALTH_PORT || 3000;

export default function healthCheck(client: CustomClient) {
  app.get("/health", (req, res) => {
    // Returns true/healthy only if the bot is fully connected to Discord API
    if (client.isReady()) {
      return res.status(200).json({
        status: "healthy",
        online: true,
        uptime: `${client.uptime/1000}s`,
      });
    }

    // Returns a 503 Service Unavailable if the HTTP server is up but bot is disconnected
    return res.status(503).json({
      status: "unhealthy",
      online: false,
    });
  });

  app.listen(PORT, () => {
    logger.log(`Health check server listening on port ${PORT}`);
  });
}
