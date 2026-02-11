import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import Link from "next/link";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

type SearchParams = {
  q?: string;
  cursor?: string;
  dir?: "next" | "prev";
};

export default async function AdminMessages({
  searchParams,
}: {
  searchParams: {
    q?: string;
    cursor?: string;
    dir?: "next" | "prev";
  };
}) {

  const q = (searchParams.q || "").trim();
  const dir: "next" | "prev" =
    searchParams.dir === "prev" ? "prev" : "next";

  const cursorId = searchParams.cursor
    ? Number(searchParams.cursor)
    : undefined;

const where = q
  ? {
      OR: [
        { name: { contains: q } },
        { email: { contains: q } },
        { subject: { contains: q } },
        { message: { contains: q } },
        { phone: { contains: q } },
      ],
    }
  : {};



 const items = await prisma.contactMessage.findMany({
  where,
  orderBy: { createdAt: "desc" },
  take: PAGE_SIZE,
});

 
  const prevCursor = items.at(0)?.id;
  const nextCursor = items.at(-1)?.id;

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Contact Messages</h1>

      {items.length === 0 ? (
        <p className="text-zinc-500">No messages.</p>
      ) : (
        <>
          <table className="w-full text-sm border border-zinc-800 rounded-xl overflow-hidden">
            <thead className="bg-zinc-900">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Message</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id} className="border-t border-zinc-800">
                  <td className="p-3">{m.name}</td>
                  <td className="p-3">{m.email}</td>
                  <td className="p-3">{m.subject}</td>
                  <td className="p-3 max-w-[40ch] whitespace-pre-wrap">
                    {m.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-between">
            <Link
              href={`/admin/messages?dir=prev${prevCursor ? `&cursor=${prevCursor}` : ""}`}
              className="border px-3 py-1 rounded"
            >
              ◀ Prev
            </Link>

            <Link
              href={`/admin/messages?dir=next${nextCursor ? `&cursor=${nextCursor}` : ""}`}
              className="border px-3 py-1 rounded"
            >
              Next ▶
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
