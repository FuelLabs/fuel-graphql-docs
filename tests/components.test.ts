import path from "path";
import fs from "fs"
import { EOL } from "os";
import { parse } from "acorn";

describe("Exports components needed in docs", () => {
    const docsFolderPath = path.join(__dirname, "../docs");
    const fileNames = fs.readdirSync(docsFolderPath);
    const components = [];
    
    fileNames.forEach((fileName) => {
        const filePath = path.join(docsFolderPath, fileName);
        if(fs.statSync(filePath).isDirectory()){
            console.log("its a directory")
        } else {
            console.log("fileName", fileName)
            const content = fs.readFileSync(filePath, "utf-8");
            const ast = parse(content, { ecmaVersion: 'latest'});
            console.log("AST", ast)
            // visit, get components

        }
    })
    // const subfolders = fs
    // .readdirSync(docsFolderPath)
    // .filter((item) =>
    //   fs.statSync(path.join(docsFolderPath, item)).isDirectory()
    // );

    // it("should not have nested subfolders", () => {
    //     const nestedSubfolders = subfolders.filter((subfolder) =>
    //       fs
    //         .readdirSync(path.join(docsFolderPath, subfolder))
    //         .some((item) =>
    //           fs.statSync(path.join(docsFolderPath, subfolder, item)).isDirectory()
    //         )
    //     );
    //     expect(nestedSubfolders).toHaveLength(0);
    //   });
})