import { useState } from "react";
import sample from "lodash/sample";

const samplePrompts = [
  "a gentleman otter in a 19th century portrait",
  "bowl of ramen in the style of a comic book",
  "flower field drawn by Jean-Jacques Sempé",
  "illustration of a taxi cab in the style of r crumb",
  "multicolor hyperspace",
  "painting of fruit on a table in the style of Raimonds Staprans",
  "pencil sketch of robots playing poker",
  "photo of an astronaut riding a horse",
];

export default function PromptForm(props) {
  const [prompt] = useState(sample(samplePrompts));

  return (
    <form
      onSubmit={props.onSubmit}
      className="py-5 duration-700 animate-in fade-in"
    >
      <div className="flex max-w-[1024px]">
        <input
          type="text"
          defaultValue={prompt}
          name="prompt"
          placeholder="Enter a prompt..."
          className="flex-grow block w-full border-r-0 rounded-l-md"
        />
        <select
          name="model"
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-l border-r-0 border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300"
        >
          <option value="ideogram-ai/ideogram-v2-turbo">PoM API v1.0</option>
          <option value="ideogram-ai/ideogram-v2">PoM API v2.0</option>
        </select>
        <button
          className="flex-none px-4 py-2 text-sm font-medium text-white bg-black rounded-r-md"
          type="submit"
        >
          Generate
        </button>
      </div>
    </form>
  );
}
