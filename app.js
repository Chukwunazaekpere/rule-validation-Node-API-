import express from "express";
import dotenv from "dotenv";

import apiRouter from "./api/Routes/routeResource.js";
dotenv.config({ path: "./api/config/config.env" })

const app = express();

app.use(express.json())
app.use(apiRouter)





const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server started and running at port: ${PORT}`))