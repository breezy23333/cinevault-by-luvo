// app/dmca/page.tsx
import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-4 text-2xl font-semibold">DMCA Notice</h1>

      <p className="mb-4 text-zinc-400">
        CineVault respects intellectual property rights and complies with the
        Digital Millennium Copyright Act (DMCA).
      </p>

      <p className="mb-4 text-zinc-400">
        To submit a DMCA takedown request, please email:
      </p>

      <a
        href="mailto:dmca@cinevault.app"
        className="text-yellow-400 hover:underline"
      >
        dmca@cinevault.app
      </a>

      <div className="mt-6">
        <Link href="/" className="text-sm text-zinc-400 hover:underline">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
