import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="text-4xl">Page not found</h1>
      <p className="mt-3 text-muted">That page does not exist.</p>
      <Link href="/" className="btn btn-primary mt-8">
        Back home
      </Link>
    </main>
  );
}
