"use client";

import { useState, ReactNode } from "react";
import styles from "./ExpandableSection.module.css";

interface ExpandableSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  icon?: string;
  className?: string;
}

export default function ExpandableSection({
  title,
  children,
  defaultOpen = false,
  icon,
  className,
}: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <button
        className={styles.header}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <svg
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.title}>{title}</span>
      </button>

      <div
        className={`${styles.content} ${isOpen ? styles.contentOpen : ""}`}
      >
        <div className={styles.contentInner}>{children}</div>
      </div>
    </div>
  );
}

