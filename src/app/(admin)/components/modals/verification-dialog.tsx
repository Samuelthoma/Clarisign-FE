"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  idCardImageUrl: string;
  livenessImageUrl: string;
  confidence: number;
}

export function VerificationDialog({
  idCardImageUrl,
  livenessImageUrl,
  confidence,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Compare
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Identity Verification</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <img
            src={idCardImageUrl}
            alt="ID Card"
            width={400}
            height={250}
            className="rounded-md"
          />

          <img
            src={livenessImageUrl}
            alt="ID Card"
            width={400}
            height={250}
            className="rounded-md"
          />
        </div>

        <div className="mt-4 text-sm">
            Confidence Level: <strong>{confidence}%</strong>
        </div>
      </DialogContent>
    </Dialog>
  );
}
