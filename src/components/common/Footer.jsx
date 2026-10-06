import { Link } from "react-router-dom";
import Logo from "./Logo";

function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Link to="/" className="inline-block">
              <Logo />
            </Link>

            <p className="mt-3 text-sm text-slate-500">
              Built for easy and smarter queue management.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-600">
            <Link to="/privacy" className="transition hover:text-blue-600">
              Privacy
            </Link>

            <Link to="/terms" className="transition hover:text-blue-600">
              Terms
            </Link>

            <Link to="/support" className="transition hover:text-blue-600">
              Help & Support
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5 text-center">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} QueueLess. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
