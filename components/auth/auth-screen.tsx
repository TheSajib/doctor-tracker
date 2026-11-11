import { Logo } from "@/components/brand/logo";

export function AuthScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative flex flex-col justify-between overflow-hidden bg-[#062824] px-8 py-8 text-white sm:px-12 sm:py-10 lg:px-14">
        <div className="pointer-events-none absolute -top-40 right-[-8rem] size-[28rem] rounded-full bg-[#1c8f78]/45 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-8rem] left-[-6rem] size-[20rem] rounded-full bg-[#0b3d36] blur-3xl" />
        <div className="relative">
          <Logo light />
        </div>
        <div className="relative max-w-xl py-16 lg:py-0">
          <h1 className="font-serif text-[3.1rem] leading-[1.02] font-medium tracking-tight sm:text-[3.6rem]">
            Care, organised.
            <br />
            Insight, instantly.
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-6 text-white/65">
            Manage doctors, track every patient and see your clinic&apos;s
            health in one calm workspace.
          </p>
        </div>
        <p className="relative text-xs text-white/45">
          © 2026 Doctor Tracker
        </p>
      </section>
      <section className="flex items-center justify-center bg-[radial-gradient(80%_55%_at_100%_0%,rgba(186,230,220,0.7),transparent_58%),#f6fbfa] px-4 py-12">
        {children}
      </section>
    </div>
  );
}
