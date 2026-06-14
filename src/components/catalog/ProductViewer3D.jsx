"use client";
import { useEffect } from "react";
export function ProductViewer3D({ src, alt }) {
  useEffect(() => {
    import("@google/model-viewer");
  }, []);
  return <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden"><model-viewer
    src={src}
    alt={alt}
    camera-controls=""
    auto-rotate=""
    ar=""
    style={{ width: "100%", height: "100%" }}
  /></div>;
}
