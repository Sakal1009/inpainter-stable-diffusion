import Head from "next/head";
import Link from "next/link";

export default function About() {
  return (
    <div className="max-w-[512px] mx-auto p-10 bg-white rounded-lg">
      <Head>
        <title>Inpainting with AI, powered by Replicate</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <p className="pb-5 text-lg">
        <strong>Inpainting</strong> is the process of using AI image generation models to erase and repaint parts of existing images. This{" "}
        demo{" "}uses the{" "}Proof of Me API{" "}
        machine learning models to inpaint images right in your browser.
      </p>

      <Link href="/paint">
        <video autoPlay loop muted playsInline className="w-full cursor-pointer">
          <source src="/cherries-oranges-bananas.mp4" />
        </video>
      </Link>

      <Link href="/paint">
        <a className="block py-3 mt-10 text-center text-white bg-black rounded-md">
          Start painting
        </a>
      </Link>
    </div>
  );
}
