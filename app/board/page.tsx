import { BoardClient } from "@/components/requirement/board-client";
import { getStaticRequirements } from "@/lib/static-requirements";

export default function BoardPage() {
  return <BoardClient initialRequirements={getStaticRequirements()} />;
}
