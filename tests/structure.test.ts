import path from "path";
import fs from "fs";

describe("Is compatible with the docs hub", () => {
  const docsFolderPath = path.join(__dirname, "../docs");
  const subfolders = fs
    .readdirSync(docsFolderPath)
    .filter((item) =>
      fs.statSync(path.join(docsFolderPath, item)).isDirectory()
    );

  it("should not have nested subfolders", () => {
    const nestedSubfolders = subfolders.filter((subfolder) =>
      fs
        .readdirSync(path.join(docsFolderPath, subfolder))
        .some((item) =>
          fs.statSync(path.join(docsFolderPath, subfolder, item)).isDirectory()
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
    const compPath = path.join(process.cwd(), "./src/components.json");
    const compFile = fs.readFileSync(compPath, "utf8");
    const compJSON = JSON.parse(compFile);
    expect(Array.isArray(compJSON.folders)).toBe(true);
    expect(Array.isArray(compJSON.ignore)).toBe(true);
  });
});
