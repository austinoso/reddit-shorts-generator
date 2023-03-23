import { Router } from "express";
import { process } from "../controllers/generateVideo.controller.js";

const videoRouter = Router();

videoRouter.post("/generate", process);

export default videoRouter;
