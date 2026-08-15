import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "La Miette Brownie • Luxury Dessert Boutique",
    short_name: "La Miette",
    description:
      "Handcrafted Belgian chocolate brownies, molten cheesecakes, and chunky cookies baked fresh daily in Dhaka.",
    start_url: "/",
    display: "standalone",
    background_color: "#18120C",
    theme_color: "#18120C",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
