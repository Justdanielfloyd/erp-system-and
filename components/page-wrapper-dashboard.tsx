"use client";

import { ReactNode } from "react";

export default function PageWrapperDashboard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-screen py-14 px-3 md:p-14 space-y-8 overflow-x-hidden">
      {children}
    </div>
  );
}
