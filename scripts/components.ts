import fs from "fs";
import path from "path";

interface Component {
  name: string;
  subComponents?: string[];
}

interface ComponentsList {
  [key: string]: Component[];
}

const DOCS_DIRECTORY = path.join(process.cwd(), "./docs");
const COMPONENTS_CONFIG_PATH = path.join(
  process.cwd(),
  "./src/components.json"
);
const OUTPUT_PATH = "src/component-exports.ts";

const componentsConfigFile = fs.readFileSync(COMPONENTS_CONFIG_PATH, "utf8");
const componentsConfig = JSON.parse(componentsConfigFile);

function getMDXFilesFromFolder(folderPath: string) {
  const files = fs.readdirSync(folderPath);
  let mdxFiles: string[] = [];
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const fileStat = fs.statSync(filePath);
    if (fileStat.isFile() && path.extname(file) === ".mdx") {
      mdxFiles.push(filePath);
    } else if (fileStat.isDirectory()) {
      const subdirectoryFiles = getMDXFilesFromFolder(filePath);
      mdxFiles = mdxFiles.concat(subdirectoryFiles);
    }
  });
  return mdxFiles;
}

function getComponents(mdxContent: string) {
  const regex = /<([A-Za-z0-9_.]+)[^>]*\/>/g;
  const matches = mdxContent.match(regex);
  if (!matches) {
    return [];
  }
  const components = matches.map((match) => {
    const componentName = match.replace(/<([A-Za-z0-9_.]+)[^>]*\/>/, "$1");
    return componentName.trim();
  });
  return Array.from(new Set(components));
}

function findComponentsInMDXFiles(files: string[]): ComponentsList {
  const components: ComponentsList = {};

  files.forEach((filePath) => {
    const mdxContent = fs.readFileSync(filePath, "utf-8");
    const comps = getComponents(mdxContent);
    if (comps.length > 0) {
      const fileName = filePath.split("/").pop()?.replace(".mdx", "");
      const final: Component[] = [];
      const categories: { [key: string]: string[] } = {};

      comps.forEach((comp) => {
        if (comp.includes(".")) {
          const split = comp.split(".");
          const category = split[0];
          const categoryComp = split[1];
          if (!categories[category]) {
            categories[category] = [];
          }
          categories[category].push(categoryComp);
        } else {
          // ignore the CodeExamples and CodeImport components,
          // as they are replaced in the docs hub
          let ignore = false;
          for (let i = 0; i < componentsConfig.ignore.length; i++) {
            if (comp === componentsConfig.ignore[i]) {
              ignore = true;
              break;
            }
          }
          if (!ignore) {
            final.push({
              name: comp,
            });
          }
        }
      });

      Object.keys(categories).forEach((cat) => {
        final.push({
          name: cat,
          subComponents: categories[cat],
        });
      });

      components[fileName!] = final;
    }
  });
  return components;
}

function main() {
  const paths = getMDXFilesFromFolder(DOCS_DIRECTORY);
  const components = findComponentsInMDXFiles(paths);

  // Write to components.ts file
  const componentsString = `import dynamic from "next/dynamic";
import { ComponentType } from "react";

export interface ComponentObject { 
  [key: string]: ComponentType<any>;
}

export interface Component {
  name: string;
  import?: ComponentType<any>;
  imports?: ComponentObject;
}

export interface ComponentsList {
  [key: string]: Component[];
}

${Object.keys(components)
  .map((page) => {
    const pageArray = components[page];
    return pageArray
      .map((comp) => {
        if (comp.subComponents && comp.subComponents.length > 0) {
          const subComps = comp.subComponents
            .map((subComp) => {
              let actualCompPath = "";
              for (let i = 0; i < componentsConfig.folders.length; i++) {
                const path = `${componentsConfig.folders[i]}/${subComp}`;
                const actualPath = `${process.cwd()}${path}.tsx`;
                if (fs.existsSync(actualPath)) {
                  actualCompPath = `..${path}`;
                  break;
                }
              }
              if (actualCompPath === "") {
                throw Error(`Can't find ${subComp}`);
              }

              return `${comp.name}.${subComp} = dynamic(
    () => import("${actualCompPath}").then((mod) => mod.${subComp})
  );\n\n`;
            })
            .join("");
          const cat = `const ${comp.name}: ComponentObject= {};\n\n`;
          return cat + subComps;
        } else {
          let actualCompPath = "";
          for (let i = 0; i < componentsConfig.folders.length; i++) {
            const path = `${componentsConfig.folders[i]}/${comp.name}`;
            const actualPath = `${process.cwd()}${path}.tsx`;
            if (fs.existsSync(actualPath)) {
              actualCompPath = `..${path}`;
              break;
            }
          }
          if (actualCompPath === "") {
            throw Error(`Can't find ${comp.name}`);
          }

          return `const ${comp.name} = dynamic(
  () => import("${actualCompPath}").then((mod) => mod.${comp.name})
);\n\n`;
        }
      })
      .join("");
  })
  .join("")}
export const COMPONENTS: ComponentsList = {
  ${Object.keys(components)
    .map((page) => {
      return `${page}: [
  ${components[page].map((comp) => {
    return `  { 
      name: "${comp.name}",
      ${comp.subComponents ? 'imports:' : 'import:'} ${comp.name}
    },`;
  }).join("\n")}
  ]`;
    })
    .join("")}
};
  `;
  fs.writeFileSync(OUTPUT_PATH, componentsString);
}

main();
