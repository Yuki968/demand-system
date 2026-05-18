import { AdminRequirementsClient } from "@/components/admin/admin-client";
import { getRequirements } from "@/repositories/requirementRepository";

export default async function AdminRequirementsPage() {
  const requirements = await getRequirements();
  return <AdminRequirementsClient initialRequirements={requirements} />;
}
