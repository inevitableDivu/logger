// import config from "../tsconfig.json";
import path from "path";
import fs from "fs";
import { execSync } from "node:child_process";

const outDir = `${process.cwd()}/dist`;

const filesData = fs.readdirSync(outDir, {
  recursive: true,
  encoding: "utf-8",
  withFileTypes: true,
});

const files = filesData.filter((file) => file.name.endsWith(".js"));
for (const file of files) {
  const filePath = path.join(file.parentPath, file.name);
  console.log(`Minifying ${file.name}...`);
  execSync(`npx uglify-js "${filePath}" -c -m -o "${filePath}"`);
}
console.log("Minification complete.");
