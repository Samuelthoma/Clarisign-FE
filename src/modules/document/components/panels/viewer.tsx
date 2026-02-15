interface ViewerProps {
  activeTool: string | null;
  fileUrl: string | null;
}

export default function Viewer({fileUrl} : ViewerProps) {
  if(!fileUrl){
    return (
      <div className="bg-white shadow rounded w-[800px] h-[1100px] flex items-center justify-center">
        Loading Document
      </div>
    )
  }
  return (
    <div className="bg-white shadow rounded overflow-hidden">
      <iframe src={fileUrl} className="w-[800px] h-[1100px]"></iframe>
    </div>
  );
}
