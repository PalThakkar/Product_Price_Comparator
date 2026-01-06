const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    target_price: { type: Number, required: true },
    is_active: { type: Boolean, default: true },
    triggered_at: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
