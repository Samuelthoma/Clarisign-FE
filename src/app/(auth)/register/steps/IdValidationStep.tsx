import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { format, parse, isValid } from "date-fns";

interface IdValidationStepProps {
  ocrData: any;
  onNext: (data: {
    nik: string;
    nama: string;
    tanggalLahir: Date | undefined;
  }) => void;
}

export default function IdValidationStep({
  ocrData,
  onNext,
}: IdValidationStepProps) {
  // OCR may return "Not found" for any field — treat that (and unparseable dates)
  // as blank so the user simply fills it in, instead of crashing later on format().
  const cleanOcr = (val?: string) => (val && val !== "Not found" ? val : "");

  const parseDate = (dateStr?: string) => {
    if (!dateStr || dateStr === "Not found") return undefined;
    const parsed = parse(dateStr, "dd-MM-yyyy", new Date());
    return isValid(parsed) ? parsed : undefined;
  };

  const [formData, setFormData] = useState({
    nik: cleanOcr(ocrData?.NIK),
    nama: cleanOcr(ocrData?.Nama),
    tanggalLahir: parseDate(ocrData?.DOB),
  });

  useEffect(() => {
    setFormData({
      nik: cleanOcr(ocrData?.NIK),
      nama: cleanOcr(ocrData?.Nama),
      tanggalLahir: parseDate(ocrData?.DOB),
    });
  }, [ocrData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "nik") {
      const numericValue = value.replace(/\D/g, "").slice(0, 16);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const isFormValid =
    formData.nik?.length === 16 &&
    formData.nama?.trim().length > 0 &&
    formData.tanggalLahir !== undefined;

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        Verify your identity details
      </h2>

      <p className="text-sm text-muted-foreground mb-6">
        Please review and refine the data if any information is missing or
        incorrect.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="nik"
            className="block text-foreground/80 text-sm font-medium mb-1"
          >
            NIK (16-digit National ID Number)
          </label>
          <input
            id="nik"
            name="nik"
            value={formData.nik}
            onChange={handleChange}
            type="text"
            inputMode="numeric"
            placeholder="e.g. 3201XXXXXXXXXXXX"
            className="
              w-full py-2 bg-transparent
              border-b-2 border-muted-foreground/40
              text-foreground
              focus:outline-none focus:border-primary
              transition-colors
            "
          />
        </div>

        <div>
          <label
            htmlFor="fullName"
            className="block text-foreground/80 text-sm font-medium mb-1"
          >
            Full name (as shown on ID)
          </label>
          <input
            id="fullName"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            type="text"
            placeholder="Enter your full legal name"
            className="
              w-full py-2 bg-transparent
              border-b-2 border-muted-foreground/40
              text-foreground
              focus:outline-none focus:border-primary
              transition-colors
            "
          />
        </div>

        <div className="space-y-1 flex flex-col">
          <label className="text-sm font-medium text-foreground">
            Date of Birth (Tanggal Lahir)
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal py-2 bg-transparent border-0 border-b-2 border-muted-foreground/40 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 hover:bg-transparent",
                  !formData.tanggalLahir && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.tanggalLahir ? (
                  format(formData.tanggalLahir, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.tanggalLahir}
                onSelect={(date) =>
                  setFormData((prev) => ({ ...prev, tanggalLahir: date }))
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={!isFormValid}
            className="
              w-full bg-primary text-primary-foreground
              py-2 rounded
              hover:bg-primary/90
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Confirm & Continue
          </button>
        </div>
      </form>
    </>
  );
}
