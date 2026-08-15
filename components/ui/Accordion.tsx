"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { transition } from "@/lib/motion";

export type AccordionItem = {
  title: string;
  content: ReactNode;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();
  const reduced = useReducedMotion();

  return (
    <div className="border-t border-line">
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.title} className="border-b border-line">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left transition-colors duration-200 hover:text-accent"
              >
                <span className="label-xs">{item.title}</span>
                <Plus
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: isOpen ? "rotate(135deg)" : "rotate(0deg)" }}
                />
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduced ? { duration: 0.01 } : transition.standard}
                  className="overflow-hidden"
                >
                  <div className="pb-6 text-[0.95rem] leading-relaxed text-muted">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
