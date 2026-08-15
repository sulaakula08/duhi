"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { spring, transition } from "@/lib/motion";

const schema = z.object({
  name: z.string().min(2, "Как к вам обращаться?"),
  email: z.string().email("Проверьте адрес почты."),
  subject: z.string().min(3, "Хватит пары слов."),
  message: z.string().min(20, "Чуть подробнее — и мы ответим по делу."),
});

type Values = z.infer<typeof schema>;

export function ContactForm() {
  const reduced = useReducedMotion();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  // Никуда не отправляется: форма проверяет данные и подтверждает локально.
  function onSubmit() {}

  return (
    <div className="min-h-[28rem]">
      <AnimatePresence mode="wait" initial={false}>
        {isSubmitSuccessful ? (
          <motion.div
            key="sent"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition.standard}
            className="flex flex-col items-start gap-5 border-t border-line pt-10"
          >
            <motion.span
              initial={reduced ? false : { scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={spring}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-contrast"
            >
              <Check size={20} aria-hidden="true" />
            </motion.span>
            <h2 className="display-3">Письмо получено.</h2>
            <p role="status" className="max-w-md text-[0.95rem] text-muted">
              Ответим в течение двух рабочих дней. В этой демонстрационной сборке
              ничего никуда не ушло.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={transition.standard}
            className="space-y-7"
          >
            <div className="grid gap-7 sm:grid-cols-2">
              <Field label="Имя" error={errors.name?.message}>
                <Input
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  {...register("name")}
                />
              </Field>
              <Field label="Почта" error={errors.email?.message}>
                <Input
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
              </Field>
            </div>

            <Field label="Тема" error={errors.subject?.message}>
              <Input aria-invalid={Boolean(errors.subject)} {...register("subject")} />
            </Field>

            <Field
              label="Сообщение"
              error={errors.message?.message}
              hint="Что аромат делает сейчас и чего вам от него хотелось бы?"
            >
              <Textarea aria-invalid={Boolean(errors.message)} {...register("message")} />
            </Field>

            <Button type="submit" size="lg">
              Отправить
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
