"use client";

import { useDraggable } from "@dnd-kit/core";

export function Draggable({ children }: { children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="
        px-4 py-2 rounded-md 
        bg-blue-600 text-white font-medium 
        cursor-grab active:cursor-grabbing
        select-none shadow
        transition-transform duration-200
      "
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      {children}
    </button>
  );
}
