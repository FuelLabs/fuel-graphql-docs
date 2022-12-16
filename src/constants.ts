import ogImage from '../public/og-image.png';

export const MENU_ORDER = [
  'Overview',
  'How To Use GraphQL',
  'Reference',
  'Querying From A Dapp',
  'Recipes'
];

const URL = "https://fuel-graphql-docs.vercel.app"

export const FIELDS = ['title', 'slug', 'content', 'category'];
export const REPO_LINK = 'https://github.com/FuelLabs/fuel-graphql-docs/';
export const DOCS_REPO_LINK = REPO_LINK;
export const DEFAULT_SLUG = ['overview'];

export const META_DESC =
  'Official documentation for the Fuel GraphQL API';

export const META_OGIMG = URL + ogImage.src;