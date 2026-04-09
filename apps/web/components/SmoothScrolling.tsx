"use client";

import { usePathname } from "next/navigation";
import { ReactLenis } from 'lenis/react';

export default function SmoothScrolling({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  // Lenis conflicts with overflow-y-auto panels in the dashboard layout
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
