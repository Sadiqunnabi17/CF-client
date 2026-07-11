const stats = [
  { label: "Campaigns Funded", value: "120+" },
  { label: "Active Supporters", value: "3,400+" },
  { label: "Credits Raised", value: "58,000+" },
];

export default function PlatformImpact() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
        Platform Impact in Numbers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-3xl font-bold text-slate-900">{s.value}</p>
            <p className="text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}