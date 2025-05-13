import express, { Request, Response, NextFunction } from "express";
import { setupVite, serveStatic, log } from "./vite";
import { registerRoutes } from "./routes";

async function createServer() {
  const app = express();
  
  // إعداد الميدلوير الأساسي
  app.use(express.json());
  
  // تسجيل المسارات
  const server = await registerRoutes(app);
  
  // إعداد Vite (في بيئة التطوير فقط)
  await setupVite(app, server);
  
  // تقديم الملفات الثابتة (في بيئة الإنتاج فقط)
  serveStatic(app);
  
  // التعامل مع الأخطاء
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  // بدء الخادم
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    log(`Server running on port ${PORT}`);
  });

  return { app, server };
}

createServer();

export default createServer;
