import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    reuired: true,
    unique: true,
  },
  phone: { type: String },
  membershipDate: { type: Date, default: Date.now },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  booksCheckedOut: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

const Member = mongoose.model("Member", memberSchema);
export default Member;
