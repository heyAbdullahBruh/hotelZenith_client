"use client";
import { useState, useEffect } from "react";
import { reviewService } from "@/lib/services/reviewService";
import SectionHeader from "@/components/ui/SectionHeader";
import { 
  Star, ThumbsUp, Pencil, Trash2, Search, X, 
  Loader2, Quote, UserCircle2, CalendarDays 
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- VERIFICATION MODAL COMPONENT ---
const VerificationModal = ({ isOpen, onClose, action, review, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Verify Email, 2: Perform Action
  const [email, setEmail] = useState("");
  const [editForm, setEditForm] = useState({ rating: 5, title: "", comment: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (review) setEditForm({ rating: review.rating, title: review.title, comment: review.comment });
    setStep(1);
    setEmail("");
  }, [review]);

  const handleVerify = () => {
    // In a real app, strict auth happens on backend. 
    // Here we check if email matches review.email (assuming data is available) or just pass to backend
    // Since backend requires email in body, we pass to step 2 and let backend fail if wrong
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (action === "update") {
        await reviewService.update(review._id, { ...editForm, email }); // Send email for auth
        toast.success("Review updated successfully");
      } else {
        await reviewService.delete(review._id, email);
        toast.success("Review deleted successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed. Wrong email?");
      // If error suggests auth fail, go back to step 1
      if(error.response?.status === 400 || error.response?.status === 404) setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-secondary-900/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden"
      >
        <div className="p-6 bg-secondary-50 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg">{action === "update" ? "Edit Review" : "Delete Review"}</h3>
          <button onClick={onClose}><X size={20}/></button>
        </div>

        <div className="p-6 space-y-4">
          {step === 1 ? (
            <>
              <p className="text-sm text-secondary-600">To verify ownership, please enter the email address used to post this review.</p>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="w-full p-3 border rounded-md"
              />
              <button onClick={handleVerify} className="w-full bg-secondary-900 text-white py-3 rounded-md font-bold uppercase text-xs tracking-widest">Verify Ownership</button>
            </>
          ) : (
            <>
              {action === "delete" ? (
                 <div className="text-center py-4">
                   <p className="text-red-600 font-bold mb-4">Are you sure you want to delete this review?</p>
                   <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-red-500 text-white py-3 rounded-md font-bold uppercase text-xs tracking-widest hover:bg-red-600">
                     {isLoading ? "Deleting..." : "Confirm Delete"}
                   </button>
                 </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-secondary-500">Rating</label>
                    <div className="flex gap-2 mt-1">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} onClick={() => setEditForm(p=>({...p, rating: s}))}>
                          <Star size={24} className={s <= editForm.rating ? "fill-primary-500 text-primary-500" : "text-secondary-200"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <input 
                    value={editForm.title} 
                    onChange={e => setEditForm(p=>({...p, title: e.target.value}))}
                    className="w-full p-3 border rounded-md text-sm font-bold" 
                    placeholder="Title"
                  />
                  <textarea 
                    value={editForm.comment}
                    onChange={e => setEditForm(p=>({...p, comment: e.target.value}))}
                    className="w-full p-3 border rounded-md text-sm" 
                    rows={3}
                  />
                  <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-secondary-900 text-white py-3 rounded-md font-bold uppercase text-xs tracking-widest">
                     {isLoading ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// --- REVIEW CARD ---
const ReviewCard = ({ review, onEdit, onDelete }) => {
  const [liked, setLiked] = useState(false);
  const [votes, setVotes] = useState(review.helpfulVotes || 0);

  useEffect(() => {
    // Check local storage for persistent like state
    const isLiked = localStorage.getItem(`liked_review_${review._id}`);
    if (isLiked) setLiked(true);
  }, [review._id]);

  const handleLike = async () => {
    if (liked) return;
    try {
      await reviewService.voteHelpful(review._id);
      setVotes(prev => prev + 1);
      setLiked(true);
      localStorage.setItem(`liked_review_${review._id}`, 'true');
    } catch (err) {
      toast.error("Could not register vote");
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-secondary-100 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-500 font-bold">
            {review.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-secondary-900 text-sm">{review.name}</h4>
            <p className="text-xs text-secondary-500">{review.profession}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
             <Star key={i} size={14} className={i < review.rating ? "fill-primary-500 text-primary-500" : "fill-secondary-100 text-secondary-100"} />
          ))}
        </div>
      </div>

      <h5 className="font-bold text-secondary-900 mb-2">{review.title}</h5>
      <p className="text-secondary-600 text-sm leading-relaxed mb-6 flex-1 relative pl-6">
        <Quote className="absolute left-0 top-0 text-primary-200" size={20} />
        {review.comment}
      </p>

      {/* Footer Info */}
      <div className="flex items-center gap-2 text-[10px] text-secondary-400 font-bold uppercase tracking-wider mb-4">
        <span className="bg-secondary-50 px-2 py-1 rounded">{review.category}</span>
        {review.food && <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded line-clamp-1">{review.food.name}</span>}
        <span className="ml-auto">{new Date(review.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-secondary-100 flex justify-between items-center">
        <button 
          onClick={handleLike}
          className={cn(
            "flex items-center gap-2 text-xs font-bold transition-colors",
            liked ? "text-primary-600" : "text-secondary-400 hover:text-primary-600"
          )}
        >
          <ThumbsUp size={14} className={liked ? "fill-primary-600" : ""} />
          Helpful ({votes})
        </button>

        <div className="flex gap-2">
           <button onClick={() => onEdit(review)} className="p-2 text-secondary-400 hover:bg-secondary-50 hover:text-secondary-900 rounded transition-colors" title="Edit Review">
             <Pencil size={14} />
           </button>
           <button onClick={() => onDelete(review)} className="p-2 text-secondary-400 hover:bg-red-50 hover:text-red-500 rounded transition-colors" title="Delete Review">
             <Trash2 size={14} />
           </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---
export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, food, event, table

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("update");
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      let data;
      if (searchEmail) {
        // Fetch User Reviews
        const res = await reviewService.getByEmail(searchEmail);
        data = res.data;
      } else {
        // Fetch All Reviews with Filter
        const filters = activeTab !== "all" ? { type: activeTab } : {};
        const res = await reviewService.getAll(filters);
        data = res.data;
      }
      setReviews(data || []);
    } catch (error) {
      console.error(error);
      // Don't toast error on 404 search, just empty list
      if (!searchEmail) toast.error("Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce or simple effect on dependencies
    const timer = setTimeout(() => {
      fetchReviews();
    }, 500);
    return () => clearTimeout(timer);
  }, [activeTab, searchEmail]);

  // Handlers
  const openEdit = (review) => {
    setSelectedReview(review);
    setModalAction("update");
    setModalOpen(true);
  };

  const openDelete = (review) => {
    setSelectedReview(review);
    setModalAction("delete");
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-secondary-50 pt-24 pb-20">
      <div className="container max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
           <div>
             <h1 className="font-display text-4xl font-bold text-secondary-900 mb-2">Guest Reviews</h1>
             <p className="text-secondary-500">See what others are saying about Hotel Zenith</p>
           </div>
           <Link href="/feedbacks/give-your-personal-feedback" className="bg-primary-500 text-white px-6 py-3 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-primary-600 transition-colors shadow-lg">
             Write a Review
           </Link>
        </div>

        {/* CONTROLS */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-secondary-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {["all", "food", "event", "table"].map(t => (
               <button
                 key={t}
                 onClick={() => { setActiveTab(t); setSearchEmail(""); }} // Clear search when switching tabs
                 className={cn(
                   "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors",
                   activeTab === t ? "bg-secondary-900 text-white" : "bg-secondary-50 text-secondary-500 hover:bg-secondary-100"
                 )}
               >
                 {t === "all" ? "All Reviews" : `${t} Reviews`}
               </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <input 
              type="email" 
              placeholder="Find your reviews by email..." 
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary-50 border border-secondary-200 rounded-full text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-secondary-400" />
            {searchEmail && (
              <button onClick={() => setSearchEmail("")} className="absolute right-3 top-2.5 text-secondary-400 hover:text-secondary-900">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* GRID */}
        {loading ? (
           <div className="flex justify-center py-20"><Loader2 className="animate-spin text-secondary-400" size={32} /></div>
        ) : reviews.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-lg border border-secondary-100 border-dashed">
             <div className="bg-secondary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <Quote className="text-secondary-300" size={32} />
             </div>
             <h3 className="text-lg font-bold text-secondary-900">No reviews found</h3>
             <p className="text-secondary-500 text-sm">Be the first to share your experience!</p>
           </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {reviews.map(review => (
                <ReviewCard 
                  key={review._id} 
                  review={review} 
                  onEdit={openEdit} 
                  onDelete={openDelete} 
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Verification & Action Modal */}
      <VerificationModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        action={modalAction}
        review={selectedReview}
        onSuccess={fetchReviews}
      />
    </div>
  );
}