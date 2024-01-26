import {
  GET_ENUMS,
  GET_INPUT_OBJECTS,
  GET_OBJECTS,
  GET_QUERIES,
  GET_SCALARS,
  GET_UNIONS,
  GET_MUTATIONS,
  GET_SUBSCRIPTIONS,
} from './queries.mjs';
import { checkQueryOrMutationHeadings, checkAndCompare } from './utils.mjs';

const scalarExceptions = ['Boolean', 'Float', 'ID', 'Int', 'String'];
const enumExceptions = ['__DirectiveLocation', '__TypeKind'];
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
const queryExceptions = ['register', 'memory'];
const mutationExceptions = [];
const subscriptionExceptions = [];
// const inputArgExceptions = ['first', 'last', 'after', 'before'];

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

async function checkInputObjects() {
  await checkAndCompare(
    GET_INPUT_OBJECTS,
    'INPUT_OBJECT',
    'docs/reference/objects.mdx'
  );
}

async function checkObjects() {
  await checkAndCompare(
    GET_OBJECTS,
    'OBJECT',
    'docs/reference/objects.mdx',
    objectExceptions
  );
}

async function checkQueries() {
  await checkQueryOrMutationHeadings(
    'docs/reference/queries.mdx',
    GET_QUERIES,
    'QUERY',
    queryExceptions,
    'queryType'
  );
}

async function checkMutations() {
  await checkQueryOrMutationHeadings(
    'docs/reference/mutations.mdx',
    GET_MUTATIONS,
    'MUTATION',
    mutationExceptions,
    'mutationType'
  );
}

async function checkSubscriptions() {
  await checkQueryOrMutationHeadings(
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
  await checkInputObjects();
  await checkObjects();
  await checkQueries();
  await checkMutations();
  await checkSubscriptions();
}

await checkDocs();
