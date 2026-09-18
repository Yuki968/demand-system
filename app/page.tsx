import { BoardClient } from "@/components/requirement/board-client";
import { getStaticRequirements } from "@/lib/static-requirements";

export default function HomePage() {
  return <BoardClient initialRequirements={getStaticRequirements()} />;
}
