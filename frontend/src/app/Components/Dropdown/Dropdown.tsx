"use client";

import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import styles from "./Dropdown.module.css";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
  category?: string;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  allowCustom?: boolean;
  sortBy?: "alphabetical" | "category" | "custom";
  disabled?: boolean;
  error?: string;
  required?: boolean;
  onClear?: () => void; // Callback when value is cleared
}

export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select or type...",
  allowCustom = false,
  sortBy = "custom",
  disabled = false,
  error,
  required = false,
  onClear,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync input value with prop value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Sort and filter options
  useEffect(() => {
    let sorted = [...options];

    // Sort options
    if (sortBy === "alphabetical") {
      sorted.sort((a, b) => a.label.localeCompare(b.label));
    } else if (sortBy === "category") {
      sorted.sort((a, b) => {
        if (a.category && b.category) {
          return a.category.localeCompare(b.category) || a.label.localeCompare(b.label);
        }
        return 0;
      });
    }

    // IMPORTANT: Don't filter when dropdown just opens
    // Only filter when user is actively typing AND it's not matching the current selection
    if (inputValue && allowCustom && inputValue !== value) {
      sorted = sorted.filter(
        (opt) =>
          opt.label.toLowerCase().includes(inputValue.toLowerCase()) ||
          opt.value.toLowerCase().includes(inputValue.toLowerCase()) ||
          opt.category?.toLowerCase().includes(inputValue.toLowerCase())
      );
    }

    setFilteredOptions(sorted);
    setSelectedIndex(-1);
  }, [inputValue, options, sortBy, allowCustom, value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Only filter, don't update the actual value unless allowCustom is true
    if (allowCustom) {
      setInputValue(newValue);
      onChange(newValue);
    }
    
    setIsOpen(true);
  };

  const handleOptionSelect = (option: DropdownOption) => {
    setInputValue(option.value);
    onChange(option.value);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        inputRef.current?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isOpen && filteredOptions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleOptionSelect(filteredOptions[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
  };

  const handleFocus = () => {
    // When focusing, show all options (don't filter by current value)
    setIsOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  // Group options by category if sortBy is category
  const groupedOptions = () => {
    if (sortBy === "category") {
      const groups: { [key: string]: DropdownOption[] } = {};
      filteredOptions.forEach((opt) => {
        const cat = opt.category || "Other";
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(opt);
      });
      return groups;
    }
    return null;
  };

  const groups = groupedOptions();

  return (
    <div className={styles.dropdownContainer}>
      <div
        className={`${styles.inputWrapper} ${
          isOpen ? styles.open : ""
        } ${error ? styles.error : ""} ${disabled ? styles.disabled : ""}`}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          readOnly={!allowCustom}
          className={styles.input}
          aria-invalid={!!error}
          aria-expanded={isOpen}
        />

        <button
          type="button"
          className={styles.arrowButton}
          onClick={toggleDropdown}
          disabled={disabled}
          aria-label="Toggle dropdown"
          tabIndex={-1}
        >
          <svg
            className={`${styles.arrow} ${isOpen ? styles.arrowUp : ""}`}
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

        {required && !disabled && (
          <span className={styles.requiredIndicator}>*</span>
        )}
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <svg className={styles.errorIcon} viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {isOpen && filteredOptions.length > 0 && (
        <div ref={dropdownRef} className={styles.dropdown}>
          <div className={styles.optionsList}>
            {groups ? (
              // Grouped by category
              Object.entries(groups).map(([category, opts]) => (
                <div key={category} className={styles.categoryGroup}>
                  <div className={styles.categoryHeader}>{category}</div>
                  {opts.map((option, index) => (
                    <div
                      key={`${category}-${index}`}
                      className={`${styles.option} ${
                        option.value === value ? styles.selected : ""
                      }`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleOptionSelect(option);
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      {option.icon && (
                        <span className={styles.optionIcon}>{option.icon}</span>
                      )}
                      <span className={styles.optionLabel}>{option.label}</span>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              // Not grouped
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className={`${styles.option} ${
                    index === selectedIndex || option.value === value
                      ? styles.selected
                      : ""
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleOptionSelect(option);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {option.icon && (
                    <span className={styles.optionIcon}>{option.icon}</span>
                  )}
                  <span className={styles.optionLabel}>{option.label}</span>
                </div>
              ))
            )}
          </div>

          {allowCustom && inputValue && filteredOptions.length === 0 && (
            <div className={styles.noOptions}>
              Press Enter to use <strong>"{inputValue}"</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

