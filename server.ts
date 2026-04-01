import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { config } from "./src/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "lumiere-beauty-secret-2026";

const app = express();
app.use(express.json());

// Admin Auth API
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  const adminPassword = config.adminPassword;

  if (password === adminPassword) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("admin_session", token, {
        httpOnly: true,
        secure: true, // Required for SameSite=None
        sameSite: "none", // Required for cross-origin iframe
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })
    );
    return res.json({ success: true });
  }

  res.status(401).json({ success: false, message: "Invalid password" });
});

app.get("/api/admin/check", (req, res) => {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.admin_session;

  if (!token) {
    return res.json({ authenticated: false });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return res.json({ authenticated: true });
  } catch (err) {
    res.json({ authenticated: false });
  }
});

app.post("/api/admin/logout", (req, res) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("admin_session", "", {
      maxAge: 0,
      path: "/",
    })
  );
  res.json({ success: true });
});

async function setupServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

// Start server only if run directly (not as a module for Vercel)
if (import.meta.url === `file://${process.argv[1]}` || process.env.NODE_ENV !== "production") {
  setupServer().then(() => {
    const PORT = 3001;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

export default app;
