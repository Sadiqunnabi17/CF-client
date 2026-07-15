import Link from "next/link";

const categories = ["Technology", "Art", "Community", "Health", "Education", "Environment"];

export default function ExploreByCategory() {
  return (
    <section className="bg-slate-50 py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
          Explore by Category
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/explore?category=${encodeURIComponent(cat)}`}
              className="px-5 py-2 bg-white border rounded-full text-slate-700 text-sm font-medium hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}