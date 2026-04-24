  import express from "express";
  import cors from "cors";
  import connectDB from "./db/db.js";

  import authRoutes from "./routes/auth.js";

  import salesRoutes from "./routes/sales.js";
  import productionRoutes from "./routes/production.js";
  import leadRoutes from "./routes/leadsroutes.js";
  import activityRoutes from "./routes/activityroutes.js";
  import targetRoutes from "./routes/targetRoutes.js";
  import adminRoutes from "./routes/admin.js";
  import projectRoutes from "./routes/projectRoutes.js";
  import fileroutes from "./routes/fileroutes.js";


  connectDB();

  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/sales", salesRoutes);
  app.use("/api/production", productionRoutes);
  app.use("/api/activities", activityRoutes);
  app.use("/api/targets", targetRoutes);
  app.use("/api/leads", leadRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/files", fileroutes);

  if (process.env.NODE_ENV !== "production") {
    app.listen(5000, () => {
      console.log("Server running on port 5000 🚀");
    });
  }

  app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
  });



  export default app;