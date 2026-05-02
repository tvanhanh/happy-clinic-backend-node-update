import express from "express";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db";
import cors from "cors";
import auth_routes from "./routes/auth_routes";
import appointments_routes from "./routes/appointment_routes";
import doctor_routes from "./routes/doctor_routes";



dotenv.config();
connectDB()
  .then(() => console.log("DB connected"))
  .catch((err) => console.error(err));
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Server is running!");
  });
  
  app.use("/auth", auth_routes);
  app.use("/appointments", appointments_routes);
  app.use("/doctors", doctor_routes);
 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export { app };