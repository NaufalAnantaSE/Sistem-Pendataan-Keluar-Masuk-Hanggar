import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import * as XLSX from "xlsx";

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

  const rows = [
    [
      "Log Date",
      "Registration",
      "Aircraft Type",
      "AMC Officer",
      "Entry Date",
      "Entry Time",
      "Exit Date",
      "Exit Time",
      "Created At",
    ],
    ...movements.map((movement) => [
      formatDate(movement.logDate),
      movement.registration,
      movement.aircraftType,
      movement.amcOfficer,
      formatDate(movement.entryDate),
      movement.entryTime,
      formatDate(movement.exitDate),
      movement.exitTime,
      formatDate(movement.createdAt),
    ]),
  ];

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hanggar Movements");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });
  const fileDate = new Date().toISOString().slice(0, 10);
  const fileName = `hanggar-report-${fileDate}.xlsx`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=\"${fileName}\"`,
    },
  });
}
