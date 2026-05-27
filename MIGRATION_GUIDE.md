# WiseCheck UI Integration & Migration Guide

This document outlines the step-by-step roadmap to migrate the beautiful new UI elements from `wisecheck_ui` (TanStack/Vite) into `wisecheck` (Next.js App Router) and wire them up to the existing Supabase PostgreSQL backend.

---

## 1. Directory Structure Mapping

To replace the old Next.js UI while preserving Next.js routing, page loading speeds, and server-side authentication, you should place the UI components into their respective Next.js paths:

| Frontend View (`wisecheck_ui`) | Target Next.js Route (`wisecheck`) | Component Code Placement |
|:---|:---|:---|
| **Overview (Dashboard)** | `wisecheck/app/(app)/dashboard` | `app/(app)/dashboard/DashboardClient.tsx` |
| **Borrowed View** | `wisecheck/app/(app)/borrowed` | `app/(app)/borrowed/BorrowedClient.tsx` |
| **Lended View** | `wisecheck/app/(app)/lended` | `app/(app)/lended/LendedClient.tsx` |
| **Budget View** | `wisecheck/app/(app)/budget` | `app/(app)/budget/BudgetClient.tsx` |
| **Plans View** | `wisecheck/app/(app)/plans` | `app/(app)/plans/PlansClient.tsx` |

---

## 2. Step 1: Install Required Dependencies

Since the new UI uses modern premium micro-animations, fonts, and tools, you need to install their corresponding packages inside the Next.js `wisecheck` project directory:

```bash
cd c:\Users\acer\OneDrive\Desktop\Wisecheck\wisecheck
npm install clsx tailwind-merge date-fns lottie-react sonner embla-carousel-react vaul
```

---

## 3. Step 2: Merge the Tailwind CSS Theme

The new frontend contains a vibrant oklch design system with dark modes, glassmorphism, and custom gradient shadows. We will integrate this into the Next.js `wisecheck/app/globals.css` file:

```css
@import "tailwindcss";

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-glow: var(--primary-glow);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
}

:root {
  --radius: 0.875rem;
  --background: oklch(0.985 0.005 240);
  --foreground: oklch(0.18 0.03 260);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.18 0.03 260);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.18 0.03 260);
  --primary: oklch(0.58 0.22 280);
  --primary-foreground: oklch(0.99 0 0);
  --primary-glow: oklch(0.72 0.2 310);
  --secondary: oklch(0.96 0.01 260);
  --secondary-foreground: oklch(0.25 0.04 270);
  --muted: oklch(0.95 0.01 260);
  --muted-foreground: oklch(0.5 0.03 260);
  --accent: oklch(0.93 0.04 280);
  --accent-foreground: oklch(0.25 0.05 280);
  --destructive: oklch(0.62 0.24 25);
  --destructive-foreground: oklch(0.99 0 0);
  --success: oklch(0.65 0.18 155);
  --warning: oklch(0.75 0.17 75);
  --border: oklch(0.91 0.01 260);
  --input: oklch(0.92 0.01 260);
  --ring: oklch(0.58 0.22 280);

  --gradient-primary: linear-gradient(135deg, var(--primary), var(--primary-glow));
  --gradient-card: linear-gradient(145deg, oklch(1 0 0), oklch(0.97 0.01 280));
  --shadow-elegant: 0 10px 40px -10px oklch(0.58 0.22 280 / 0.25);
  --shadow-soft: 0 4px 20px -4px oklch(0.2 0.05 260 / 0.08);
}

.dark {
  --background: oklch(0.14 0.02 270);
  --foreground: oklch(0.96 0.01 260);
  --card: oklch(0.19 0.025 270);
  --card-foreground: oklch(0.96 0.01 260);
  --popover: oklch(0.19 0.025 270);
  --popover-foreground: oklch(0.96 0.01 260);
  --primary: oklch(0.72 0.2 290);
  --primary-foreground: oklch(0.14 0.02 270);
  --primary-glow: oklch(0.78 0.18 320);
  --secondary: oklch(0.24 0.03 270);
  --secondary-foreground: oklch(0.96 0.01 260);
  --muted: oklch(0.23 0.025 270);
  --muted-foreground: oklch(0.68 0.02 260);
  --accent: oklch(0.3 0.07 290);
  --accent-foreground: oklch(0.96 0.01 260);
  --destructive: oklch(0.65 0.22 25);
  --destructive-foreground: oklch(0.99 0 0);
  --success: oklch(0.7 0.18 155);
  --warning: oklch(0.78 0.17 75);
  --border: oklch(0.28 0.03 270);
  --input: oklch(0.26 0.03 270);
  --ring: oklch(0.72 0.2 290);

  --gradient-primary: linear-gradient(135deg, var(--primary), var(--primary-glow));
  --gradient-card: linear-gradient(145deg, oklch(0.2 0.03 270), oklch(0.17 0.03 280));
  --shadow-elegant: 0 10px 40px -10px oklch(0.72 0.2 290 / 0.35);
  --shadow-soft: 0 4px 20px -4px oklch(0 0 0 / 0.4);
}

@layer base {
  * { border-color: var(--color-border); }
  html, body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
}

@layer utilities {
  .bg-gradient-primary { background: var(--gradient-primary); }
  .bg-gradient-card { background: var(--gradient-card); }
  .shadow-elegant { box-shadow: var(--shadow-elegant); }
  .shadow-soft { box-shadow: var(--shadow-soft); }
  .glass {
    background: color-mix(in oklab, var(--color-card) 70%, transparent);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
}
```

