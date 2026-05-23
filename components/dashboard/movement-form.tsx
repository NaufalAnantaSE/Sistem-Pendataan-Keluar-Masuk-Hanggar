"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createMovement, type MovementActionState } from "@/actions/movements";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: MovementActionState = {};

export function MovementForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(createMovement, initialState);

  useEffect(() => {
    if (state?.success) {
      toast.success("Data movement berhasil disimpan.");
      if (state.warning) {
        toast.warning(state.warning);
      }
      formRef.current?.reset();
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  const errors = state?.fieldErrors ?? {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Input Data Hanggar</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={action} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="logDate">Tanggal Log</Label>
            <Input id="logDate" name="logDate" type="date" required />
            {errors.logDate?.[0] ? (
              <p className="text-xs text-rose-300">{errors.logDate[0]}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="registration">Registrasi Pesawat</Label>
            <Input
              id="registration"
              name="registration"
              placeholder="PK-XXX"
              required
            />
            {errors.registration?.[0] ? (
              <p className="text-xs text-rose-300">{errors.registration[0]}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="aircraftType">Tipe Pesawat</Label>
            <Input id="aircraftType" name="aircraftType" required />
            {errors.aircraftType?.[0] ? (
              <p className="text-xs text-rose-300">{errors.aircraftType[0]}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="amcOfficer">AMC Duty Officer</Label>
            <Input id="amcOfficer" name="amcOfficer" required />
            {errors.amcOfficer?.[0] ? (
              <p className="text-xs text-rose-300">{errors.amcOfficer[0]}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="entryDate">Tanggal Masuk</Label>
            <Input id="entryDate" name="entryDate" type="date" required />
            {errors.entryDate?.[0] ? (
              <p className="text-xs text-rose-300">{errors.entryDate[0]}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="entryTime">Jam Masuk</Label>
            <Input id="entryTime" name="entryTime" type="time" required />
            {errors.entryTime?.[0] ? (
              <p className="text-xs text-rose-300">{errors.entryTime[0]}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="exitDate">Tanggal Keluar</Label>
            <Input id="exitDate" name="exitDate" type="date" required />
            {errors.exitDate?.[0] ? (
              <p className="text-xs text-rose-300">{errors.exitDate[0]}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="exitTime">Jam Keluar</Label>
            <Input id="exitTime" name="exitTime" type="time" required />
            {errors.exitTime?.[0] ? (
              <p className="text-xs text-rose-300">{errors.exitTime[0]}</p>
            ) : null}
          </div>
          <div className="md:col-span-2">
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Menyimpan..." : "Simpan Data"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
