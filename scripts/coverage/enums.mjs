import { visit } from 'unist-util-visit';

import { GET_ENUMS } from './queries.mjs';
import {
  fetchItems,
  compare,
  getHeadings,
  getAST,
  compareFields,
} from './utils.mjs';

const enumExceptions = ['__DirectiveLocation', '__TypeKind'];

export function getEnumValuesFromDocs(filepath) {
  const ast = getAST(filepath);
  let currentHeading;
  const args = {};
  visit(ast, '', (node, _i, parent) => {
    if (node.type === 'heading') {
      currentHeading = node.children[0].value;
    } else if (
      currentHeading &&
      currentHeading !== node.value &&
      node.type === 'inlineCode' &&
      parent.children[0].value === node.value &&
      parent.children[1]
    ) {
      if (!args[currentHeading]) {
        args[currentHeading] = [];
      }
      args[currentHeading].push({ name: node.value });
    }
  });
  return args;
}

export async function checkEnums() {
  const filepath = 'docs/reference/enums.mdx';
  const rawEnums = await fetchItems(GET_ENUMS, 'ENUM');
  const enums = rawEnums.filter((item) => !enumExceptions.includes(item.name));
  const names = enums.map((item) => item.name);
  const headings = await getHeadings(filepath);
  compare(names, headings, enumExceptions, `ENUMs`);

  const fieldsFromDocs = getEnumValuesFromDocs(filepath);
  compareFields(enums, fieldsFromDocs, 'enumValues', 'ENUM');
}
