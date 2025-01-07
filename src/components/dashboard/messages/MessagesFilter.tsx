import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageStatus } from "@/types/messages";

interface MessagesFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: MessageStatus | "all";
  onStatusChange: (value: MessageStatus | "all") => void;
}

export const MessagesFilter = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange
}: MessagesFilterProps) => {
  return (
    <div className="flex gap-4 p-4">
      <Input
        placeholder="Search patients..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
      <Select
        value={statusFilter}
        onValueChange={(value: MessageStatus | "all") => onStatusChange(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Messages</SelectItem>
          <SelectItem value="not_seen">Not Seen</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};