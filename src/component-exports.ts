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
    () => import("../examples/Baalance").then((mod) => mod.Balance)
  );

GQLExamples.Balances = dynamic(
    () => import("../examples/Baalances").then((mod) => mod.Balances)
  );

GQLExamples.Transactions = dynamic(
    () => import("../examples/Transactions").then((mod) => mod.Transactions)
  );

GQLExamples.LatestTransactions = dynamic(
    () => import("../examples/LatestTransactions").then((mod) => mod.LatestTransactions)
  );

GQLExamples.ContractBalance = dynamic(
    () => import("../examples/ContractBalance").then((mod) => mod.ContractBalance)
  );

GQLExamples.ContractBalances = dynamic(
    () => import("../examples/ContractBalances").then((mod) => mod.ContractBalances)
  );

GQLExamples.LatestBlocks = dynamic(
    () => import("../examples/LatestBlocks").then((mod) => mod.LatestBlocks)
  );

GQLExamples.BlockByHeight = dynamic(
    () => import("../examples/BlockByHeight").then((mod) => mod.BlockByHeight)
  );

GQLExamples.MessageInfo = dynamic(
    () => import("../examples/MessageInfo").then((mod) => mod.MessageInfo)
  );


export const COMPONENTS: ComponentsList = {
  recipes: [
    { 
      name: "GQLExamples",
      imports: GQLExamples
    },
  ]
};
  