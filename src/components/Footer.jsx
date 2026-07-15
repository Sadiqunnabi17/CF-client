import Link from "next/link";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t mt-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <Link href="/" className="text-lg font-bold text-indigo-600">
            FundRise
          </Link>
          <p className="text-slate-500 text-sm mt-2">
            Empowering ideas through community-driven crowdfunding.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-slate-800 mb-2 text-sm">Quick Links</h3>
          <ul className="text-slate-500 text-sm space-y-1">
            <li><Link href="/" className="hover:text-indigo-600">Home</Link></li>
            <li><Link href="/explore" className="hover:text-indigo-600">Explore Campaigns</Link></li>
            <li><Link href="/register" className="hover:text-indigo-600">Become a Creator</Link></li>
            <li><Link href="/login" className="hover:text-indigo-600">Login</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-slate-800 mb-2 text-sm">Connect</h3>
          <div className="flex gap-4 text-slate-500">
            <a href="https://linkedin.com/in/YOUR_PROFILE" target="_blank" rel="noreferrer">
              <FaLinkedin className="w-5 h-5 hover:text-indigo-600" />
            </a>
            <a href="https://facebook.com/YOUR_PROFILE" target="_blank" rel="noreferrer">
              <FaFacebook className="w-5 h-5 hover:text-indigo-600" />
            </a>
            <a href="https://github.com/sadiqunnabi17" target="_blank" rel="noreferrer">
              <FaGithub className="w-5 h-5 hover:text-indigo-600" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t text-center text-xs text-slate-400 py-4">
        © {new Date().getFullYear()} FundRise. Built for Programming Hero Assignment 11.
      </div>
    </footer>
  );
}