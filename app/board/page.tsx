import { BoardClient } from "@/components/requirement/board-client";
import { getRequirements } from "@/repositories/requirementRepository";

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const requirements = await getRequirements();
  const params = await searchParams;

  return <BoardClient initialRequirements={requirements} showBackToAdmin={params.from === "admin"} />;
}
