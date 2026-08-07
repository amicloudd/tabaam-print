"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ className, children }) {
  const router = useRouter();

  return (
    <button type="button" className={className} onClick={() => router.back()}>
      {children}
    </button>
  );
}
