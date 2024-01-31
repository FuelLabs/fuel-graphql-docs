import { visit } from 'unist-util-visit';

import { GET_UNIONS } from './queries.mjs';
import {
  compareFields,
  fetchItems,
  getAST,
  getHeadings,
  compare,
} from './utils.mjs';

export function getUnionFieldsFromDocs(filepath) {
  const ast = getAST(filepath);
  const headingArgs = {};
  let currentHeading = '';
  const args = {};
  visit(ast, '', (node, _i, parent) => {
    if (node.type === 'heading') {
      currentHeading = node.children[0].value;
    }

    if (node.value === 'Types:') {
      headingArgs[currentHeading] = true;
    }

    if (
      headingArgs[currentHeading] &&
      node.type === 'inlineCode' &&
      parent.type !== 'paragraph'
    ) {
      if (!args[currentHeading]) {
        args[currentHeading] = [];
      }
      args[currentHeading].push({ name: node.value });
    }
  });
  return args;
}

export async function checkUnions() {
  const filepath = 'docs/reference/unions.mdx';
  const unions = await fetchItems(GET_UNIONS, 'UNION');

  const unionNames = unions.map((union) => union.name);
  const headings = await getHeadings(filepath);
  compare(unionNames, headings, [], 'UNIONs');

  const unionsFromDocs = getUnionFieldsFromDocs(filepath);
  compareFields(unions, unionsFromDocs, 'possibleTypes', 'UNION');
}
