interface ViewerProps {
  activeTool: string | null;
}

export default function Viewer({activeTool} : ViewerProps) {
  return (
    <div className="relative w-[800px] h-[1100px] bg-white border shadow-md">
      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
        Document Viewer Placeholder
      </div>
    </div>
  );
}
