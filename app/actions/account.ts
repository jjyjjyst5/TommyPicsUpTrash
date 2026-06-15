"use server";

import { getSession } from "@/lib/auth";
import { updateCredentials } from "@/lib/adminAuth";

export async function updateAccount(_prev: unknown, formData: FormData) {
  if (!(await getSession())) return { error: "Not authorized." };

  const currentPassword = String(formData.get("currentPassword") || "");
  const newUsername = String(formData.get("newUsername") || "").trim();
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!currentPassword) return { error: "Enter your current password to make changes." };
  if (!newUsername && !newPassword) return { error: "Nothing to change." };
  if (newPassword && newPassword !== confirmPassword)
    return { error: "The new passwords don't match." };

  const err = await updateCredentials({
    currentPassword,
    newUsername: newUsername || undefined,
    newPassword: newPassword || undefined,
  });
  if (err) return { error: err };

  return {
    ok: true,
    message: newPassword
      ? "Saved. Use your new password next time you sign in."
      : "Saved.",
  };
}
