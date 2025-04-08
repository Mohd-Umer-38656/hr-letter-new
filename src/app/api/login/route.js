import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/lib/db"; // Ensure this points to your DB connection

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Query database for the user
    const query = "SELECT * FROM users WHERE email = ?";
    const values = [email];

    const [rows] = await db.execute(query, values); // MySQL/

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const user = rows[0];

    // Check if the provided password matches the stored one
    if (password !== user.password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, "your_secret_key", { expiresIn: "1h" });

    // Set token in HTTP-only cookie
    const response = NextResponse.json({ message: "Login successful" });
    response.headers.set("Set-Cookie", `authToken=${token}; HttpOnly; Path=/; Max-Age=3600;`);

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
