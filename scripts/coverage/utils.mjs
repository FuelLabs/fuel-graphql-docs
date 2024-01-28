import { assert } from 'console';
import { readFileSync } from 'fs';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

const inputArgExceptions = ['first', 'last', 'after', 'before'];

const headingsExceptions = (heading) => {
  if (heading.startsWith('title: ')) {
    return false;
  }
  if (
    [
      'Queries',
      'Mutations',
      'Subscriptions',
      'Objects',
      'Union Types',
      'Enums',
      'Scalars',
    ].includes(heading)
  ) {
    return false;
  }
  return true;
};

export async function getHeadings(filepath) {
  const file = readFileSync(filepath, 'utf8');
  const processor = unified().use(remarkParse);
  const ast = processor.parse(file);
  const headings = [];
  visit(ast, 'heading', (node) => {
    headings.push(node.children[0].value);
  });
  return headings.filter(headingsExceptions);
}

export async function request(query) {
  const response = await fetch('https://beta-5.fuel.network/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
    }),
  });
  const json = await response.json();
  return json;
}

export async function fetchNames(query, kind) {
  try {
    const response = await request(query);
    const names = response.data.__schema.types
      .filter((type) => type.kind === kind)
      .map((type) => type.name)
      .filter((name) => !name.endsWith('Connection') && !name.endsWith('Edge'));
    return names;
  } catch (error) {
    console.error(`Error fetching ${kind} names:`, error);
    return [];
  }
}

export function compare(actual, headings, exceptions, itemName) {
  const missing = [];
  actual.forEach((item) => {
    const isIncluded = headings.includes(item);
    if (!isIncluded) {
      if (!exceptions.includes(item)) {
        missing.push(item);
      }
    }
  });
  assert(missing.length === 0, `MISSING FROM ${itemName}: ${missing}`);

  if (itemName === 'INPUT_OBJECTs' || itemName === 'OBJECTs') {
    return;
  }

  const extraHeadings = [];
  headings.forEach((item) => {
    if (!actual.includes(item)) {
      extraHeadings.push(item);
    }
  });

  assert(
    extraHeadings.length === 0,
    `EXTRA HEADINGS IN ${itemName}: ${extraHeadings}`
  );
}

export async function checkAndCompare(query, kind, filepath, exceptions = []) {
  const names = await fetchNames(query, kind);
  const headings = await getHeadings(filepath);
  compare(names, headings, exceptions, `${kind}s`);
}

export function getType(type) {
  if (!type) {
    return null;
  }

  if (type.name) {
    return type.name;
  }

  let nestedTypeName = getType(type.ofType);

  if (type.kind === 'LIST') {
    return `[${nestedTypeName}]`;
  } else if (type.kind === 'NON_NULL') {
    return `${nestedTypeName}!`;
  }

  return nestedTypeName;
}

function processData(fields, exceptions) {
  return fields
    .filter((query) => !exceptions.includes(query.name))
    .map((query) => ({
      name: query.name,
      args: query.args.map((arg) => ({
        name: arg.name,
        type: getType(arg.type),
      })),
      returnType: getType(query.type),
    }));
}

export async function fetchData(query, kind, exceptions, schemaType) {
  try {
    const response = await request(query);
    const fields = response.data.__schema[schemaType].fields;
    return processData(fields, exceptions);
  } catch (error) {
    console.error(`Error fetching ${kind} names:`, error);
    return [];
  }
}

export function getAST(filepath) {
  const file = readFileSync(filepath, 'utf8');
  const processor = unified().use(remarkParse);
  const ast = processor.parse(file);
  return ast;
}

export function getArgsOrFields(filepath, name) {
  const ast = getAST(filepath);
  const headingArgs = {};
  let currentHeading = '';
  let currentIndex = 0;
  const args = {};
  visit(ast, '', (node, _i, parent) => {
    if (node.type === 'heading') {
      currentHeading = node.children[0].value;
    }

    if (node.value === name) {
      headingArgs[currentHeading] = true;
    }

    if (headingArgs[currentHeading] && node.type === 'inlineCode') {
      if (
        (parent.children[1] && parent.children[1].value === ': ') ||
        parent.children[1] === undefined
      ) {
        if (args[currentHeading] && !args[currentHeading][currentIndex].type) {
          args[currentHeading][currentIndex].type = node.value;
        } else {
          if (!args[currentHeading]) {
            args[currentHeading] = [];
          }
          args[currentHeading].push({ name: node.value });
          currentIndex = args[currentHeading].length - 1;
        }
      }
    }
  });
  return args;
}

export function checkIfEqual(a, b) {
  if (a.length !== b.length) {
    console.log('DIFFERENT LENGTHS');
    return false;
  }

  return a.every((value, index) => {
    const bVal = b[index];
    const isEqual = value.id === bVal.id && value.name === bVal.name;
    if (!isEqual) {
      console.log('!!!!!!NOT EQUAL!!!!');
      console.log('VALUE A:', value);
      console.log('VALUE B:', bVal);
    }
    return isEqual;
  });
}

export async function checkHeadings(
  filepath,
  query,
  kind,
  exceptions,
  schemaType
) {
  const headings = await getHeadings(filepath);
  const args = getArgsOrFields(filepath, 'args:');
  const items = await fetchData(query, kind, exceptions, schemaType);
  const missing = [];
  const wrongArgs = [];
  items.forEach((item) => {
    if (!headings.includes(item.name)) {
      missing.push(item.name);
    }

    const cleanedArgs = item.args.filter(
      (arg) => !inputArgExceptions.includes(arg.name)
    );
    if (cleanedArgs && cleanedArgs.length > 0) {
      const argsFromDocs = args[item.name];
      if (!argsFromDocs) {
        console.log('NO ARGS IN DOCS:', item.name);
        wrongArgs.push(item.name);
      } else {
        const argsMatch = checkIfEqual(cleanedArgs, argsFromDocs);
        if (!argsMatch) {
          console.log(
            `DIFF ARGS IN DOCS FOR ${item.name}:`,
            cleanedArgs,
            argsFromDocs
          );
          wrongArgs.push(item.name);
        }
      }
    }
  });
  assert(missing.length === 0, `MISSING FROM ${kind}: ${missing}`);
  assert(wrongArgs.length === 0, `ARGS ARE WRONG IN ${kind}: ${wrongArgs}`);
}
