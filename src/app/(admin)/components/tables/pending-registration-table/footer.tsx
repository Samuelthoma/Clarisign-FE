import { Button } from "@/components/ui/button";

type props = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export function TablePagination({ page, totalPages, onPrev, onNext }: props) {
  return (
    <div>
      <div className="flex items-center justify-between px-3 py-3">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={page === 1}
        >
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
