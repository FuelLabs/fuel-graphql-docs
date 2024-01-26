import { checkAllObjects } from './objects.mjs';
import {
  GET_ENUMS,
  GET_QUERIES,
  GET_SCALARS,
  GET_UNIONS,
  GET_MUTATIONS,
  GET_SUBSCRIPTIONS,
} from './queries.mjs';
import { checkHeadings, checkAndCompare } from './utils.mjs';

const scalarExceptions = ['Boolean', 'Float', 'ID', 'Int', 'String'];
const enumExceptions = ['__DirectiveLocation', '__TypeKind'];

const queryExceptions = ['register', 'memory'];
const mutationExceptions = [];
const subscriptionExceptions = [];

async function checkScalars() {
  await checkAndCompare(
    GET_SCALARS,
    'SCALAR',
    'docs/reference/scalars.mdx',
    scalarExceptions
  );
}

async function checkEnums() {
  await checkAndCompare(
    GET_ENUMS,
    'ENUM',
    'docs/reference/enums.mdx',
    enumExceptions
  );
}

async function checkUnions() {
  await checkAndCompare(GET_UNIONS, 'UNION', 'docs/reference/unions.mdx');
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
    mutationExceptions,
    'mutationType'
  );
}

async function checkSubscriptions() {
  await checkHeadings(
    'docs/reference/subscriptions.mdx',
    GET_SUBSCRIPTIONS,
    'SUBSCRIPTION',
    subscriptionExceptions,
    'subscriptionType'
  );
}

async function checkDocs() {
  await checkScalars();
  await checkEnums();
  await checkUnions();
  await checkAllObjects();
  await checkQueries();
  // await checkMutations();
  await checkSubscriptions();
}

await checkDocs();
