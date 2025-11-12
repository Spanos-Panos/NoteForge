"use client";

import { useState } from "react";
import Dropdown, { DropdownOption } from "../Dropdown/Dropdown";
import styles from "./TechStackField.module.css";

export interface FieldConfig {
  id: string;
  label: string; // Label for this specific field
  placeholder: string;
  options: DropdownOption[];
  width?: string;
  className?: string;
}

export interface FieldState {
  value: string;
  enabled: boolean; // Each field has its own checkbox
}

interface TechStackFieldProps {
  label: string;
  icon?: string;
  checked: boolean; // Master checkbox
  onToggle: (checked: boolean) => void;
  fields: FieldConfig[];
  fieldStates: Record<string, FieldState>; // { language: { value: "TypeScript", enabled: true } }
  onFieldStatesChange: (states: Record<string, FieldState>) => void;
  checkboxPosition?: "left" | "right";
  layout?: "horizontal" | "vertical"; // NEW: Choose layout
  description?: string;
  disabled?: boolean;
  collapsedMessage?: string | null; // Custom message when collapsed, null = hide
  showCollapsedMessage?: boolean; // Show/hide collapsed message
  columns?: number; // Number of columns for grid layout
  rows?: number; // Number of rows for grid layout
  gridGap?: string; // Gap between fields (default: "16px")
}

export default function TechStackField({
  label,
  icon,
  checked,
  onToggle,
  fields = [], // Default to empty array to prevent map error
  fieldStates,
  onFieldStatesChange,
  checkboxPosition = "left",
  layout = "horizontal",
  description,
  disabled = false,
  collapsedMessage = null,
  showCollapsedMessage = false,
  columns,
  rows,
  gridGap = "16px",
}: TechStackFieldProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate grid template based on columns/rows
  const getGridStyle = () => {
    if (layout === "vertical") {
      return { display: "flex", flexDirection: "column" as const, gap: gridGap };
    }

    if (columns) {
      return {
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: gridGap,
      };
    }

    if (rows) {
      const cols = Math.ceil(fields.length / rows);
      return {
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: gridGap,
      };
    }

    // Default: flex wrap
    return { display: "flex", flexWrap: "wrap" as const, gap: gridGap };
  };

  const handleFieldValueChange = (fieldId: string, value: string) => {
    const newStates = {
      ...fieldStates,
      [fieldId]: {
        ...fieldStates[fieldId],
        value: value
      }
    };
    onFieldStatesChange(newStates);
  };

  const handleFieldToggle = (fieldId: string, enabled: boolean) => {
    const newStates = {
      ...fieldStates,
      [fieldId]: {
        ...fieldStates[fieldId],
        enabled: enabled
      }
    };
    onFieldStatesChange(newStates);
  };

  const toggleExpand = () => {
    if (checked) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={`${styles.container} ${disabled ? styles.containerDisabled : ""}`}>
      {/* Header Row: Checkbox + Label + Arrow Button */}
      <div className={styles.headerRow}>
        {checkboxPosition === "left" && (
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => onToggle(e.target.checked)}
              disabled={disabled}
              className={styles.checkbox}
            />
            <span className={styles.checkboxCustom}>
              {checked && <span className={styles.checkmark}>✓</span>}
            </span>
          </label>
        )}

        <div className={styles.labelWrapper}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <span className={styles.label}>{label}</span>
        </div>

        {/* Arrow Button - only shows when checked */}
        {checked && (
          <button
            type="button"
            className={styles.expandButton}
            onClick={toggleExpand}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <svg
              className={`${styles.expandArrow} ${isExpanded ? styles.expandArrowOpen : ""}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        {checkboxPosition === "right" && (
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => onToggle(e.target.checked)}
              disabled={disabled}
              className={styles.checkbox}
            />
            <span className={styles.checkboxCustom}>
              {checked && <span className={styles.checkmark}>✓</span>}
            </span>
          </label>
        )}
      </div>

      {description && (
        <p className={styles.description}>{description}</p>
      )}

      {/* Fields Container - appears when expanded */}
      {checked && isExpanded && fields && fields.length > 0 && (
        <div 
          className={styles.fieldsContainer}
          style={getGridStyle()}
        >
          {fields.map((field) => {
            const fieldState = fieldStates?.[field.id] || { value: "", enabled: false };
            
            return (
              <div
                key={field.id}
                className={`${styles.fieldItem} ${field.className || ""}`}
                style={{ width: field.width || "auto" }}
                data-field-id={field.id}
              >
                <div className={styles.fieldHeader}>
                  <label className={styles.fieldCheckboxLabel}>
                    <input
                      type="checkbox"
                      checked={fieldState.enabled}
                      onChange={(e) => handleFieldToggle(field.id, e.target.checked)}
                      className={styles.fieldCheckbox}
                    />
                    <span className={styles.fieldCheckboxCustom}>
                      {fieldState.enabled && <span className={styles.fieldCheckmark}>✓</span>}
                    </span>
                    <span className={styles.fieldLabel}>{field.label}</span>
                  </label>
                </div>

                <Dropdown
                  value={fieldState.value}
                  onChange={(value) => handleFieldValueChange(field.id, value)}
                  options={field.options}
                  placeholder={field.placeholder}
                  disabled={!fieldState.enabled}
                  allowCustom={false}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Placeholder when not expanded */}
      {checked && !isExpanded && showCollapsedMessage && (
        <div className={styles.collapsedHint}>
          {collapsedMessage || "Click arrow to configure →"}
        </div>
      )}
    </div>
  );
}
