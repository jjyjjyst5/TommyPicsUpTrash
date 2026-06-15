"use client";

import { useActionState } from "react";
import { CheckCircle2, KeyRound } from "lucide-react";
import { updateAccount } from "@/app/actions/account";

export default function AccountForm({ username }: { username: string }) {
  const [state, action, pending] = useActionState(
    updateAccount,
    null as { ok?: boolean; error?: string; message?: string } | null
  );

  return (
    <form action={action} className="max-w-lg rounded-3xl border bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-2 text-primary">
        <KeyRound className="h-5 w-5" />
        <h2 className="text-lg font-semibold text-foreground">Sign-in credentials</h2>
      </div>
      <p className="mt-1 text-sm text-muted">
        Change the admin username or password. Your current password is required to confirm
        any change.
      </p>

      <label className="mt-5 block text-sm font-medium">Username</label>
      <input
        name="newUsername"
        defaultValue={username}
        autoComplete="username"
        className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
      />

      <label className="mt-4 block text-sm font-medium">
        New password <span className="font-normal text-muted">(leave blank to keep current)</span>
      </label>
      <input
        name="newPassword"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
      />

      <label className="mt-4 block text-sm font-medium">Confirm new password</label>
      <input
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
      />

      <div className="mt-5 border-t pt-5">
        <label className="block text-sm font-medium">Current password</label>
        <input
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-primary"
        />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-deep disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        {state?.ok && (
          <span className="inline-flex items-center gap-1.5 text-sm text-teal">
            <CheckCircle2 className="h-4 w-4" /> {state.message}
          </span>
        )}
        {state?.error && <span className="text-sm text-red-600">{state.error}</span>}
      </div>
    </form>
  );
}
