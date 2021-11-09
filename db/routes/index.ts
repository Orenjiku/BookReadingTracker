import controller from '../controller/controller';
import { Router } from 'express';

const router = Router();

router.get('/:id/currently_reading', controller.getCurrentlyReading);
router.get('/:id/finished_reading', controller.getFinishedReading);
router.get('/:id/daily_reads', controller.getDailyReads);

router.post('/:id/book/author', controller.postAuthor);
router.post('/:id/book/read_instance', controller.postReadInstance);
router.post('/:id/book/read_entry', controller.postReadEntry);

router.put('/:id/book/title', controller.putTitle);
router.put('/:id/book/book_format', controller.putBookFormat);
router.put('/:id/book/total_pages', controller.putTotalPages);
router.put('/:id/book/published_date', controller.putPublishedDate);
router.put('/:id/book/edition_date', controller.putEditionDate);
router.put('/:id/book/book_cover_url', controller.putBookCoverUrl);
router.put('/:id/book/blurb', controller.putBlurb);

router.delete('/:id/book/author', controller.deleteAuthor);
router.delete('/:id/book/read_instance', controller.deleteReadInstance);
router.delete('/:id/book/read_entry', controller.deleteReadEntry);

export default router;