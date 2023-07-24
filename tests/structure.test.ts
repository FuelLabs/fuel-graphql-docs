import path from "path";
import fs from "fs";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

const DOCS_DIRECTORY = path.join(process.cwd(), "./docs");
const COMP_CONFIG_PATH = path.join(process.cwd(), "./src/components.json");

describe("Is compatible with the docs hub", () => {
  const files = fs.readdirSync(DOCS_DIRECTORY);
  const subfolders = files.filter((item) =>
    fs.statSync(path.join(DOCS_DIRECTORY, item)).isDirectory()
  );

  it("should not have nested subfolders", () => {
    const nestedSubfolders = subfolders.filter((subfolder) =>
      fs
        .readdirSync(path.join(DOCS_DIRECTORY, subfolder))
        .some((item) =>
          fs.statSync(path.join(DOCS_DIRECTORY, subfolder, item)).isDirectory()
        )
    );
    expect(nestedSubfolders).toHaveLength(0);
  });

  it("should have a nav.json file with nav orders", () => {
    const navPath = path.join(process.cwd(), "./src/nav.json");
    const navFile = fs.readFileSync(navPath, "utf8");
    const navJSON = JSON.parse(navFile);
    expect(Array.isArray(navJSON.menu)).toBe(true);
    subfolders.forEach((folder) => {
      expect(Array.isArray(navJSON[folder.replaceAll("-", "_")])).toBe(true);
    });
  });

  it("should have a components.json file", () => {
    const compFile = fs.readFileSync(COMP_CONFIG_PATH, "utf8");
    const compJSON = JSON.parse(compFile);
    expect(Array.isArray(compJSON.folders)).toBe(true);
    expect(Array.isArray(compJSON.ignore)).toBe(true);
  });

  it("component files should have same name as component", () => {
    files.forEach((filename) => {
      const filepath = path.join(DOCS_DIRECTORY, filename);
      if (fs.statSync(filepath).isDirectory()) {
        const subFiles = fs.readdirSync(filepath);
        subFiles.forEach((subFilename) => {
          const subFilepath = path.join(filepath, subFilename);
          checkFile(subFilepath);
        });
      } else {
        checkFile(filepath);
      }
    });
  });

  // Examples.Events.Connect && Examples.Connect is ok
  // Examples.Events.Connect.First is not ok
  it("shouldn't have components nested more than twice", () => {
    let allComponents: string[] = [];
    files.forEach((filename) => {
      const filepath = path.join(DOCS_DIRECTORY, filename);
      if (fs.statSync(filepath).isDirectory()) {
        const subFiles = fs.readdirSync(filepath);
        subFiles.forEach((subFilename) => {
          const subFilepath = path.join(filepath, subFilename);
          const file = fs.readFileSync(subFilepath, "utf8");
          const components = getComponents(file);
          allComponents = [...allComponents, ...components];
        });
      } else {
        const file = fs.readFileSync(filepath, "utf8");
        const components = getComponents(file);
        allComponents = [...allComponents, ...components];
      }
      const cleaned = Array.from(new Set(allComponents));
      cleaned.forEach((compName) => {
        expect(compName.split(".").length < 4);
      });
    });
  });
});

function checkFile(filepath: string) {
  const file = fs.readFileSync(filepath, "utf8");
  const components = getComponents(file);
  const compFile = fs.readFileSync(COMP_CONFIG_PATH, "utf8");
  const compJSON = JSON.parse(compFile);
  components.forEach((comp) => {
    if (!compJSON.ignore.includes(comp)) {
      let actualCompPath = "";
      for (let i = 0; i < compJSON.folders.length; i++) {
        const path = `${compJSON.folders[i]}/${
          comp.includes(".") ? comp.split(".").pop()! : comp
        }`;
        const actualPath = `${process.cwd()}${path}.tsx`;
        if (fs.existsSync(actualPath)) {
          actualCompPath = `..${path}`;
          break;
        }
      }
      expect(actualCompPath).not.toEqual("");
    }
  });
}

function getComponents(mdxContent: string) {
  const components: string[] = [];
  const tree = unified().use(remarkParse).use(remarkMdx).parse(mdxContent);

  visit(tree, "mdxJsxFlowElement", (node) => {
    if (node.name) components.push(node.name);
  });
  return Array.from(new Set(components));
}
