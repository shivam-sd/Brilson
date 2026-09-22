const bar = "animate-pulse rounded-md bg-white/[0.08] motion-reduce:animate-none";

export default function ProfileCardSkeleton() {
  return (
    <div
      role="status"
      className="overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-b from-[#0a1016] to-[#03060a]"
    >
      <span className="sr-only">Loading profile…</span>
      <div className="relative h-[300px] bg-white/[0.04] sm:h-[340px]">
        <div className={`${bar} absolute bottom-0 left-1/2 h-[124px] w-[124px] -translate-x-1/2 translate-y-5 rounded-full sm:h-[134px] sm:w-[134px]`} />
      </div>
      <div className="flex flex-col items-center gap-3 px-6 pb-6 pt-10">
        <div className={`${bar} h-8 w-52`} />
        <div className={`${bar} h-4 w-64 max-w-full`} />
        <div className={`${bar} h-4 w-40`} />
        <div className="mt-3 grid w-full grid-cols-2 gap-2 min-[420px]:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`${bar} h-[68px] rounded-xl`} />
          ))}
        </div>
        <div className="mt-3 flex gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`${bar} h-10 w-10 rounded-full`} />
          ))}
        </div>
      </div>
    </div>
  );
}
