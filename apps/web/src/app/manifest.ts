import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Devam — The Living Atlas",
    short_name: "Devam",
    description: "Explore the stories, traditions, places, practices, and wisdom of Sanatana Dharma.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#080b18",
    theme_color: "#080b18",
    categories: ["education", "lifestyle", "books"],
    icons: [
      {
        src: "/brand/devam-mark.png",
        sizes: "1600x1600",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
