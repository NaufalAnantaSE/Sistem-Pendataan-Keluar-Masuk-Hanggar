import { formatDate } from "@/lib/format";
import type { AircraftMovement } from "@/types/movement";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";

type MovementTableProps = {
  movements: AircraftMovement[];
};

export function MovementTable({ movements }: MovementTableProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal Log</TableHead>
            <TableHead>Registrasi</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>AMC Officer</TableHead>
            <TableHead>Masuk</TableHead>
            <TableHead>Keluar</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell>{formatDate(movement.logDate)}</TableCell>
              <TableCell className="font-semibold text-cyan-200">
                {movement.registration}
              </TableCell>
              <TableCell>{movement.aircraftType}</TableCell>
              <TableCell>{movement.amcOfficer}</TableCell>
              <TableCell>
                <div className="text-xs text-slate-400">{formatDate(movement.entryDate)}</div>
                <div className="text-sm text-slate-100">{movement.entryTime}</div>
              </TableCell>
              <TableCell>
                <div className="text-xs text-slate-400">{formatDate(movement.exitDate)}</div>
                <div className="text-sm text-slate-100">{movement.exitTime}</div>
              </TableCell>
              <TableCell className="text-right">
                <DeleteDialog id={movement.id} registration={movement.registration} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
