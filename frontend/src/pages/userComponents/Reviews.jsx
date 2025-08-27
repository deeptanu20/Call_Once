/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { Loader2, MoreVertical, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  postReview,
  updateReview,
  deleteReview,
  validateImages,
} from "../../services/reviewService";

const ReviewImageGallery = ({ images, onImageClick }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => onImageClick(image)}
            className="relative group aspect-square overflow-hidden rounded-lg hover:ring-2 hover:ring-slate-500 transition-all"
          >
            <img
              src={image}
              alt={`Review image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
};

const Reviews = ({
  serviceId,
  reviews: initialReviews,
  selectedImage,
  setSelectedImage,
}) => {
  const { authData, getUserIdFromToken } = useAuth();
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    images: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingReview, setEditingReview] = useState({
    rating: 0,
    comment: "",
    images: [],
    deletedImages: [],
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [editImagePreview, setEditImagePreview] = useState([]);
  const [uploadError, setUploadError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingReviewId, setUpdatingReviewId] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const isUserReview = (review) => {
    return authData && review.user._id === getUserIdFromToken(authData.token);
  };

  const handleUpdateReview = async () => {
    setUpdatingReviewId(isEditing);
    const loadingToast = toast.loading("Updating your review...");

    try {
      const updatedReview = await updateReview(
        isEditing,
        {
          rating: editingReview.rating,
          comment: editingReview.comment,
        },
        editingReview.images,
        editingReview.deletedImages
      );

      const reviewWithUser = {
        ...updatedReview,
        user: updatedReview.user || { name: "Unknown User" },
      };

      setReviews((prevReviews) =>
        prevReviews.map((r) =>
          r._id === reviewWithUser._id ? reviewWithUser : r
        )
      );

      setIsEditing(null);
      setEditingReview({
        rating: 0,
        comment: "",
        images: [],
        deletedImages: [],
      });
      setEditImagePreview([]);
      if (editFileInputRef.current) {
        editFileInputRef.current.value = "";
      }
      toast.success("Review updated successfully", { id: loadingToast });
    } catch (err) {
      console.error("Error updating review:", err);
      toast.error("Failed to update review. Please try again", {
        id: loadingToast,
      });
    } finally {
      setUpdatingReviewId(null);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmation) return;

    setIsDeleting(true);
    const loadingToast = toast.loading("Deleting review...");

    try {
      await deleteReview(reviewId);
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== reviewId)
      );
      setActiveMenu(null); // Close the menu after deletion
      toast.success("Review deleted successfully", { id: loadingToast });
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error("Failed to delete review. Please try again", {
        id: loadingToast,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditReview = (review) => {
    setIsEditing(review._id);
    setEditingReview({
      rating: review.rating,
      comment: review.comment,
      images: review.images || [],
      deletedImages: [],
    });
    setEditImagePreview(review.images || []);
    setActiveMenu(null); // Close the menu when editing starts
  };

  const handleImageChange = (e, isEdit = false) => {
    const files = Array.from(e.target.files);
    const validation = validateImages(files);

    if (!validation.isValid) {
      setUploadError(validation.errors.join("\n"));
      return;
    }

    if (
      (isEdit ? editingReview.images : newReview.images).length + files.length >
      5
    ) {
      setUploadError("Maximum 5 images allowed");
      return;
    }

    setUploadError(null);
    const previews = files.map((file) => URL.createObjectURL(file));

    if (isEdit) {
      setEditImagePreview((prev) => [...prev, ...previews]);
      setEditingReview((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...files],
      }));
    } else {
      setImagePreview((prev) => [...prev, ...previews]);
      setNewReview((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...files],
      }));
    }
  };

  const removeImage = (index, isEdit = false) => {
    if (isEdit) {
      const updatedPreviews = editImagePreview.filter((_, i) => i !== index);
      setEditImagePreview(updatedPreviews);

      if (index < editingReview.images.length) {
        const imageToDelete = editingReview.images[index];
        setEditingReview((prev) => ({
          ...prev,
          deletedImages: [...prev.deletedImages, imageToDelete],
          images: prev.images.filter((_, i) => i !== index),
        }));
      }
    } else {
      const updatedPreviews = imagePreview.filter((_, i) => i !== index);
      setImagePreview(updatedPreviews);
      setNewReview((prev) => ({
        ...prev,
        images: Array.from(prev.images).filter((_, i) => i !== index),
      }));
    }
  };

  const handlePostReview = async () => {
    if (!newReview.rating) {
      toast.error("Please select a rating before submitting");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Posting your review...");

    try {
      const reviewData = { ...newReview, service: serviceId };
      const postedReview = await postReview(
        serviceId,
        reviewData,
        newReview.images
      );

      const reviewWithUser = {
        ...postedReview,
        user: postedReview.user || { name: "Unknown User" },
      };

      setReviews((prevReviews) => [...prevReviews, reviewWithUser]);
      setNewReview({ rating: 0, comment: "", images: [] });
      setImagePreview([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Review posted successfully", { id: loadingToast });
    } catch (err) {
      console.error("Error posting review:", err);
      toast.error("Failed to post review. Please try again", {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (rating, isEditMode = false) => {
    if (isEditMode) {
      setEditingReview({ ...editingReview, rating });
    } else {
      setNewReview({ ...newReview, rating });
    }
  };

  const renderStarRating = (currentRating, isEditMode = false) => {
    const stars = Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        onClick={() => handleStarClick(index + 1, isEditMode)}
        className={`cursor-pointer text-xl md:text-2xl ${
          index < currentRating ? "text-yellow-500" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
    return <div className="flex space-x-1">{stars}</div>;
  };

  const renderImageUploadSection = (isEditMode = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Upload Images (Optional - Max 5)
      </label>
      <input
        type="file"
        ref={isEditMode ? editFileInputRef : fileInputRef}
        onChange={(e) => handleImageChange(e, isEditMode)}
        multiple
        accept="image/png, image/jpeg, image/jpg"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500 transition duration-150 ease-in-out"
        disabled={
          (isEditMode ? editingReview.images : newReview.images).length >= 5
        }
      />
      {uploadError && (
        <p className="mt-1 text-sm text-red-500">{uploadError}</p>
      )}

      {(isEditMode ? editImagePreview : imagePreview).length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(isEditMode ? editImagePreview : imagePreview).map(
            (preview, index) => (
              <div key={preview} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index, isEditMode)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );

  const renderActionMenu = (review) => {
    if (!isUserReview(review)) return null;

    return (
      <div className="relative">
        <button
          onClick={() =>
            setActiveMenu(activeMenu === review._id ? null : review._id)
          }
          className="text-gray-500 hover:text-gray-700"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
        {activeMenu === review._id && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <button
              onClick={() => handleEditReview(review)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteReview(review._id)}
              disabled={isDeleting}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:text-gray-400"
            >
              {isDeleting && (
                <Loader2 className="h-3 w-3 animate-spin inline mr-2" />
              )}
              Delete
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
        Reviews
      </h2>

      {/* Scrollable Reviews Section */}
      <div className="max-h-[600px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
        {reviews.length === 0 ? (
          <p className="text-gray-600 italic">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {reviews.slice().reverse().map((review) => (
              <div
                key={review._id}
                className="border-b border-gray-200 pb-4 md:pb-6 last:border-b-0"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                  <div>
                    <strong className="text-gray-800 block sm:inline mb-1 sm:mb-0">
                      {review.user.name}
                    </strong>
                    {renderStarRating(review.rating)}
                  </div>

                  {renderActionMenu(review)}
                </div>
                <p className="text-gray-600 mb-3">{review.comment}</p>
                {review.images && review.images.length > 0 && (
                  <ReviewImageGallery
                    images={review.images}
                    onImageClick={setSelectedImage}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Review Section */}
      <div className="mt-6 md:mt-8 border-t pt-6">
        <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">
          {isEditing ? "Edit Review" : "Add Review"}
        </h3>
        <div className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            {renderStarRating(
              isEditing ? editingReview.rating : newReview.rating,
              isEditing
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment
            </label>
            <textarea
              value={isEditing ? editingReview.comment : newReview.comment}
              onChange={(e) =>
                isEditing
                  ? setEditingReview({
                      ...editingReview,
                      comment: e.target.value,
                    })
                  : setNewReview({ ...newReview, comment: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="4"
            />
          </div>
          {renderImageUploadSection(isEditing)}
          <div>
            <button
              onClick={isEditing ? handleUpdateReview : handlePostReview}
              disabled={isSubmitting || updatingReviewId === isEditing}
              className="w-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-400 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center gap-2"
            >
              {(isSubmitting || updatingReviewId === isEditing) && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Update Review" : "Post Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
