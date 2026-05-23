import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { formatDate } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prisma } = await import("@/lib/prisma");

  const movements = await prisma.aircraftMovement.findMany({
    orderBy: { createdAt: "desc" },
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Hanggar Movements");

  sheet.columns = [
    { header: "Log Date", key: "logDate", width: 16 },
    { header: "Registration", key: "registration", width: 16 },
    { header: "Aircraft Type", key: "aircraftType", width: 20 },
    { header: "AMC Officer", key: "amcOfficer", width: 22 },
    { header: "Entry Date", key: "entryDate", width: 16 },
    { header: "Entry Time", key: "entryTime", width: 12 },
    { header: "Exit Date", key: "exitDate", width: 16 },
    { header: "Exit Time", key: "exitTime", width: 12 },
    { header: "Created At", key: "createdAt", width: 22 },
  ];

  movements.forEach((movement) => {
    sheet.addRow({
      logDate: formatDate(movement.logDate),
      registration: movement.registration,
      aircraftType: movement.aircraftType,
      amcOfficer: movement.amcOfficer,
      entryDate: formatDate(movement.entryDate),
      entryTime: movement.entryTime,
      exitDate: formatDate(movement.exitDate),
      exitTime: movement.exitTime,
      createdAt: formatDate(movement.createdAt),
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const fileDate = new Date().toISOString().slice(0, 10);
  const fileName = `hanggar-report-${fileDate}.xlsx`;
  const data = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer as ArrayBuffer);

  return new NextResponse(data, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=\"${fileName}\"`,
    },
  });
}
