import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
      <div className="w-16 h-16 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-mono font-bold text-2xl">
        404
      </div>
      <h1 className="text-3xl font-bold font-headline">Editorial Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-md">
        The story or resource you are looking for has been archived, redirected, or does not exist.
      </p>
      <div className="flex items-center gap-3 pt-2">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
        >
          Return to Front Page
        </Link>
        <Link
          href="/admin"
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
        >
          Newsroom Desk
        </Link>
      </div>
    </div>
  );
}
