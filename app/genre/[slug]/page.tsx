export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Genre: {slug}</h1>
    </main>
  );
}

type PageProps<T> = {
  params: Promise<T>;
};

export default async function Page(props: PageProps<{ id: string }>) {
  const { id } = await props.params;
}
