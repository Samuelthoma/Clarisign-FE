export default function RightPanel() {
  return (
    <div className="space-y-3">
      <div className="p-3 border rounded">
        <p className="font-medium">Alice</p>
        <p className="text-xs text-gray-500">Order: 1</p>
        <p className="text-xs text-yellow-600">Pending</p>
      </div>

      <div className="p-3 border rounded opacity-60">
        <p className="font-medium">Bob</p>
        <p className="text-xs text-gray-500">Order: 2</p>
        <p className="text-xs text-gray-400">Locked</p>
      </div>

      <button className="w-full p-2 border rounded hover:bg-gray-100 text-sm">
        Add Collaborator
      </button>
    </div>
  );
}
