export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] animate-pulse">
      <div className="max-w-2xl mx-auto px-4 pt-32 pb-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <div className="h-5 w-32 bg-slate-200 rounded mb-6" />
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <div className="h-3 w-24 bg-slate-200 rounded mb-1.5" />
                <div className="h-12 w-full bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
          <div className="h-12 w-full bg-slate-200 rounded-xl mt-6" />
        </div>
      </div>
    </div>
  );
}
