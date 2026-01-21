// app/genre/[slug]/page.tsx

export default function Page(props: any) {
  const slug = props?.params?.slug;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Genre: {slug}</h1>
    </main>
  );
}

