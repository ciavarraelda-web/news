import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger per API
app.use((req, res, next) => {
  const start = Date.now();
  const originalResJson = res.json.bind(res);
  let capturedJson: any;

  res.json = (body: any) => {
    capturedJson = body;
    return originalResJson(body);
  };

  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      let logLine = `${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`;
      if (capturedJson) logLine += ` :: ${JSON.stringify(capturedJson).slice(0, 80)}…`;
      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Error handling
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Development: usa Vite
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // Production: serve frontend buildato
    const distPath = path.resolve(__dirname, "../client/dist");
    app.use(express.static(distPath));
    app.get("*", (_, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
    log(`Server running on port ${port}`);
  });
})();
