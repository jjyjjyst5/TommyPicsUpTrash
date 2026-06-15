import AccountForm from "@/components/admin/AccountForm";
import { getAdminUsername } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const username = await getAdminUsername();
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Account</h1>
      <p className="mt-1 text-sm text-muted">Manage your admin sign-in.</p>
      <div className="mt-6">
        <AccountForm username={username} />
      </div>
    </div>
  );
}
