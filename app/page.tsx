import { AnimatedAIChat } from "@/components/ui/animated-ai-chat";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <section className="rounded-3xl border border-neutral-200 bg-white p-8">
        <h1 className="text-4xl font-semibold tracking-tight">PresetFolio</h1>
        <p className="mt-2 text-neutral-600">Create your premium portfolio in 3 clicks. Browse presets, personalize, export prompt, deploy.</p>
      </section>
      <AnimatedAIChat />
    </main>
  );
}
