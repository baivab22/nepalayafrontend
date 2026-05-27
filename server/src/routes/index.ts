import { Router, type IRouter } from "express";
import healthRouter from "./health";
import admissionsRouter from "./admissions";
import modelImageRouter from "./modelImage";
import programsRouter from "./programs";
import facultyRouter from "./faculty";
import newsRouter from "./news";
import adminRouter from "./admin";

const router: IRouter = Router();
router.use(healthRouter);
router.use(admissionsRouter);
router.use(modelImageRouter);
router.use(programsRouter);
router.use(facultyRouter);
router.use(newsRouter);
router.use(adminRouter);

export default router;
