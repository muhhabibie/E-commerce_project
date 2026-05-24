"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import { formatPrice } from "@/lib/format-price";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export interface DataTableColumn<T extends object> {
  key: Extract<keyof T, string>; // ensure key is a string for React keys while constrained to row keys
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode; // optional custom renderer per cell
}

interface BaseProps<T extends object> {
  title?: string;
  columns: Array<DataTableColumn<T>>;
  data: T[] | null | undefined;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function DataTable<T extends object>({
  title,
  columns,
  data,
  emptyMessage = "No data",
  isLoading = false,
}: BaseProps<T>) {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead key="action">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={columns.length}>Loading...</TableCell>
              </TableRow>
            )}
            {!isLoading && (!data || data.length === 0) && (
              <TableRow>
                <TableCell colSpan={columns.length}>{emptyMessage}</TableCell>
              </TableRow>
            )}
            {Array.isArray(data) &&
              data.map((row, rowIdx) => {
                const rowKey = (row as { id?: string }).id ?? String(rowIdx);
                return (
                  <TableRow key={rowKey}>
                    {columns.map((col) => {
                      const raw = row[col.key as keyof T];
                      const isPriceColumn = /price/i.test(col.key);
                      const displayValue = (() => {
                        if (col.render) return col.render(raw, row);
                        if (isPriceColumn) {
                          const numeric =
                            typeof raw === "number" || typeof raw === "string"
                              ? raw
                              : "";
                          return numeric === ""
                            ? "-"
                            : `Rp ${formatPrice(numeric)}`;
                        }
                        return String(raw ?? "-");
                      })();

                      return (
                        <TableCell key={`${rowIdx}-${String(col.key)}`}>
                          {displayValue}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreHorizontal />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
