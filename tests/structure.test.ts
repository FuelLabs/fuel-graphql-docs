import path from "path";
import fs from "fs";

const DOCS_DIRECTORY = path.join(__dirname, "../docs");
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
          checkFile(subFilepath)
        });
      } else {
        checkFile(filepath);
      }
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
        const path = `${compJSON.folders[i]}/${comp.includes(".") ? comp.split(".").pop()! : comp}`;
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
