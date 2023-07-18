import dynamic from "next/dynamic";
import { ComponentType } from "react";

export interface ComponentObject { 
    [key: string]: ComponentType<any>;
}

export interface Component {
  name: string;
  import?: ComponentType<any>;
  imports?: ComponentObject;
}

export interface ComponentsList {
  [key: string]: Component[];
}

const GQLExamples: ComponentObject= {};
GQLExamples.Balance = dynamic(
  () => import("../examples").then((mod) => mod.Balance),
  { ssr: false }
);
GQLExamples.Balances = dynamic(
  () => import("../examples").then((mod) => mod.Balances),
  { ssr: false }
);
GQLExamples.BlockByHeight = dynamic(
  () => import("../examples").then((mod) => mod.BlockByHeight),
  { ssr: false }
);
GQLExamples.ContractBalance = dynamic(
  () => import("../examples").then((mod) => mod.ContractBalance),
  { ssr: false }
);
GQLExamples.ContractBalances = dynamic(
  () => import("../examples").then((mod) => mod.ContractBalances),
  { ssr: false }
);
GQLExamples.LatestBlocks = dynamic(
  () => import("../examples").then((mod) => mod.LatestBlocks),
  { ssr: false }
);
GQLExamples.LatestTransactions = dynamic(
  () => import("../examples").then((mod) => mod.LatestTransactions),
  { ssr: false }
);
GQLExamples.MessageInfo = dynamic(
  () => import("../examples").then((mod) => mod.MessageInfo),
  { ssr: false }
);
GQLExamples.Transactions = dynamic(
  () => import("../examples").then((mod) => mod.Transactions),
  { ssr: false }
);

// each key matches the path for a page
// and contains the components needed for that page
// components to be loaded on all pages go under the 'all' key
// exception: the CodeExamples component can be ignored
export const COMPONENTS: ComponentsList = {
  recipes: [
    {
      name: "GQLExamples",
      imports: GQLExamples
    },
  ],
};
