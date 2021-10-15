import controller from '../controller/controller';
import { Router } from 'express';

const router = Router();

router.get('/:id/currently_reading', controller.getCurrentlyReading);
router.get('/:id/finished_reading', controller.getFinishedReading);
router.get('/:id/daily_reads', controller.getDailyReads);

router.post('/:id/book/title', controller.postTitle);
router.post('/:id/book/author', controller.postAuthor);
router.post('/:id/book/book_format', controller.postBookFormat);
router.post('/:id/book/total_pages', controller.postTotalPages);
router.post('/:id/book/published_date', controller.postPublishedDate);
router.post('/:id/book/edition_date', controller.postEditionDate);
router.post('/:id/book/picture_url', controller.postPictureUrl);
router.post('/:id/book/blurb', controller.postBlurb);


export default router;