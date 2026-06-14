import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
export function DataTable({
  columns,
  data,
  onRowClick
}) {
  return <Table><TableHeader><TableRow>{columns.map((col) => <TableHead key={col.key}>{col.header}</TableHead>)}</TableRow></TableHeader><TableBody>{data.length === 0 ? <TableRow><TableCell
    colSpan={columns.length}
    className="text-center text-muted-foreground py-6"
  >
              No records.
            </TableCell></TableRow> : data.map((row, rowIndex) => <TableRow
    key={rowIndex}
    className={onRowClick ? "cursor-pointer" : void 0}
    onClick={onRowClick ? () => onRowClick(row) : void 0}
  >{columns.map((col) => <TableCell key={col.key}>{col.render ? col.render(row) : String(row[col.key] ?? "")}</TableCell>)}</TableRow>)}</TableBody></Table>;
}
