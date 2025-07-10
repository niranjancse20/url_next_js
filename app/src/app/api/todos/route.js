import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

// DB
const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGO_URI);
}

// schema
const URLSCHEMA = new mongoose.Schema({
  name: String,
  long_url: String,
  short_url: String,
});

const URL = mongoose.models.URL || mongoose.model("URL", URLSCHEMA);

// GET
export async function GET() {
  await connectDB();
  const info = await URL.find();
  return NextResponse.json(info);
}

// POST
export async function POST(request) {
  await connectDB();
  const shortid = nanoid(5);
  const newInfo = await request.json();
  newInfo.short_url = shortid;

  const created = await URL.create(newInfo);
  return NextResponse.json(created);
}
