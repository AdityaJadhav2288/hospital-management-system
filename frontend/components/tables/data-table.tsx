"use client";

import { useMemo, useState } from "react";
import { PAGE_SIZE } from "@/config/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/table";

type ColumnKey<T> = Extract<keyof T, string>;

type Column<T extends object, K extends ColumnKey<T> = ColumnKey<T>> = {
  key: K;
  header: string;
  searchable?: boolean;
  render?: (value: T[K], row: T) => React.ReactNode;
};

interface DataTableProps<T extends object> {
  rows: readonly T[];
  columns: readonly Column<T>[];
  pageSize?: number;
  searchPlaceholder?: string;
  emptyMessage?: string;
  getRowId?: (row: T, index: number) => React.Key;
}

function toSearchString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  if (value instanceof Date) return value.toISOString();
  return "";
}

export function DataTable<T extends object>({
  rows,
  columns,
  pageSize = PAGE_SIZE,
  searchPlaceholder = "Search",
  emptyMessage = "No records found.",
  getRowId,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query) return rows;
    const term = query.toLowerCase();
    const searchableColumns = columns.filter((column) => column.searchable !== false);
    return rows.filter((row) =>
      searchableColumns.some((column) => toSearchString(row[column.key]).toLowerCase().includes(term)),
    );
  }, [query, rows, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-3">
      <Input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setPage(1);
        }}
        placeholder={searchPlaceholder}
        className="h-11 rounded-2xl"
      />
      <div className="overflow-hidden rounded-[1.5rem] border border-slate-200">
      <Table>
        <THead>
          <Tr>
            {columns.map((col) => (
              <Th key={col.key}>{col.header}</Th>
            ))}
          </Tr>
        </THead>
        <TBody>
          {paged.length ? (
            paged.map((item, index) => (
              <Tr key={getRowId ? getRowId(item, index) : index} className="transition-colors hover:bg-slate-50">
                {columns.map((col) => {
                  const value = item[col.key];
                  return <Td key={col.key}>{col.render ? col.render(value, item) : toSearchString(value) || "-"}</Td>;
                })}
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={columns.length} className="text-center text-muted-foreground">
                {emptyMessage}
              </Td>
            </Tr>
          )}
        </TBody>
      </Table>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setPage((value) => Math.max(1, value - 1))}
        >
          Prev
        </Button>
        <span className="text-xs text-muted-foreground">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
