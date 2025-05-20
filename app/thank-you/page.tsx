import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <section className="flex w-full max-w-md flex-col items-center rounded-xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        <svg
          className="mb-6 text-teal-500"
          width={56}
          height={56}
          fill="none"
          viewBox="0 0 56 56"
        >
          <circle cx="28" cy="28" r="28" fill="currentColor" opacity="0.1" />
          <path
            d="M18 29.5l7 7 13-13"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1 className="mb-2 text-center text-2xl font-semibold">
          Thank you for subscribing!
        </h1>
        <p className="mb-6 text-center text-zinc-500 dark:text-zinc-400">
          Your subscription is now active. Enjoy all premium features.
        </p>
        <Link
          href="/"
          className="inline-block rounded bg-teal-500 px-6 py-2 font-medium text-white transition hover:bg-teal-600"
        >
          Go to Dashboard
        </Link>
      </section>
    </main>
  );
}
