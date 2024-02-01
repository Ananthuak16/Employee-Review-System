import User from '../../user/model/Userschema.js';
import Review from '../model/reviewSchema.js';

// Assign a review
export const assignReview = async (req, res) => {
  const { recipient_email } = req.body;
  try {
    if (req.isAuthenticated()) {
      // Find the reviewer and recipient based on user IDs and email
      const reviewer = await User.findById(req.params.id);
      const recipient = await User.findOne({ email: recipient_email });

      // Check if the review is already assigned
      const alreadyAssigned = reviewer.assignedReviews.some(userId => userId.equals(recipient.id));

      // If already assigned, prevent assigning a duplicate review
      if (alreadyAssigned) {
        req.flash('error', 'Review already assigned!');
        return res.redirect('/admin-dashboard');
      }

      // Update the reviewer's assignedReviews field by adding the recipient's reference
      await reviewer.updateOne({
        $push: { assignedReviews: recipient },
      });

      req.flash('success', 'Review assigned successfully!');
      return res.redirect('/admin-dashboard');
    } else {
      req.flash('error', "Couldn't assign the review");
    }
  } catch (err) {
    console.log('error: ', err);
  }
};

// Submit review
export const submitReview = async (req, res) => {
  const { recipient_email, feedback } = req.body;
  try {
    // Find the recipient and reviewer based on user IDs and email
    const recipient = await User.findOne({ email: recipient_email });
    const reviewer = await User.findById(req.params.id);

    // Create a new review
    const review = await Review.create({
      review: feedback,
      reviewer,
      recipient,
    });

    // Trim extra spaces from the review
    const reviewString = review.review.trim();

    // Prevent submitting empty feedback
    if (reviewString === '') {
      req.flash('error', "Feedback section can't be empty!");
      return res.redirect('back');
    }

    // Add the reference of the newly created review to the recipient's reviewsFromOthers
    await recipient.updateOne({
      $push: { reviewsFromOthers: review },
    });

    // Remove the reference of the recipient from the reviewer's assignedReviews field
    await reviewer.updateOne({
      $pull: { assignedReviews: recipient.id },
    });

    req.flash('success', 'Review submitted successfully!');
    return res.redirect('/employee-dashboard/:id');
  } catch (err) {
    console.log('error', err);
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const { feedback } = req.body;
    const reviewToBeUpdated = await Review.findById(req.params.id);

    // If the review is not found
    if (!reviewToBeUpdated) {
      req.flash('error', 'Review does not exist!');
    }

    // Assign the feedback string from the form body to the review
    reviewToBeUpdated.review = feedback;

    // Save the updated review
    reviewToBeUpdated.save();

    req.flash('success', 'Review updated!');
    return res.redirect('back');
  } catch (err) {
    console.log(err);
  }
};
