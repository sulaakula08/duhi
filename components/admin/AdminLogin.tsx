"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { ease } from "@/lib/motion";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(undefined);

    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      router.refresh();
      return;
    }

    const data = await response.json().catch(() => ({}));
    setError(data.error ?? "Не удалось войти.");
    setBusy(false);
  }

  return (
    <div className="flex min-h-[100svh] items-center justify-center px-6 py-16">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: ease.out }}
      >
        <Logo className="text-xl" />
        <h1 className="display-3 mt-8">Панель управления</h1>
        <p className="mt-2 text-[0.92rem] text-muted">
          Введите пароль, чтобы управлять каталогом и промокодами.
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-8">
          <Field label="Пароль" error={error}>
            <Input
              type="password"
              autoComplete="current-password"
              autoFocus
              value={password}
              aria-invalid={Boolean(error)}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(undefined);
              }}
            />
          </Field>

          <Button type="submit" size="lg" disabled={busy} className="mt-8 w-full">
            {busy ? "Проверяем…" : "Войти"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
