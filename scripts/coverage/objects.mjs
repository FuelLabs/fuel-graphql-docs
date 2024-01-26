import { assert } from 'console';

import { GET_INPUT_OBJECTS, GET_OBJECTS } from './queries.mjs';
import {
  fetchObjects,
  compare,
  getHeadings,
  getArgsOrFields,
  checkIfEqual,
} from './utils.mjs';

const objectExceptions = [
  '__Directive',
  '__EnumValue',
  '__Field',
  '__InputValue',
  '__Schema',
  '__Type',
  'Query',
  'Mutation',
  'Subscription',
  'PageInfo',
];

export async function checkAllObjects() {
  const filepath = 'docs/reference/objects.mdx';
  const headings = await getHeadings(filepath);

  const inputObjects = await fetchObjects(GET_INPUT_OBJECTS, 'INPUT_OBJECT');
  // console.log('INPUT_OBJECTS', inputObjects);
  const inputObjectNames = inputObjects.map((item) => item.name);
  compare(inputObjectNames, headings, [], `INPUT_OBJECTs`);

  const objects = await fetchObjects(GET_OBJECTS, 'OBJECT');
  const objectNames = objects.map((item) => item.name);
  compare(objectNames, headings, objectExceptions, `OBJECTs`);

  const fields = getArgsOrFields(filepath, 'fields:');

  const actual = [...inputObjects, ...objects].filter(
    (item) => !objectExceptions.includes(item.name)
  );
  const extraHeadings = [];
  headings.forEach((item) => {
    if (!actual.map((item) => item.name).includes(item)) {
      extraHeadings.push(item);
    }
  });

  assert(
    extraHeadings.length === 0,
    `EXTRA HEADINGS IN OBJECTS: ${extraHeadings}`
  );

  const wrongFields = [];
  actual.forEach((item) => {
    if (item.fields) {
      const fieldsFromDocs = fields[item.name];
      if (!fieldsFromDocs) {
        console.log('NO FIELDS IN DOCS:', item.name);
        wrongFields.push(item.name);
      } else {
        const fieldsMatch = checkIfEqual(item.fields, fieldsFromDocs);
        if (!fieldsMatch) {
          console.log(
            `DIFF FIELDS IN DOCS FOR ${item.name}:`,
            item.fields,
            fieldsFromDocs
          );
          wrongFields.push(item.name);
        }
      }
    }
  });
  assert(wrongFields.length === 0, `WRONG FIELDS IN OBJECTS: ${wrongFields}`);
}
