import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Canvas from "components/canvas";
import PromptForm from "components/prompt-form";
import Dropzone from "components/dropzone";
import Download from "components/download";
import { XCircle as StartOverIcon } from "lucide-react";
import { Code as CodeIcon } from "lucide-react";
import { Rocket as RocketIcon } from "lucide-react";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [userUploadedImage, setUserUploadedImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const prevPrediction = predictions[predictions.length - 1];
    const prevPredictionOutput = prevPrediction?.output
      ? (Array.isArray(prevPrediction.output)
        ? prevPrediction.output[prevPrediction.output.length - 1]
        : prevPrediction.output)
      : null;

    const body = {
      prompt: e.target.prompt.value,
      model: e.target.model.value,
      image: userUploadedImage
        ? await readAsDataURL(userUploadedImage)
        : // only use previous prediction as init image if there's a mask
        maskImage
          ? prevPredictionOutput
          : null,
      mask: maskImage,
    };

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const prediction = await response.json();

    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPredictions(predictions.concat([prediction]));

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(200);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      setPredictions(predictions.concat([prediction]));

      if (prediction.status === "succeeded") {
        setUserUploadedImage(null);
      }
    }
  };

  const startOver = async (e) => {
    e.preventDefault();
    setPredictions([]);
    setError(null);
    setMaskImage(null);
    setUserUploadedImage(null);
  };

  return (
    <div>
      <Head>
        <title>Inpainting with Ideogram v2 &amp; Replicate</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <main className="container p-5 mx-auto">
        <div className="flex flex-row items-center justify-between w-full">
          <img src="/Logo-black.png" className="w-20" />
          <Link href="https://proofofme.fun">
            <button>
              Back to Web
            </button>
          </Link>
        </div>
        <div className="max-w-[min(1024px,100vw-40px)] mx-auto">
          <PromptForm onSubmit={handleSubmit} />
        </div>


        <div className="border-hairline max-w-[min(1024px,100vw-40px)] mx-auto relative">
          <Dropzone
            onImageDropped={setUserUploadedImage}
            predictions={predictions}
            userUploadedImage={userUploadedImage}
          />
          <div
            className="relative flex items-stretch w-full bg-gray-50"
            style={{ maxHeight: "min(768px, 100vw - 40px)", aspectRatio: "4 / 3" }}
          >
            <Canvas
              predictions={predictions}
              userUploadedImage={userUploadedImage}
              onDraw={setMaskImage}
            />
          </div>
        </div>

        <div className="max-w-[min(1024px,100vw-40px)] mx-auto">
          {error && <div className="p-3 mb-5 text-red-700 rounded-md bg-red-50">{error}</div>}

          <div className="text-center">
            {((predictions.length > 0 &&
              predictions[predictions.length - 1].output) ||
              maskImage ||
              userUploadedImage) && (
                <button className="lil-button" onClick={startOver}>
                  <StartOverIcon className="icon" />
                  Start over
                </button>
              )}

            <Download predictions={predictions} />
          </div>
        </div>
      </main>
    </div>
  );
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsDataURL(file);
  });
}
