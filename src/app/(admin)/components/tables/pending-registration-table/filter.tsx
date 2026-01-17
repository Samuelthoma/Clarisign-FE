import { Input } from "@/components/ui/input";

interface props {
  search: string;
  onSearchChange: (v: string) => void;
}

export function PendingFilterBar({ search, onSearchChange }: props) {
  return (
    <div className="flex items-center gap-3">
      <Input
        placeholder="Search by username..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-[260px]"
      />
    </div>
  );
}
