import express from 'express';
import morgan from 'morgan';
import PKG from "../package.json"
import calendarRoutes from "./routes/calendar.routes"
import authRoutes from "./routes/auth.routes"
import statsRoutes from "./routes/stats.routes"

const cors = require('cors')
const app = express();

app.set("pkg",PKG);

app.use(cors({origin:"*"}));
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
    res.json(app.get("pkg").name);
})

app.use("/api/calendar",calendarRoutes);
app.use("/api/login",authRoutes);
app.use("/api/stats", statsRoutes)

export default app;