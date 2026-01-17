import "@/src/styles/globals.css";
import { PendingRegistarationTable } from "../components/tables/pending-registration-table/table";
import { PendingUser } from "@/src/types/User";

export const DUMMY_USERS: PendingUser[] = [
  {
    id: "1",
    username: "samuel",
    fullName: "Samuel Thomas",
    email: "samuel.thomas@example.com",
    requestedAt: "2026-01-15",
    confidence: 92,
  },
  {
    id: "2",
    username: "johndoe",
    fullName: "John Doe",
    email: "john.doe@example.com",
    requestedAt: "2026-01-14",
    confidence: 88,
  },
  {
    id: "3",
    username: "annasmith",
    fullName: "Anna Smith",
    email: "anna.smith@example.com",
    requestedAt: "2026-01-14",
    confidence: 95,
  },
  {
    id: "4",
    username: "michaelb",
    fullName: "Michael Brown",
    email: "michael.brown@example.com",
    requestedAt: "2026-01-13",
    confidence: 90,
  },
  {
    id: "5",
    username: "jessicaw",
    fullName: "Jessica Wilson",
    email: "jessica.wilson@example.com",
    requestedAt: "2026-01-13",
    confidence: 86,
  },
  {
    id: "6",
    username: "danielk",
    fullName: "Daniel Kim",
    email: "daniel.kim@example.com",
    requestedAt: "2026-01-12",
    confidence: 91,
  },
  {
    id: "7",
    username: "sarahlee",
    fullName: "Sarah Lee",
    email: "sarah.lee@example.com",
    requestedAt: "2026-01-12",
    confidence: 89,
  },
  {
    id: "8",
    username: "robertm",
    fullName: "Robert Miller",
    email: "robert.miller@example.com",
    requestedAt: "2026-01-11",
    confidence: 84,
  },
  {
    id: "9",
    username: "emilyd",
    fullName: "Emily Davis",
    email: "emily.davis@example.com",
    requestedAt: "2026-01-11",
    confidence: 93,
  },
  {
    id: "10",
    username: "kevinh",
    fullName: "Kevin Harris",
    email: "kevin.harris@example.com",
    requestedAt: "2026-01-10",
    confidence: 87,
  },
  {
    id: "11",
    username: "laurac",
    fullName: "Laura Clark",
    email: "laura.clark@example.com",
    requestedAt: "2026-01-10",
    confidence: 90,
  },
  {
    id: "12",
    username: "andrewt",
    fullName: "Andrew Thompson",
    email: "andrew.thompson@example.com",
    requestedAt: "2026-01-09",
    confidence: 94,
  },
  {
    id: "13",
    username: "nataliep",
    fullName: "Natalie Parker",
    email: "natalie.parker@example.com",
    requestedAt: "2026-01-09",
    confidence: 85,
  },
  {
    id: "14",
    username: "brianl",
    fullName: "Brian Lewis",
    email: "brian.lewis@example.com",
    requestedAt: "2026-01-08",
    confidence: 88,
  },
  {
    id: "15",
    username: "oliverm",
    fullName: "Oliver Martinez",
    email: "oliver.martinez@example.com",
    requestedAt: "2026-01-08",
    confidence: 91,
  },
];

export default function PendingRegistarationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pending Registrations</h1>

      <PendingRegistarationTable users={DUMMY_USERS} />
    </div>
  );
}
