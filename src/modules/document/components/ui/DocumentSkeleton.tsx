"use client";

import Skeleton from "@mui/material/Skeleton";

interface DocumentSkeletonProps {
  width?: number;
  height?: number;
}

export default function DocumentSkeleton({
  width = 800,
  height = 1100,
}: DocumentSkeletonProps) {
  return (
    <div
      className="p-12 bg-white border border-gray-200 flex flex-col gap-6"
      style={{ width, height }}
    >
      <Skeleton
        variant="rectangular"
        width="33%"
        height={40}
        className="mb-4 rounded-md"
      />

      <div>
        <Skeleton variant="text" width="100%" height={24} />
        <Skeleton variant="text" width="100%" height={24} />
        <Skeleton variant="text" width="92%" height={24} />
        <Skeleton variant="text" width="80%" height={24} />
      </div>

      <div className="mt-2">
        <Skeleton variant="text" width="100%" height={24} />
        <Skeleton variant="text" width="85%" height={24} />
        <Skeleton variant="text" width="100%" height={24} />
        <Skeleton variant="text" width="75%" height={24} />
      </div>

      <Skeleton
        variant="rectangular"
        width="100%"
        height={200}
        className="my-4 rounded-md"
      />

      <div>
        <Skeleton variant="text" width="100%" height={24} />
        <Skeleton variant="text" width="75%" height={24} />
        <Skeleton variant="text" width="85%" height={24} />
      </div>
    </div>
  );
}