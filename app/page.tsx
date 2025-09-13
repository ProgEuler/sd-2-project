"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">University Portal</h1>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
