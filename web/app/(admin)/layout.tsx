// app/(admin)/layout.tsx
import React from "react";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-primary selection:text-white">
      {children}
    </div>
  );
}
