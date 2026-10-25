import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 300 },
    status: {
      type: String,
      enum: ["draft", "scheduled", "published", "failed"],
      default: "draft",
    },
    scheduledAt: { type: Date },
    publishedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

postSchema.index({ user: 1, status: 1, scheduledAt: 1 });
export default mongoose.model("Post", postSchema);
