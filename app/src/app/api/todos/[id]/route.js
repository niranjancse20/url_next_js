import mongoose from "mongoose";
import { NextResponse } from "next/server";

// DB connection
const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGO_URI);
}

// schema
const URLSCHEMA = new mongoose.Schema({
  name: { type: String },
  long_url: { type: String },
  short_url: { type: String },
});

const URL = mongoose.models.URL || mongoose.model("URL", URLSCHEMA);

// DELETE handler
export async function DELETE(req, { params }) {
  await connectDB();

  const { id } = params;

  try {
    const deleted = await URL.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting", error: error.message }, { status: 500 });
  }
}
