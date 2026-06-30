import { Router, type IRouter } from "express";
import healthRouter from "./health";
import admissionsRouter from "./admissions";
import modelImageRouter from "./modelImage";
import programsRouter from "./programs";
import facultyRouter from "./faculty";
import newsRouter from "./news";
import adminRouter from "./admin";
import galleryRouter from "./gallery";
import sliderRouter from "./slider";
import contactRouter from "./contact";
import noticeRouter from "./notice";

const router: IRouter = Router();
router.use(healthRouter);
router.use(admissionsRouter);
router.use(modelImageRouter);
router.use(programsRouter);
router.use(facultyRouter);
router.use(newsRouter);
router.use(adminRouter);
router.use("/gallery", galleryRouter);
router.use(sliderRouter);
router.use(contactRouter);
router.use(noticeRouter);

export default router;
