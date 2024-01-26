import { assert } from 'console';
import { readFileSync } from 'fs';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

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
      'Unions',
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

async function request(query) {
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

async function fetchNames(query, kind) {
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
}

export async function checkAndCompare(query, kind, filepath, exceptions = []) {
  const names = await fetchNames(query, kind);
  const headings = await getHeadings(filepath);
  compare(names, headings, exceptions, `${kind}s`);
}

function getType(type) {
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

function processQueryOrMutation(fields, exceptions) {
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
    return processQueryOrMutation(fields, exceptions);
  } catch (error) {
    console.error(`Error fetching ${kind} names:`, error);
    return [];
  }
}

export async function checkQueryOrMutationHeadings(
  filepath,
  query,
  kind,
  exceptions,
  schemaType
) {
  const headings = await getHeadings(filepath);
  const items = await fetchData(query, kind, exceptions, schemaType);
  const missing = [];
  items.forEach((item) => {
    if (!headings.includes(item.name)) {
      missing.push(item.name);
    }
  });
  assert(missing.length === 0, `MISSING FROM ${kind}: ${missing}`);
}
