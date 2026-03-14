import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { interviewController, interviewReportById, getAllInterviewReport, generateResumePdf } from '../controllers/interview.controller.js';
import { upload } from '../middleware/file.middleware.js';

export const interviewRoute = express.Router();

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description, resume pdf and job description
 * @access private
 */

interviewRoute.post("/", authMiddleware, upload.single("resume"), interviewController);


/**
 * @route GET /api/interview/report/:id
 * @description get interview report by id.
 * @access private
 */

interviewRoute.get("/report/:id", authMiddleware, interviewReportById);

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */

interviewRoute.get("/", authMiddleware, getAllInterviewReport);

/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */

interviewRoute.post("/resume/pdf/:interviewId", authMiddleware, generateResumePdf);