import { NextResponse } from "next/server";
import db from "@/lib/db";

// Handle CRUD operations in a single route
export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM emp_data");
    return NextResponse.json(rows);
    
  } catch (error) {
    return NextResponse.json({ error: "Database error", details: error }, { status: 500 });
  }
}