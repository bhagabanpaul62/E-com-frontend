import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json(
      { debug: "No token", isAdmin: false },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    return NextResponse.json(decoded); // You can customize this
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid token", isAdmin: false },
      { status: 401 }
    );
  }
}
