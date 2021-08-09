import controller from './controller';
import express from 'express';

const router = express.Router();

router.get('/:id/currently_reading', controller.getCurrentlyReading);
router.get('/:id/finished_reading', controller.getFinishedReading);
router.get('/:id/daily_reads', controller.getDailyReads);

export default router;