import { RequirementDemoLayout, RequirementDemoNotes } from "@/components/requirement/demo-shell";
import { RequirementDetailPageDemoList } from "@/components/requirement/requirement-detail-page-demo-list";
import { decodeUnicodeEscapes } from "@/lib/text";
import { getRequirements } from "@/repositories/requirementRepository";

export default async function BoardDetailPageDemoListPage() {
  const requirements = await getRequirements();

  return (
    <RequirementDemoLayout
      activeMode="detail-page"
      title={decodeUnicodeEscapes("\u7f51\u9875\u65b0\u9875\u9762\u5f0f\u9700\u6c42\u770b\u677f demo")}
      description={decodeUnicodeEscapes("\u8fd9\u4e2a\u7248\u672c\u4e5f\u662f\u684c\u9762\u7f51\u9875\u754c\u9762\uff1a\u9996\u9875\u53ea\u653e\u9700\u6c42\u5361\u7247\u5217\u8868\uff0c\u70b9\u51fb\u540e\u8fdb\u5165\u4e00\u4e2a\u72ec\u7acb\u7684\u7f51\u9875\u8be6\u60c5\u9875\uff0c\u5728\u90a3\u4e00\u9875\u4e13\u5fc3\u770b\u9636\u6bb5\u65f6\u95f4\u7ebf\u548c\u5b8c\u6574\u5b57\u6bb5\u3002")}
    >
      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <RequirementDetailPageDemoList initialRequirements={requirements} />

        <RequirementDemoNotes
          title="Page Notes"
          items={[
            decodeUnicodeEscapes("\u8fd9\u79cd\u65b9\u5f0f\u662f\u6807\u51c6\u7f51\u9875\u7684\u300c\u5217\u8868\u9875 -> \u8be6\u60c5\u9875\u300d\u8def\u5f84\uff0c\u5bf9\u65b0\u540c\u4e8b\u6700\u5bb9\u6613\u7406\u89e3\u3002"),
            decodeUnicodeEscapes("\u8fdb\u5165\u8be6\u60c5\u540e\uff0c\u89c6\u89c9\u7126\u70b9\u4f1a\u5b8c\u5168\u96c6\u4e2d\u5728\u5355\u4e00\u6761\u9700\u6c42\uff0c\u7279\u522b\u9002\u5408\u8bb2\u89e3\u548c\u6c47\u62a5\u573a\u666f\u3002"),
            decodeUnicodeEscapes("\u6210\u672c\u662f\u7528\u6237\u8981\u591a\u4e00\u6b65\u8fdb\u5165\u4e0e\u8fd4\u56de\uff0c\u4f46\u4fe1\u606f\u89c4\u5212\u4f1a\u66f4\u76f4\u89c2\u3002"),
          ]}
        />
      </section>
    </RequirementDemoLayout>
  );
}
