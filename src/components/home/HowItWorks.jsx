import { UserPlus, Rocket, HandCoins } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Create an Account", desc: "Sign up as a Supporter or Creator in seconds." },
  { icon: Rocket, title: "Launch or Explore", desc: "Start a campaign or discover ones to support." },
  { icon: HandCoins, title: "Fund & Grow", desc: "Contribute credits and watch ideas come to life." },
];

export default function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10 md:py-16">
      <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <div key={i} className="text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-indigo-100 flex items-center justify-center">
              <s.icon className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-slate-800">{s.title}</h3>
            <p className="text-slate-500 text-sm mt-1">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}