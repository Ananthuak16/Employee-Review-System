import express from 'express';
const router = express.Router();

import * as reviewsController from '../controller/review_controller.js';

// like assignReview, submitReview, and updateReview

// Route to assign a review to a user with :id
router.post('/assign-review/:id', reviewsController.assignReview);

// Route to submit a review for a user with :id
router.post('/create/:id', reviewsController.submitReview);

// Route to update a review for a user with :id
router.post('/update-review/:id', reviewsController.updateReview);

export default router;
