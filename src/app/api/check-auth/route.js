import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    const cookieStore = await cookies(); // Await cookies()

    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET);

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
