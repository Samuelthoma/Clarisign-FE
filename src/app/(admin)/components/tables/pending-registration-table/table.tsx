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
import { VerificationDialog } from "../../modals/verification-dialog";
import { PendingUser } from "@/src/types/User";
import { useMemo, useState } from "react";
import { PendingFilterBar } from "./filter";
import { TablePagination } from "./footer";

type props = {
  users: PendingUser[];
  isLoading?: boolean;
};

const PAGE_SIZE = 5;

export function PendingRegistarationTable({ users, isLoading = false }: props) {
  const [search, setSeacrh] = useState("");
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return user.username.toLowerCase().includes(search.toLowerCase());
    });
  }, [users, search]);

  const totalPage = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <div className="space-y-4">
      <PendingFilterBar
        onSearchChange={(e) => {
          setSeacrh(e);
          setPage(1);
        }}
        search={search}
      />

      <div className="rounded-md border bg-background">
        <Table className="table-fixed w-full [&_td]:text-sm [&_td]:text-foreground [&_td]:py-3">
          <TableHeader className="text-sm text-left font-medium text-muted-foreground">
            <TableRow className="w-full">
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Requested At</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <></>
            ) : paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.requestedAt}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.confidence}</Badge>
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        page={page}
        totalPages={totalPage}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPage, p + 1))}
      />
    </div>
  );
}
