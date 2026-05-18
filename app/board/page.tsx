import { BoardClient } from "@/components/requirement/board-client";
import { getRequirements } from "@/repositories/requirementRepository";

export default async function BoardPage() {
  const requirements = await getRequirements();
  return <BoardClient initialRequirements={requirements} />;
}
