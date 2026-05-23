"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { appendMovementRow } from "@/lib/google-sheets";
import { auth } from "@/lib/auth";

const movementSchema = z.object({
  logDate: z.string().min(1, "Tanggal log wajib diisi."),
  registration: z.string().min(1, "Registrasi wajib diisi."),
  aircraftType: z.string().min(1, "Tipe pesawat wajib diisi."),
  amcOfficer: z.string().min(1, "AMC officer wajib diisi."),
  entryDate: z.string().min(1, "Tanggal masuk wajib diisi."),
  entryTime: z.string().min(1, "Jam masuk wajib diisi."),
  exitDate: z.string().min(1, "Tanggal keluar wajib diisi."),
  exitTime: z.string().min(1, "Jam keluar wajib diisi."),
});

export type MovementActionState = {
  success?: boolean;
  error?: string;
  warning?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createMovement(
  _prevState: MovementActionState,
  formData: FormData,
): Promise<MovementActionState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized." };
  }

  const parsed = movementSchema.safeParse({
    logDate: formData.get("logDate"),
    registration: formData.get("registration"),
    aircraftType: formData.get("aircraftType"),
    amcOfficer: formData.get("amcOfficer"),
    entryDate: formData.get("entryDate"),
    entryTime: formData.get("entryTime"),
    exitDate: formData.get("exitDate"),
    exitTime: formData.get("exitTime"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  const movement = await prisma.aircraftMovement.create({
    data: {
      logDate: new Date(data.logDate),
      registration: data.registration.toUpperCase(),
      aircraftType: data.aircraftType,
      amcOfficer: data.amcOfficer,
      entryDate: new Date(data.entryDate),
      entryTime: data.entryTime,
      exitDate: new Date(data.exitDate),
      exitTime: data.exitTime,
    },
  });

  let warning: string | undefined;

  try {
    await appendMovementRow(movement);
  } catch (error) {
    console.warn("Google Sheets sync failed:", error);
    warning = "Data tersimpan di database, tapi sinkronisasi ke Google Sheets gagal.";
  }

  revalidatePath("/dashboard");

  return { success: true, warning };
}

export async function deleteMovement(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized.");
  }

  await prisma.aircraftMovement.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
}
