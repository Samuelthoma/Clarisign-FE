"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VerificationDialog } from "../modals/verification-dialog";

export function PendingRegistarationTable() {
  const rows = [1, 2, 3, 4, 5];

  return (
    <div className="rounded-md border bg-background">
      <Table
        className="[&_th]:text-left [&_th]:text-sm [&_th]:font-medium [&_th]:text-muted-foreground [&_td]:text-sm [&_td]:text-foreground [&_td]:py-3"
      >
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Requested At</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Verification</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((_, i) => (
            <TableRow key={i}>
              <TableCell>John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
              <TableCell>2026-01-17</TableCell>
              <TableCell>
                <Badge variant="secondary">92%</Badge>
              </TableCell>
              <TableCell>
                <VerificationDialog
                  confidence={92}
                  idCardImageUrl="https://picsum.photos/400/250"
                  livenessImageUrl="https://picsum.photos/seed/idcard/400/250"
                />
              </TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" size="sm">
                  Reject
                </Button>
                <Button size="sm">Approve</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
