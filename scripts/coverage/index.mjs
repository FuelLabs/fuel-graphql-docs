import { checkEnums } from './enums.mjs';
import { checkAllObjects } from './objects.mjs';
import {
  GET_QUERIES,
  GET_SCALARS,
  GET_MUTATIONS,
  GET_SUBSCRIPTIONS,
} from './queries.mjs';
import { checkUnions } from './unions.mjs';
import { checkHeadings, fetchNames, getHeadings, compare } from './utils.mjs';

const scalarExceptions = ['Boolean', 'Float', 'ID', 'Int', 'String'];
const queryExceptions = ['register', 'memory'];

async function checkScalars() {
  const names = await fetchNames(GET_SCALARS, 'SCALAR');
  const headings = await getHeadings('docs/reference/scalars.mdx');
  compare(names, headings, scalarExceptions, 'SCALARs');
}

async function checkQueries() {
  await checkHeadings(
    'docs/reference/queries.mdx',
    GET_QUERIES,
    'QUERY',
    queryExceptions,
    'queryType'
  );
}

async function checkMutations() {
  await checkHeadings(
    'docs/reference/mutations.mdx',
    GET_MUTATIONS,
    'MUTATION',
    [],
    'mutationType'
  );
}

async function checkSubscriptions() {
  await checkHeadings(
    'docs/reference/subscriptions.mdx',
    GET_SUBSCRIPTIONS,
    'SUBSCRIPTION',
    [],
    'subscriptionType'
  );
}

async function checkDocs() {
  await checkScalars();
  await checkEnums();
  await checkUnions();
  await checkAllObjects();
  await checkQueries();
  await checkMutations();
  await checkSubscriptions();
}

await checkDocs();

// TODO:
// CHECK FOR RETURN TYPES FOR QUERIES, MUTATIONS, SUBSCRIPTIONS
// CHECK FOR LINKS TO RELEVANT TYPES
