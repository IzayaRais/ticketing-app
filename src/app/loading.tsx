export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] animate-pulse">
      <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
        <div className="h-6 w-40 bg-slate-200 rounded-full mb-6" />
        <div className="h-20 w-96 bg-slate-200 rounded-2xl mb-8" />
        <div className="h-5 w-80 bg-slate-200 rounded-lg mb-10" />
        <div className="flex gap-4 mb-12">
          <div className="h-14 w-52 bg-slate-200 rounded-2xl" />
          <div className="h-14 w-40 bg-slate-200 rounded-2xl" />
        </div>
        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200/60">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <div className="h-3 w-20 bg-slate-200 rounded mb-2" />
              <div className="h-7 w-16 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
