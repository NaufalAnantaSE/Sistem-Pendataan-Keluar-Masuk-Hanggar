import { NextResponse } from "next/server";

export async function GET() {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    return NextResponse.json({ error: "Spreadsheet not configured." }, { status: 404 });
  }

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}`;
  return NextResponse.redirect(url);
}
