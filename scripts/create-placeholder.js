"use strict";

import fs from "fs";
import path from "path";

// Create a simple placeholder image for categories without images
// Using Node Canvas or any image generation library would be better,
// but for now a simple colored square will do
const placeholderSvg = `
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#f9f9f9"/>
  <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#cccccc" text-anchor="middle" dominant-baseline="middle">Category</text>
</svg>
`;

// Save the SVG
const publicDir = path.join(process.cwd(), "public");
fs.writeFileSync(
  path.join(publicDir, "placeholder-category.svg"),
  placeholderSvg
);

console.log("Placeholder image created successfully");
