import { Router, type IRouter } from "express";
import healthRouter from "./health";
import admissionsRouter from "./admissions";

const router: IRouter = Router();

router.use(healthRouter);
router.use(admissionsRouter);

export default router;
