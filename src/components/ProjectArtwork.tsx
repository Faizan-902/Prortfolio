import Image from "next/image";

export function ProjectArtwork({ kind }: { kind: string }) {
  if (kind === "pulse")
    return (
      <div
        className="absolute inset-0 overflow-clip bg-[#071218] p-7 text-[#d5f2ec]"
        aria-hidden="true"
      >
        <div
          data-artwork-parallax
          className="absolute -inset-6 transform-gpu will-change-transform"
        >
          <Image
            className="object-cover opacity-78"
            src="/images/projects/pulsecheck-glass.webp"
            alt=""
            fill
            sizes="(max-width: 900px) 94vw, 46vw"
            loading="lazy"
          />
          <svg
            className="absolute top-[53%] -left-1/4 h-[130px] w-[150%] text-[#81d4be] opacity-75"
            viewBox="0 0 1000 150"
            fill="none"
          >
            <path
              d="M0 90H230L250 75L270 110L300 18L330 140L360 65L385 90H580L600 75L620 110L650 18L680 140L710 65L735 90H1000"
              stroke="#57ffbf"
              strokeOpacity="0.22"
              strokeWidth="8"
            />
            <path
              d="M0 90H230L250 75L270 110L300 18L330 140L360 65L385 90H580L600 75L620 110L650 18L680 140L710 65L735 90H1000"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              data-loop-anim
              d="M0 90H230L250 75L270 110L300 18L330 140L360 65L385 90H580L600 75L620 110L650 18L680 140L710 65L735 90H1000"
              stroke="#57ffbf"
              strokeWidth="2.5"
              strokeDasharray="170 830"
              className="motion-safe:animate-[ecg-sweep_3.2s_linear_infinite]"
            />
          </svg>
        </div>
        <div className="absolute top-6 right-6 left-6 z-[3] flex justify-between gap-3 font-mono text-[10px]">
          <span className="inline-flex items-center gap-1.5">
            <span
              data-loop-anim
              className="inline-block h-2 w-2 rounded-full bg-[#57ffbf] motion-safe:animate-pulse"
            />
            SYSTEMS OPERATIONAL
          </span>
          <span>OBSERVE / RESPOND</span>
        </div>
        <div className="absolute top-[42%] left-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 font-display text-[clamp(2rem,4vw,4.2rem)] font-semibold tracking-[-0.06em] whitespace-nowrap">
          Pulse<span className="font-normal">Check</span>
          <span className="m-[5px] inline-block h-[9px] w-[9px] rounded-full bg-[#fd7a52]" />
        </div>
        <div className="absolute right-6 bottom-6 left-6 z-[3] flex justify-between gap-3 font-mono text-[10px]">
          <span>API AVAILABILITY &amp; INCIDENT MONITORING</span>
          <span>01 / 04</span>
        </div>
      </div>
    );

  if (kind === "sync")
    return (
      <div
        className="absolute inset-0 overflow-clip bg-[#ded8eb] p-7 text-[#35214e]"
        aria-hidden="true"
      >
        <div className="absolute top-6 right-6 left-6 z-[3] flex justify-between gap-3 font-mono text-[10px]">
          <span>ST / MULTI-VOICE SYNTHESIS</span>
          <span>02 / 04</span>
        </div>
        <div className="absolute top-[20%] left-[7%] z-[2] font-display text-[clamp(2.1rem,4.4vw,4.5rem)] leading-[1.02] tracking-[-0.055em]">
          Stories,
          <br />
          <em className="font-[Georgia,serif] font-normal">in full voice.</em>
        </div>
        <div
          data-artwork-parallax
          className="absolute inset-0 transform-gpu will-change-transform"
        >
          <svg
            className="absolute top-[59%] right-0 left-0 h-[130px] w-full scale-120 -rotate-[7deg]"
            viewBox="0 0 520 130"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="sync-bar-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#806196" />
                <stop offset="100%" stopColor="#423047" />
              </linearGradient>
            </defs>
            {Array.from({ length: 52 }, (_, i) => {
              const pct = Math.round(
                12 + Math.abs(Math.sin(i * 0.62) * Math.cos(i * 0.17)) * 88,
              );
              const h = (pct / 100) * 130;
              const y = (130 - h) / 2;
              return (
                <rect
                  key={i}
                  data-loop-anim
                  x={i * 10}
                  y={y}
                  width={6}
                  height={h}
                  rx={3}
                  fill="url(#sync-bar-grad)"
                  style={{ animationDelay: `${(i % 8) * 140}ms` }}
                  className="origin-center [transform-box:fill-box] motion-safe:animate-[eq-pulse_1.9s_ease-in-out_infinite]"
                />
              );
            })}
          </svg>
        </div>
        <div className="absolute right-6 bottom-6 left-6 z-[3] flex justify-between gap-3 font-mono text-[10px]">
          <span>SYNCTONE</span>
          <span>CHARACTER → VOICE → STORY</span>
        </div>
      </div>
    );

  if (kind === "intern")
    return (
      <div
        className="absolute inset-0 flex items-center justify-center overflow-clip bg-[#bac7d4] p-7 text-[#173a5c]"
        aria-hidden="true"
      >
        <div className="absolute top-6 right-6 left-6 z-[3] flex justify-between gap-3 font-mono text-[10px]">
          <span>HUMANBOT / INTELLIGENT DISCOVERY</span>
          <span>03 / 04</span>
        </div>
        <div
          data-artwork-parallax
          className="absolute inset-[16%] transform-gpu will-change-transform"
        >
          <div
            data-loop-anim
            className="h-full w-full -rotate-[30deg] rounded-full border border-[#718aa166] motion-safe:animate-[spin_28s_linear_infinite]"
          >
            <span className="absolute inset-[10%] [transform:rotateX(60deg)] rounded-full border border-[#718aa188]" />
            <span className="absolute inset-[10%] [transform:rotateY(60deg)] rounded-full border border-[#718aa188]" />
            <span className="absolute -inset-[10%] [transform:rotateY(60deg)_rotateX(60deg)] rounded-full border border-[#718aa188]" />
          </div>
        </div>
        <div className="relative z-[2] font-display text-[clamp(2.4rem,4.8vw,4.8rem)] tracking-[-0.06em]">
          Intern<span className="font-bold">IQ</span>
          <small className="block text-center text-[14px] tracking-[-0.01em]">
            Find your next beginning.
          </small>
        </div>
        <div className="absolute right-6 bottom-6 left-6 z-[3] flex justify-between gap-3 font-mono text-[10px]">
          <span>DISCOVER. VERIFY. RANK.</span>
          <span>BUILT FOR WHAT’S NEXT ↗</span>
        </div>
      </div>
    );

  return (
    <div
      className="absolute inset-0 overflow-clip bg-[#df653f] p-7 text-[#1c1816]"
      aria-hidden="true"
    >
      <div className="absolute top-6 right-6 left-6 z-[3] flex justify-between gap-3 font-mono text-[10px]">
        <span>ENVGUARD / DEVELOPER TOOLING</span>
        <span>04 / 04</span>
      </div>
      <div
        data-env-terminal
        className="absolute top-[24%] right-[10%] left-[10%] -rotate-[5deg] transform-gpu rounded-xl border-8 border-[#303737] bg-[#172021] px-[22px] py-7 font-mono text-[12px] leading-[1.8] text-[#c2cdce] shadow-[15px_25px_0_#82332166] will-change-transform"
      >
        <p className="mb-4 text-[10px]">
          <span>~/your-next-project</span> on main
        </p>
        <p className="mb-4">
          <b className="text-[#e6ab77]">❯</b> envguard check
        </p>
        <p className="mb-4 text-[#a9e0ad]">
          ✓ Required keys present
          <br />✓ Values validated
          <br />✓ Configuration in sync
        </p>
        <p className="text-[11px] text-[#93a3a1]">
          Ship code. Keep the surprises out.
          <span
            data-loop-anim
            className="ml-0.5 inline-block motion-safe:animate-[cursor-blink_1.2s_steps(2,end)_infinite]"
          >
            ▍
          </span>
        </p>
      </div>
      <div className="absolute right-6 bottom-6 left-6 z-[3] flex justify-between gap-3 font-mono text-[10px]">
        <span>PYTHON CLI + SDK</span>
        <span>CONFIGURATION, UNDER CONTROL.</span>
      </div>
    </div>
  );
}
