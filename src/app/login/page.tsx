"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/src/services/api";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

// ─── Validação ────────────────────────────────────────────────────────────────

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.email) {
    errors.email = "O e-mail é obrigatório.";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Digite um e-mail válido.";
  }

  if (!data.password) {
    errors.password = "A senha é obrigatória.";
  } else if (data.password.length < 6) {
    errors.password = "A senha deve ter pelo menos 6 caracteres.";
  }

  return errors;
};

// ─── Componente ───────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await api.post("/auth/login", formData);

      if (!response.ok) throw new Error("Credenciais inválidas");

      router.push("/listagem");
    } catch {
      setErrors({ general: "E-mail ou senha incorretos. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {/* Barra de destaque roxa */}
        <div className="h-1 bg-indigo-600" />

        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Bem-vindo de volta
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Entre na sua conta para continuar
            </p>
          </div>

          {/* Erro geral */}
          {errors.general && (
            <div
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
              role="alert"
              aria-live="assertive"
            >
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* E-mail */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                autoComplete="email"
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={!!errors.email}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-offset-0 dark:bg-gray-900 dark:text-white ${
                  errors.email
                    ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 dark:border-gray-600"
                }`}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="mt-1 text-xs text-red-500"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Senha */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Senha
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  aria-invalid={!!errors.password}
                  className={`block w-full rounded-lg border px-3 py-2 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-offset-0 dark:bg-gray-900 dark:text-white ${
                    errors.password
                      ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 dark:border-gray-600"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  className="mt-1 text-xs text-red-500"
                  role="alert"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="mt-2 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Não tem uma conta?{" "}
            <Link
              href="/cadastro"
              className="text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
