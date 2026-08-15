import { MaskedLines } from "@/components/ui/MaskedLines";
import { Reveal } from "@/components/ui/Reveal";

export function PageHeader({
  eyebrow,
  lines,
  intro,
}: {
  eyebrow: string;
  lines: string[];
  intro?: string;
}) {
  return (
    <header className="container-x pb-14 pt-36 md:pt-44">
      <p className="label-xs text-accent">{eyebrow}</p>
      <MaskedLines as="h1" immediate lines={lines} className="display-1 mt-5" />
      {intro && (
        <Reveal delay={0.2}>
          <p className="mt-7 max-w-xl text-[1.02rem] text-muted">{intro}</p>
        </Reveal>
      )}
    </header>
  );
}
