import { UserPlus, Rocket, HandCoins } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Create an Account", desc: "Sign up as a Supporter or Creator in seconds." },
  { icon: Rocket, title: "Launch or Explore", desc: "Start a campaign or discover ones to support." },
  { icon: HandCoins, title: "Fund & Grow", desc: "Contribute credits and watch ideas come to life." },
];

export default function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <div key={i} className="text-center">
            <s.icon className="w-10 h-10 mx-auto text-slate-800 mb-3" />
            <h3 className="font-semibold text-slate-800">{s.title}</h3>
            <p className="text-slate-500 text-sm mt-1">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}