import { cssObj } from "@fuel-ui/css";
import { Link, Tabs, Box } from "@fuel-ui/react";

import { Pre } from "./Pre";

import { REPO_LINK } from "~/src/constants";
import { stringRegEx } from "fuels";

export type CodeExamplesProps = {
  file: string;
  ts_lines?: number[];
  apollo_lines?: number[];
  urql_lines?: number[];
  ts_testCase?: string;
  apollo_testCase?: string;
  urql_testCase?: string;
  ts_title?: string;
  apollo_title?: string;
  urql_title?: string;
  __ts_content: string;
  __apollo_content: string;
  __urql_content: string;
  __filepath: string;
  __filename: string;
  __ts_language: string;
  __ts_lineStart: number;
  __apollo_lineStart: number;
  __urql_lineStart: number;
  __ts_lineEnd?: number;
  __apollo_lineEnd?: number;
  __urql_lineEnd?: number;
};

export function CodeExamples({
  __ts_content: ts_content,
  __apollo_content: apollo_content,
  __urql_content: urql_content,
  __filepath: filePath,
  __filename: filename,
  __ts_language: ts_language,
  __ts_lineStart: ts_lineStart,
  __apollo_lineStart: apollo_lineStart,
  __urql_lineStart: urql_lineStart,
  __ts_lineEnd: ts_lineEnd,
  __apollo_lineEnd: apollo_lineEnd,
  __urql_lineEnd: urql_lineEnd,
}: CodeExamplesProps) {

  const ts_lines = `L${ts_lineStart}${ts_lineEnd ? `-L${ts_lineEnd}` : ""}`;
  const link = `${REPO_LINK}/${filePath}#${ts_lines}`;

  const apolloImport = `import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const apolloClient= new ApolloClient({
  uri: 'https://beta-3.fuel.network/graphql',
  cache: new InMemoryCache(),
});

`;

  const urqlImport = `import { createClient } from 'urql';

const urqlClient= createClient({
  url: 'https://beta-3.fuel.network/graphql',
});

`;

  const title = (
    <>
      <Link css={styles.filename} isExternal href={link}>
        {filename}
      </Link>
    </>
  );

  interface TabContentProps {
    value: string;
    content: string;
  }

  const TabContent = ({ value, content }: TabContentProps) => {
    return (
      <Tabs.Content css={styles.codeContainer} value={value}>
        <Pre title={title}>
          <code className={`language-${ts_language}`}>{content}</code>
        </Pre>
      </Tabs.Content>
    );
  };

  return (
    <Box css={styles.tabsContainer}>
      <Tabs>
        <Tabs.List aria-label="Using the query in an app">
          <Tabs.Trigger css={styles.tabsTrigger} value="ts">TypeScript</Tabs.Trigger>
          <Tabs.Trigger css={styles.tabsTrigger} value="apollo">Apollo Client</Tabs.Trigger>
          <Tabs.Trigger css={styles.tabsTrigger} value="urql">urql</Tabs.Trigger>
        </Tabs.List>
        <TabContent value="ts" content={ts_content} />
        <TabContent value="apollo" content={apolloImport + apollo_content} />
        <TabContent value="urql" content={urqlImport + urql_content} />
      </Tabs>
    </Box>
  );
}

const styles = {
  tabsTrigger: cssObj({
    cursor: "pointer",
    // color: "#00F58C"
    '&:focus, &:hover': {
      color: '#00F58C',
    },
    '&[data-state="active"]': {
      color: '#00F58C',
    },
    '&[data-state="active"]:after': {
      backgroundColor: '#00F58C',
    },
  }),
  tabsContainer: cssObj({
    marginTop: "$8",
  }),
  codeContainer: cssObj({
    maxHeight: "500px",
    overflow: "scroll",
  }),
  filename: cssObj({
    "&, &:visited": {
      fontSize: "$sm",
      color: "$gray9",
    },
    "&:hover": {
      color: "$gray11",
      textDecoration: "none",
    },
  }),
};