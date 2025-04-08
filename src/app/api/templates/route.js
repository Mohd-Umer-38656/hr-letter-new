import { NextResponse } from "next/server";
import db from "@/lib/db";

// Handle CRUD operations in a single route
export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM templates");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Database error", details: error }, { status: 500 });
  }
}


//new template function
export async function POST(req) {
  try {
    const { name, category, content, placeholders } = await req.json();

    // Ensure placeholders is stored as a JSON string
    const placeholdersString = JSON.stringify(placeholders);

    await db.query(
      "INSERT INTO templates (name, category, content, placeholders) VALUES (?, ?, ?, ?)", 
      [name, category, content, placeholdersString]
    );

    return NextResponse.json({ message: "Template added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  }
}



// update function
export async function PUT(req) {
  try {
    const { id, name, category , content , placeholders } = await req.json();
    console.log("Updating template:", id, name, category); // Debugging log

    // Ensure the ID is valid
    if (!id) {
      return NextResponse.json({ error: "ID is required for updating" }, { status: 400 });
    }

    const result = await db.query(
      "UPDATE templates SET name = ?, category = ? , content = ? , placeholders = ? WHERE id = ?", 
      [name, category, content,placeholders, id]
    );

    // Check if rows were affected
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "No record found with this ID" }, { status: 404 });
    }

    return NextResponse.json({ message: "Template updated successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  }
}



//delete function
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await db.query("DELETE FROM templates WHERE id = ?", [id]);
    return NextResponse.json({ message: "Template deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Database error", details: error }, { status: 500 });
  }
}