---

## 3. Step 3: Copy Shared Layout Elements & Components

Copy the reusable UI blocks into your `wisecheck/components` directory:

1. **`Onboarding.tsx`** -> Copy to `wisecheck/components/Onboarding.tsx`
2. **`SmoothScroll.tsx`** -> Copy to `wisecheck/components/SmoothScroll.tsx` (using Lenis scroll)
3. **`ThemeToggle.tsx`** -> Copy to `wisecheck/components/ThemeToggle.tsx`
4. **AppSidebar / Navbar conversion**: Combine the new Sidebar (`AppSidebar.tsx`) with the existing layout. In Next.js, the Sidebar remains mounted inside the root `(app)/layout.tsx` so page loads don't destroy sidebar state!

---

## 4. Step 4: Connecting the Mock UI Views to Supabase

The mock UI saves and loads data using standard localstorage states. Let's map how to convert these files to use actual backend actions!

### 🗺️ Data Field Mappings:

#### A. Borrowed Table
* **Mock field** -> **Supabase Database Column**
* `fromWhom` -> `from_person`
* `amount` -> `amount`
* `reason` -> `reason` (nullable string)
* `date` -> `borrowed_on` (date string)
* `returned` -> `is_returned` (boolean)

#### B. Lended Table
* **Mock field** -> **Supabase Database Column**
* `toWhom` -> `to_person`
* `amount` -> `amount`
* `purpose` -> `reason` (nullable string)
* `date` -> `lended_on` (date string)
* `expectedReturn` -> `expected_by` (date string, nullable)
* `returned` -> `is_received` (boolean)

#### C. Plans Table
* **Mock field** -> **Supabase Database Column**
* `type` -> `type` (`"table" | "note" | "checklist"`)
* `title` -> `title`
* `text` -> `content.text` (stored inside `content` JSONB column)
* `items` -> `content.items` (stored inside `content` JSONB column, mapped to `checked` instead of `done`)
* `rows` / `columns` -> `content.rows` / `content.columns` (stored inside `content` JSONB column)

---

### 💻 Code Integration Examples

#### 1. Migrating `BorrowedView.tsx` (Mock) to `BorrowedClient.tsx` (Supabase)

Below is how you should structure the imported `BorrowedClient` using client-side Supabase commands:

```tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownLeft, Plus, Trash2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { Borrowed } from "@/lib/types";

export default function BorrowedClient({ initial }: { initial: Borrowed[] }) {
  const [borrowed, setBorrowed] = useState<Borrowed[]>(initial);
  const [fromPerson, setFromPerson] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const supabase = createClient();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!fromPerson.trim() || !amt) return toast.error("Enter person and amount");

    // Fetch active session user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error("User not authenticated");

    const { data, error } = await supabase
      .from("borrowed")
      .insert({
        user_id: user.id,
        from_person: fromPerson.trim(),
        amount: amt,
        reason: reason.trim() || null,
        borrowed_on: date,
        is_returned: false
      })
      .select("*")
      .single();

    if (error) return toast.error(error.message);

    setBorrowed([data, ...borrowed]);
    toast.success("Borrowed entry added");
    setFromPerson("");
    setAmount("");
    setReason("");
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("borrowed")
      .update({ is_returned: !currentStatus })
      .eq("id", id);

    if (error) return toast.error(error.message);

    setBorrowed(borrowed.map((b) => b.id === id ? { ...b, is_returned: !currentStatus } : b));
    toast.success("Status updated");
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("borrowed")
      .delete()
      .eq("id", id);

    if (error) return toast.error(error.message);

    setBorrowed(borrowed.filter((b) => b.id !== id));
    toast.success("Entry removed");
  };

  const outstanding = borrowed.filter((b) => !b.is_returned).reduce((s, b) => s + b.amount, 0);

  return (
    // ... Copy the beautiful JSX styling from BorrowedView, updating fields correctly!
  );
}
```

---

#### 2. Migrating `PlansView.tsx` (Mock) to `PlansClient.tsx` (Supabase)

Here is how you handle the JSONB structure of the dynamic plans (Checklists, Tables, Notes):

```tsx
"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plan } from "@/lib/types";
import { toast } from "sonner";

export default function PlansClient({ initial }: { initial: Plan[] }) {
  const [plans, setPlans] = useState<Plan[]>(initial);
  const supabase = createClient();

  const handleCreatePlan = async (title: string, type: "table" | "note" | "checklist") => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Initial content payload based on type
    const initialContent = 
      type === "checklist" ? { items: [] } :
      type === "table" ? { rows: [] } : { text: "" };

    const { data, error } = await supabase
      .from("plans")
      .insert({
        user_id: user.id,
        title,
        type,
        content: initialContent
      })
      .select("*")
      .single();

    if (error) return toast.error(error.message);
    setPlans([data, ...plans]);
    toast.success("Plan created successfully!");
  };

  const handleUpdateContent = async (planId: string, newContent: any) => {
    const { error } = await supabase
      .from("plans")
      .update({ content: newContent })
      .eq("id", planId);

    if (error) return toast.error(error.message);
    
    setPlans(plans.map(p => p.id === planId ? { ...p, content: newContent } : p));
  };

  const handleDeletePlan = async (id: string) => {
    const { error } = await supabase.from("plans").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setPlans(plans.filter(p => p.id !== id));
    toast.success("Plan deleted");
  };

  return (
    // ... Copy your premium multi-tab editor view JSX and use it!
  );
}
```

---

## 5. Step 5: Integrating Onboarding & Auth State

* **Onboarding state**: The new UI Onboarding modal is triggered via `localStorage.getItem("onboarding-seen")`. Keep this localstorage approach exactly as is, since it tracks client preference, and render it in `app/(app)/layout.tsx` or only on the `app/(app)/dashboard/page.tsx` home page.
* **Authentication / Session state**:
  The new sidebar "Sign Out" button simply clears local storage. You should modify this in the new `AppSidebar.tsx` to properly sign out the user via Supabase auth:
  ```typescript
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = "/auth/login";
  };
  ```

---

## 6. How to Run Locally After Integration

Once integrated, start the Next.js app in the `wisecheck` folder. Next.js handles route loading under `localhost:3000` with the premium design system active:

```bash
npm run dev
```
