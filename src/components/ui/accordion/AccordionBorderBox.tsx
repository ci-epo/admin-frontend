"use client";

import Image from "next/image";
import { useState } from "react";

interface AccordionAvatarItem {
  id: string;
  title: string;
  subtitle?: string;
  avatarSrc: string;
  avatarAlt?: string;
  content: React.ReactNode;
}

interface AccordionBorderBoxProps {
  id: string;
  items: AccordionAvatarItem[];
  defaultOpenId?: string;
}

function AccordionAvatarItemComponent({
  item,
  isOpen,
  onToggle,
}: {
  item: AccordionAvatarItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id={`heading-${item.id}`}>
        <div
          className={`accordion-button${isOpen ? "" : " collapsed"}`}
          role="button"
          tabIndex={0}
          onClick={onToggle}
          onKeyDown={(e) => e.key === "Enter" || e.key === " " ? onToggle() : undefined}
          aria-expanded={isOpen}
          aria-controls={item.id}
        >
          <div className="avatar-image avatar-lg me-3">
            <Image
              className="img-fluid rounded-2"
              width={48}
              height={48}
              src={item.avatarSrc}
              alt={item.avatarAlt ?? "avatar image"}
            />
          </div>
          <div>
            <p className="mb-0">{item.title}</p>
            {item.subtitle && (
              <p className="fs-12 mb-0 mt-1">{item.subtitle}</p>
            )}
          </div>
        </div>
      </h2>
      <div
        id={item.id}
        className={`accordion-collapse collapse${isOpen ? " show" : ""}`}
        role="region"
        aria-labelledby={`heading-${item.id}`}
      >
        <div className="accordion-body">{item.content}</div>
      </div>
    </div>
  );
}

export default function AccordionBorderBox({
  id,
  items,
  defaultOpenId,
}: AccordionBorderBoxProps) {
  const [openId, setOpenId] = useState<string | null>(
    defaultOpenId ?? null
  );

  const handleToggle = (itemId: string) => {
    setOpenId((prev) => (prev === itemId ? null : itemId));
  };

  return (
    <div className="accordion accordion-border-box" id={id}>
      {items.map((item) => (
        <AccordionAvatarItemComponent
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={() => handleToggle(item.id)}
        />
      ))}
    </div>
  );
}