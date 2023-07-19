import path from "path";
import fs from "fs"

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
})