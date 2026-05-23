import { google } from "googleapis";
import type { AircraftMovement } from "@/types/movement";
import { formatDate } from "@/lib/format";

const scopes = ["https://www.googleapis.com/auth/spreadsheets"];

function getGoogleAuth() {
  // Prefer a full service account JSON if provided (sa JSON pasted into env)
  const saJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (saJson) {
    try {
      const parsed = JSON.parse(saJson);
      const client = new google.auth.JWT({
        email: parsed.client_email,
        key: parsed.private_key,
        scopes,
      });
      return client;
    } catch {
      console.warn("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON; falling back to individual vars.");
    }
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error("Google Sheets credentials are missing. Set GOOGLE_SERVICE_ACCOUNT_JSON or both GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.");
  }

  // Support private keys stored with literal \n sequences or real newlines
  privateKey = privateKey.replace(/\\n/g, "\n").trim();

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes,
  });
}

function toA1SheetRange(sheetName: string, columns: string) {
  const escaped = sheetName.replace(/'/g, "''");
  return `'${escaped}'!${columns}`;
}

async function resolveSheetRange(sheetId: string) {
  const configuredSheetName = process.env.GOOGLE_SHEET_NAME?.trim();
  if (configuredSheetName) {
    return toA1SheetRange(configuredSheetName, "A:I");
  }

  const auth = getGoogleAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const metadata = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
    fields: "sheets.properties.title",
  });

  const firstSheetName = metadata.data.sheets?.[0]?.properties?.title;
  if (!firstSheetName) {
    throw new Error("Spreadsheet has no sheets/tab. Create one tab first.");
  }

  return toA1SheetRange(firstSheetName, "A:I");
}

export async function appendMovementRow(movement: AircraftMovement) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    console.warn("GOOGLE_SHEET_ID is missing. Skip sync.");
    return;
  }

  const range = await resolveSheetRange(sheetId);
  const auth = getGoogleAuth();
  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          "",
          formatDate(movement.logDate),
          movement.registration,
          movement.aircraftType,
          movement.amcOfficer,
          formatDate(movement.entryDate),
          movement.entryTime,
          formatDate(movement.exitDate),
          movement.exitTime,
        ],
      ],
    },
  });
}
