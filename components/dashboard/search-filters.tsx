"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const months = [
  { value: "", label: "Semua Bulan" },
  { value: "01", label: "Januari" },
  { value: "02", label: "Februari" },
  { value: "03", label: "Maret" },
  { value: "04", label: "April" },
  { value: "05", label: "Mei" },
  { value: "06", label: "Juni" },
  { value: "07", label: "Juli" },
  { value: "08", label: "Agustus" },
  { value: "09", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.toString();

  const [registration, setRegistration] = useState(
    searchParams.get("registration") ?? "",
  );
  const [aircraftType, setAircraftType] = useState(
    searchParams.get("type") ?? "",
  );
  const [amcOfficer, setAmcOfficer] = useState(
    searchParams.get("officer") ?? "",
  );
  const [month, setMonth] = useState(searchParams.get("month") ?? "");

  useEffect(() => {
    const handle = setTimeout(() => {
      const nextParams = new URLSearchParams(currentQuery);

      if (registration) nextParams.set("registration", registration);
      else nextParams.delete("registration");

      if (aircraftType) nextParams.set("type", aircraftType);
      else nextParams.delete("type");

      if (amcOfficer) nextParams.set("officer", amcOfficer);
      else nextParams.delete("officer");

      if (month) nextParams.set("month", month);
      else nextParams.delete("month");

      nextParams.delete("page");

      const query = nextParams.toString();
      if (query === currentQuery) {
        return;
      }
      router.replace(query ? `/dashboard?${query}` : "/dashboard");
    }, 300);

    return () => clearTimeout(handle);
  }, [registration, aircraftType, amcOfficer, month, currentQuery, router]);

  return (
    <Card className="bg-slate-900/60">
      <CardContent className="grid gap-4 p-6 md:grid-cols-4">
        <Input
          placeholder="Cari registrasi"
          value={registration}
          onChange={(event) => setRegistration(event.target.value)}
        />
        <Input
          placeholder="Cari tipe pesawat"
          value={aircraftType}
          onChange={(event) => setAircraftType(event.target.value)}
        />
        <Input
          placeholder="Cari AMC officer"
          value={amcOfficer}
          onChange={(event) => setAmcOfficer(event.target.value)}
        />
        <div className="relative">
          <select
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            className="flex h-10 w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            {months.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
}
