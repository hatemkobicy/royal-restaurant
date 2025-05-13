// server/vite.ts
import type { Express } from "express";
import type { Server } from "http";
import path from "path";
import fs from "fs";

export function log(message: string, source = "express") {
  console.log(`${new Date().toLocaleTimeString()} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  if (process.env.NODE_ENV !== "production") {
    // فقط استيراد vite في بيئة التطوير
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
      base: "/",
    });

    app.use(vite.middlewares);
    log("Vite dev server initialized", "vite");

    return { vite };
  }
  
  return { vite: null };
}

export function serveStatic(app: Express) {
  if (process.env.NODE_ENV === "production") {
    const clientDistPath = path.resolve("./dist/client");
    
    if (fs.existsSync(clientDistPath)) {
      app.use(
        "/",
        require("express").static(clientDistPath, { index: false })
      );
      app.get("*", (req, res, next) => {
        // التعامل مع طلبات API
        if (req.path.startsWith("/api")) return next();
        
        // تقديم index.html لجميع الطلبات الأخرى
        res.sendFile(path.join(clientDistPath, "index.html"));
      });
      log("Serving static files from ./dist/client");
    } else {
      log("Warning: ./dist/client not found. Static files won't be served.");
    }
  }
}
