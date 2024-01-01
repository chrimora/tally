import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-12 text-center p-8">
      <Link href="/" className="inline-block mx-auto">
        <Image
          src="/tally/images/logo.png"
          alt="tally logo"
          height="200"
          width="200"
        />
      </Link>
      <div className="text-9xl font-semi-bold text-primary-light dark:text-primary-dark">
        <Link href="/">tally</Link>
      </div>
      <div className="max-w-md mx-auto">
        Welcome to tally, your ultimate destination for hassle-free score
        tracking!
        <br />
        <br />
        Our user-friendly platform is designed to make scorekeeping a breeze,
        ensuring that you can focus on the excitement of the game rather than
        the numbers. With tally, you can effortlessly record scores and manage
        multiple games.
        <br />
        <br />
        It&apos;s time to score big with tally!
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
