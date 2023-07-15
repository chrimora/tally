import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-12 text-center p-8">
      <Link href="/" className="inline-block mx-auto">
        <Image src="/logo.png" alt="tally logo" height="200" width="200" />
      </Link>
      <div className="text-9xl font-semi-bold text-primary-light dark:text-primary-dark">
        <Link href="/">tally</Link>
      </div>
      <div className="max-w-md mx-auto">
        Welcome to tally a simple app to count scores.
        <br />
        <br />
        This is an exploration into some new technologies that coincides with
        helping to keep scores of a few ongoing games.
      </div>
      <div>
        <Link
          href="/play/game"
          className="p-4 border-2 border-accent-light dark:border-accent-dark hover:bg-accent-light hover:dark:bg-accent-dark hover:bg-accent-light hover:dark:bg-accent-dark"
        >
          Enter
        </Link>
      </div>
    </div>
  );
}
