import { assert } from 'console';

import { GET_INPUT_OBJECTS, GET_OBJECTS } from './queries.mjs';
import {
  compare,
  getHeadings,
  getArgsOrFields,
  checkIfEqual,
  request,
  getType,
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

// checks to make sure:
// every INPUT_OBJECT and OBJECT from the API is included in the headings in docs/reference/objects.mdx
// there are no headings that are not in the API
// all fields in the API match the fields in the docs
export async function checkAllObjects() {
  const filepath = 'docs/reference/objects.mdx';
  const headings = await getHeadings(filepath);
  const actual = await checkHeadings(headings);
  checkForExtraHeadings(actual, headings);
  checkObjectFields(actual, filepath);
}

async function fetchObjects(query, kind) {
  try {
    const response = await request(query);
    const objects = response.data.__schema.types
      .filter((type) => type.kind === kind)
      .filter(
        (type) =>
          !type.name.endsWith('Connection') && !type.name.endsWith('Edge')
      )
      .map((item) => {
        const newItem = { name: item.name };
        const fields = item.fields || item.inputFields;
        if (fields) {
          newItem.fields = fields.map((field) => ({
            name: field.name,
            type: getType(field.type),
          }));
        }
        return newItem;
      });
    return objects;
  } catch (error) {
    console.error(`Error fetching ${kind} names:`, error);
    return [];
  }
}

async function checkHeadings(headings) {
  const inputObjects = await fetchObjects(GET_INPUT_OBJECTS, 'INPUT_OBJECT');
  const inputObjectNames = inputObjects.map((item) => item.name);
  compare(inputObjectNames, headings, [], `INPUT_OBJECTs`);

  const objects = await fetchObjects(GET_OBJECTS, 'OBJECT');
  const objectNames = objects.map((item) => item.name);
  compare(objectNames, headings, objectExceptions, `OBJECTs`);

  const actual = [...inputObjects, ...objects].filter(
    (item) => !objectExceptions.includes(item.name)
  );
  return actual;
}

function checkForExtraHeadings(actual, headings) {
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
}

function checkObjectFields(actual, filepath) {
  const fields = getArgsOrFields(filepath, 'fields:');
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
