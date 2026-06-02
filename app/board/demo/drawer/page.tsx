import { RequirementDemoLayout, RequirementDemoNotes } from "@/components/requirement/demo-shell";
import { RequirementDrawerDemoClient } from "@/components/requirement/requirement-drawer-demo-client";
import { getRequirements } from "@/repositories/requirementRepository";
import { decodeUnicodeEscapes } from "@/lib/text";

export default async function BoardDrawerDemoPage() {
  const requirements = await getRequirements();

  return (
    <RequirementDemoLayout
      activeMode="drawer"
      title={decodeUnicodeEscapes("\u7f51\u9875\u62bd\u5c49\u5f0f\u9700\u6c42\u770b\u677f demo")}
      description={decodeUnicodeEscapes("\u8fd9\u4e2a\u7248\u672c\u662f\u684c\u9762\u7f51\u9875\u754c\u9762\uff1a\u5217\u8868\u9875\u53ea\u5448\u73b0\u9700\u6c42\u5361\u7247\u548c\u7b5b\u9009\u5668\uff0c\u70b9\u51fb\u540e\u4ece\u53f3\u4fa7\u6253\u5f00\u4e00\u4e2a\u5bbd\u5c4f\u8be6\u60c5\u62bd\u5c49\uff0c\u9636\u6bb5\u65f6\u95f4\u7ebf\u4fdd\u7559\u5728\u62bd\u5c49\u5185\u3002")}
    >
      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <RequirementDrawerDemoClient initialRequirements={requirements} />

        <RequirementDemoNotes
          title="Drawer Notes"
          items={[
            decodeUnicodeEscapes("\u7528\u6237\u4ecd\u7136\u505c\u7559\u5728\u5217\u8868\u573a\u666f\uff0c\u76f8\u5f53\u4e8e\u300c\u6253\u5f00\u4e00\u5f20\u6d6e\u5c42\u5361\u300d\uff0c\u4e0d\u4f1a\u77ac\u95f4\u8ff7\u8def\u3002"),
            decodeUnicodeEscapes("\u9002\u5408\u9891\u7e41\u5207\u6362\u591a\u6761\u9700\u6c42\u9010\u4e2a\u67e5\u770b\u7684\u60c5\u51b5\uff0c\u65e0\u9700\u53cd\u590d\u8fdb\u9000\u9875\u9762\u3002"),
            decodeUnicodeEscapes("\u5bf9\u4e0d\u719f\u6089\u770b\u677f\u7684\u540c\u4e8b\u6765\u8bf4\uff0c\u9996\u5c4f\u4fe1\u606f\u538b\u529b\u4f1a\u6bd4\u5f53\u524d\u53cc\u680f\u5c0f\u3002"),
          ]}
        />
      </section>
    </RequirementDemoLayout>
  );
}
