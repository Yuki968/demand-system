import Link from "next/link";

import { RequirementDemoLayout, RequirementDemoNotes } from "@/components/requirement/demo-shell";
import { decodeUnicodeEscapes } from "@/lib/text";

const DEMO_CARDS = [
  {
    href: "/board/demo/drawer",
    eyebrow: "Drawer Demo",
    title: decodeUnicodeEscapes("\u62bd\u5c49\u5f0f\u8be6\u60c5"),
    body: decodeUnicodeEscapes("\u7f51\u9875\u5217\u8868\u7559\u5728\u5f53\u524d\u9875\uff0c\u70b9\u51fb\u5361\u7247\u540e\u4ece\u53f3\u4fa7\u6ed1\u51fa\u5bbd\u5c4f\u8be6\u60c5\u62bd\u5c49\u3002"),
  },
  {
    href: "/board/demo/detail-page",
    eyebrow: "Full Page Demo",
    title: decodeUnicodeEscapes("\u65b0\u9875\u9762\u5f0f\u8be6\u60c5"),
    body: decodeUnicodeEscapes("\u7f51\u9875\u5217\u8868\u548c\u8be6\u60c5\u5f7b\u5e95\u5206\u5f00\uff0c\u7528\u6237\u5148\u627e\u5230\u9700\u6c42\uff0c\u518d\u8fdb\u5165\u72ec\u7acb\u8be6\u60c5\u9875\u3002"),
  },
] as const;

export default function BoardDemoLandingPage() {
  return (
    <RequirementDemoLayout
      activeMode="drawer"
      title={decodeUnicodeEscapes("\u9700\u6c42\u770b\u677f\u7f51\u9875\u4ea4\u4e92 demo")}
      description={decodeUnicodeEscapes("\u8fd9\u91cc\u5df2\u6539\u6210\u684c\u9762\u7f51\u9875\u7248 demo\uff0c\u7528\u6765\u5bf9\u6bd4\u300c\u53f3\u4fa7\u62bd\u5c49\u300d\u548c\u300c\u72ec\u7acb\u8be6\u60c5\u9875\u300d\u4e24\u79cd\u6253\u5f00\u65b9\u5f0f\u3002\u5b83\u4e0d\u4f1a\u66ff\u6362\u6216\u7834\u574f\u4f60\u5f53\u524d\u7684 /board \u770b\u677f\u3002")}
    >
      <section className="grid gap-5 lg:grid-cols-2">
        {DEMO_CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-[2rem] border border-white/70 bg-white/80 p-7 shadow-[0_30px_90px_-44px_rgba(15,23,42,0.28)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_38px_110px_-44px_rgba(15,23,42,0.36)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{card.eyebrow}</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 transition group-hover:text-sky-700">
              {card.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{card.body}</p>
            <div className="mt-6 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">
              {decodeUnicodeEscapes("\u8fdb\u5165 demo")}
            </div>
          </Link>
        ))}
      </section>

      <RequirementDemoNotes
        title="Compare Focus"
        items={[
          decodeUnicodeEscapes("\u62bd\u5c49\u5f0f\u66f4\u9002\u5408\u300c\u4e0d\u60f3\u79bb\u5f00\u5217\u8868\uff0c\u53ea\u60f3\u5feb\u901f\u9884\u89c8\u8be6\u60c5\u300d\u7684\u4f7f\u7528\u573a\u666f\u3002"),
          decodeUnicodeEscapes("\u65b0\u9875\u9762\u5f0f\u66f4\u9002\u5408\u300c\u8fdb\u5165\u4e00\u6761\u9700\u6c42\u540e\u5c31\u4e13\u5fc3\u770b\u6e05\u695a\u6240\u6709\u9636\u6bb5\u4fe1\u606f\u300d\u7684\u573a\u666f\u3002"),
          decodeUnicodeEscapes("\u4e24\u4e2a demo \u90fd\u4fdd\u7559\u4e86\u9636\u6bb5\u65f6\u95f4\u7ebf\uff0c\u4e3b\u8981\u5bf9\u6bd4\u7684\u662f\u300c\u8be6\u60c5\u662f\u600e\u4e48\u88ab\u6253\u5f00\u300d\u3002"),
        ]}
      />
    </RequirementDemoLayout>
  );
}
