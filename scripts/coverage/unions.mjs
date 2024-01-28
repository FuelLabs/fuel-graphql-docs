import { assert } from 'console';
import { visit } from 'unist-util-visit';

import { GET_UNIONS } from './queries.mjs';
import {
  checkIfEqual,
  request,
  getAST,
  getHeadings,
  compare,
} from './utils.mjs';

async function fetchUnions(query, kind) {
  try {
    const response = await request(query);
    const objects = response.data.__schema.types
      .filter((type) => type.kind === kind)
      .filter(
        (type) =>
          !type.name.endsWith('Connection') && !type.name.endsWith('Edge')
      );
    return objects;
  } catch (error) {
    console.error(`Error fetching ${kind} names:`, error);
    return [];
  }
}

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

function checkUnionFields(unions, unionsFromDocs) {
  const wrongFields = [];
  unions.forEach((item) => {
    if (item.possibleTypes) {
      const fieldsFromDocs = unionsFromDocs[item.name];
      if (!fieldsFromDocs) {
        console.log('NO FIELDS IN DOCS:', item.name);
        wrongFields.push(item.name);
      } else {
        const fieldsMatch = checkIfEqual(item.possibleTypes, fieldsFromDocs);
        if (!fieldsMatch) {
          console.log(
            `DIFF FIELDS IN DOCS FOR ${item.name}:`,
            item.possibleTypes,
            fieldsFromDocs
          );
          wrongFields.push(item.name);
        }
      }
    }
  });
  assert(wrongFields.length === 0, `WRONG FIELDS IN UNIONS: ${wrongFields}`);
}

export async function checkUnions() {
  const filepath = 'docs/reference/unions.mdx';
  const unions = await fetchUnions(GET_UNIONS, 'UNION');

  const unionNames = unions.map((union) => union.name);
  const headings = await getHeadings(filepath);
  compare(unionNames, headings, [], 'UNIONs');

  const unionsFromDocs = getUnionFieldsFromDocs(filepath);
  checkUnionFields(unions, unionsFromDocs);
}
