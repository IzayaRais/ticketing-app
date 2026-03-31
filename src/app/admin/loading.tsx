export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] animate-pulse">
      <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <div className="h-6 w-48 bg-slate-200 rounded mb-6" />
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
            ))}
          </div>
          <div className="space-y-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
