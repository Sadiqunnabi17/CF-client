const categories = ["Technology", "Art", "Community", "Health", "Education", "Environment"];

export default function ExploreByCategory() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
          Explore by Category
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <span
              key={cat}
              className="px-5 py-2 bg-white border rounded-full text-slate-700 text-sm font-medium hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}