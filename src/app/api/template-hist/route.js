import { NextResponse } from "next/server";
import db from "@/lib/db"; // Assuming this is your MySQL connection


export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM templates_hist");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Database error", details: error }, { status: 500 });
  }
}



/////////////////////////////////////////saving the data
export async function POST(req) {
  try {
    const { template_id, template_name, form_data } = await req.json();

    // Convert form_data to JSON string
    const formDataJson = JSON.stringify(form_data);

    // Insert data into the table
    const query = `
      INSERT INTO templates_hist (template_id, template_name, form_data, created_at)
      VALUES (?, ?, ?, NOW())
    `;

    await db.execute(query, [template_id, template_name, formDataJson]);

    return Response.json({ success: true, message: "Letter saved successfully" });
  } catch (error) {
    console.error("Error saving letter:", error);
    return Response.json({ success: false, message: "Failed to save letter" }, { status: 500 });
  }
}
