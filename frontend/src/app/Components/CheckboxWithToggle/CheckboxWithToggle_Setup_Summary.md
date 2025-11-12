# ☑️ CheckboxWithToggle Component - Setup Summary

## ✅ What Was Created

### **CheckboxWithToggle Component**
📍 Location: `frontend/src/app/Components/CheckboxWithToggle/`

**Files Created:**
- ✅ `CheckboxWithToggle.tsx` - Main React component
- ✅ `CheckboxWithToggle.module.css` - Styling
- ✅ `CheckboxWithToggle_Setup_Summary.md` - This documentation

---

## 🚀 Features Implemented

### Core Features
✅ **Checkbox Toggle** - Check/uncheck to enable/disable  
✅ **Content Control** - Children components enabled/disabled by checkbox  
✅ **Visual Feedback** - Grayed out when disabled  
✅ **Icon Support** - Optional icon next to label  
✅ **Description** - Optional description text  
✅ **Smooth Animation** - Checkmark animates in  
✅ **Wheat Theme** - Matches project styling  

**Perfect for:** Enabling/disabling entire sections like "Frontend", "Backend", etc.

---

## 📖 How to Use

### Import

```tsx
import CheckboxWithToggle from "@/app/Components/CheckboxWithToggle/CheckboxWithToggle";
```

### Basic Usage

```tsx
"use client";

import { useState } from "react";
import CheckboxWithToggle from "@/app/Components/CheckboxWithToggle/CheckboxWithToggle";

function MyPage() {
  const [enableFrontend, setEnableFrontend] = useState(false);

  return (
    <CheckboxWithToggle
      label="Frontend"
      checked={enableFrontend}
      onChange={setEnableFrontend}
    >
      <p>Frontend options will be enabled/disabled</p>
      {/* Your inputs here */}
    </CheckboxWithToggle>
  );
}
```

### With Icon and Description

```tsx
<CheckboxWithToggle
  label="Frontend"
  icon="🎨"
  checked={enableFrontend}
  onChange={setEnableFrontend}
  description="Client-side technologies and frameworks"
>
  {/* Your content here */}
</CheckboxWithToggle>
```

### Real Example: Tech Stack Section

```tsx
const [enableFrontend, setEnableFrontend] = useState(false);
const [language, setLanguage] = useState("");
const [framework, setFramework] = useState("");

<CheckboxWithToggle
  label="Frontend"
  icon="🎨"
  checked={enableFrontend}
  onChange={setEnableFrontend}
  description="Enable to configure frontend technologies"
>
  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
    <TextInput
      value={language}
      onChange={setLanguage}
      placeholder="Language"
      disabled={!enableFrontend}
    />
    <TextInput
      value={framework}
      onChange={setFramework}
      placeholder="Framework"
      disabled={!enableFrontend}
    />
  </div>
</CheckboxWithToggle>
```

---

## 🎯 Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | string | ✅ Yes | - | Checkbox label text |
| `checked` | boolean | ✅ Yes | - | Checked state |
| `onChange` | function | ✅ Yes | - | Callback: `(checked: boolean) => void` |
| `children` | ReactNode | ✅ Yes | - | Content to show (enabled/disabled) |
| `description` | string | ❌ No | - | Description below label |
| `disabled` | boolean | ❌ No | false | Disable entire component |
| `icon` | string | ❌ No | - | Emoji/icon next to label |

---

## 💡 Usage Examples

### Backend Section
```tsx
<CheckboxWithToggle
  label="Backend"
  icon="⚙️"
  checked={enableBackend}
  onChange={setEnableBackend}
  description="Server-side technologies"
>
  <Dropdown options={backendLanguages} value={backendLang} onChange={setBackendLang} />
  <Dropdown options={frameworks} value={backendFW} onChange={setBackendFW} />
</CheckboxWithToggle>
```

### Database Section
```tsx
<CheckboxWithToggle
  label="Database"
  icon="🗄️"
  checked={enableDatabase}
  onChange={setEnableDatabase}
  description="Data storage and management"
>
  <Dropdown options={databases} value={db} onChange={setDb} />
  <TextInput value={connectionString} onChange={setConnectionString} placeholder="Connection string" />
</CheckboxWithToggle>
```

### Optional Features
```tsx
<CheckboxWithToggle
  label="Advanced Settings"
  checked={showAdvanced}
  onChange={setShowAdvanced}
>
  <TextInput placeholder="API Key" />
  <TextInput placeholder="Custom Domain" />
  <TextArea placeholder="Additional configuration..." />
</CheckboxWithToggle>
```

---

## 🎨 Visual Behavior

### Unchecked State
- ☐ Empty checkbox
- Content is **grayed out** (50% opacity)
- Content is **not interactive** (pointer-events disabled)
- Hover changes border to brown

### Checked State
- ☑️ Green checkbox with white checkmark
- Content is **full color**
- Content is **interactive**
- Checkmark animates in with bounce

### Disabled State
- Entire component faded
- Not clickable

---

## 🎯 Key Feature: Content Control

**The magic:** When checkbox is unchecked, children are still **visible but disabled**!

**Why this is better:**
- ✅ Users see what fields will be available
- ✅ Better UX than hiding fields completely
- ✅ Clear visual hierarchy
- ✅ No surprises when enabling sections

---

## ✨ Summary

Perfect for grouping related inputs with a master toggle. Clean, intuitive, and matches your project theme!

**Use it for all your tech stack sections! 🚀**

