import express from "express"
import cors from "cors"
import {limit} from "./constants.js"
import router from "./routes/job.routes.js";

const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json());

app.use("/api/v1/jobs", router);

app.use("/api/v1/",router)
app.use(express.json({limit:limit}))



export default app