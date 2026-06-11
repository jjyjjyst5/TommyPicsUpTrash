"use client";

import { useActionState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Waves, LogIn } from "lucide-react";
import { login } from "@/app/actions/auth";

function LoginForm() {
  const params = useSearchParams();
  const from = params.get("from") ?? "/admin";
  const [state, action, pending] = useActionState(login, null as { error?: string } | null);

  return (
    <form
      action={action}
      className="w-full max-w-sm rounded-3xl border bg-surface p-8 shadow-lg"
    >
      <div className="flex items-center gap-2 text-primary">
        <Waves className="h-7 w-7" />
        <span className="text-lg font-bold tracking-tight text-foreground">
          Admin sign in
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">Update the counts, gallery, and press.</p>

      <input type="hidden" name="from" value={from} />

      <label className="mt-6 block text-sm font-medium">Username</label>
      <input
        name="username"
        autoComplete="username"
        className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
        required
      />

      <label className="mt-4 block text-sm font-medium">Password</label>
      <input
        name="password"
        type="password"
        autoComplete="current-password"
        className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
        required
      />

      {state?.error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        disabled={pending}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-deep disabled:opacity-60"
      >
        <LogIn className="h-4 w-4" />
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-water flex min-h-screen items-center justify-center p-5">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
