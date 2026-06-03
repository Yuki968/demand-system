import { AdminLoginPanel } from "@/components/admin/admin-login-panel";
import { AdminRequirementsClient } from "@/components/admin/admin-client";
import { getAdminAuthStatus } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminRequirementsPage() {
  const authStatus = await getAdminAuthStatus();

  if (!authStatus.configured) {
    return (
      <AdminLoginPanel configured={false} errorMessage={authStatus.message} />
    );
  }

  if (!authStatus.authenticated) {
    return <AdminLoginPanel configured={true} errorMessage={null} />;
  }

  return <AdminRequirementsClient />;
}
