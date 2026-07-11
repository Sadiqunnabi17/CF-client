import Link from "next/link";
import { Facebook, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t mt-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="text-lg font-bold text-slate-800">
          FundRise
        </Link>
        <div className="flex gap-4 text-slate-500">
          <a href="https://linkedin.com/in/YOUR_PROFILE" target="_blank" rel="noreferrer">
            <Linkedin className="w-5 h-5 hover:text-slate-800" />
          </a>
          <a href="https://facebook.com/YOUR_PROFILE" target="_blank" rel="noreferrer">
            <Facebook className="w-5 h-5 hover:text-slate-800" />
          </a>
          <a href="https://github.com/Sadiqunnabi17" target="_blank" rel="noreferrer">
            <Github className="w-5 h-5 hover:text-slate-800" />
          </a>
        </div>
      </div>
    </footer>
  );
}