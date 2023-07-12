import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>
        <Link href="/">
          <Image src="" alt="tally logo" />
        </Link>
      </div>
      <div>
        <Link href="/">tally</Link>
      </div>
      <div>
        Welcome to tally a simple app to count scores.
        <br />
        This is an exploration into some new technologies that coincides with
        helping to keep scores of a few ongoing games.
      </div>
      <div>
        <Link href="/play/game">Go!</Link>
      </div>
    </>
  );
}
