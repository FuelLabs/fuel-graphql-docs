/* eslint-disable no-console */
import { Flex, Button, Spinner } from "@fuel-ui/react";
import { useState } from "react";
import { cssObj } from "@fuel-ui/css";
import { ExampleBox } from "~/src/components/ExampleBox";

interface QueryProps {
    query: any;
    args: {};
}

export function Query(props: QueryProps) {
  const [resp, setResp] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  function runQuery() {
    setLoading(true);
    fetch("https://beta-3.fuel.network/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: props.query,
        variables: props.args,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setResp(result);
        setLoading(false);
      });
  }

  interface IPrettyPrintJson {
    data: string
  }

  const PrettyPrintJson = ({data}: IPrettyPrintJson) => {
    // (destructured) data could be a prop for example
    return (<div><pre style={{overflow: "scroll", maxHeight: "500px"}}>{ JSON.stringify(data, null, 2) }</pre></div>);
}

  return (
    <ExampleBox>
      <Flex direction="column" gap="$4">
        <>
          <Button css={styles.button} onPress={runQuery}>{loading ? <Spinner/> : "Run"}</Button>
          
          {resp && 
          <>
          <div>Response:</div>
          <PrettyPrintJson data={resp}/>
          </>
          }
        </>
      </Flex>
    </ExampleBox>
  );
}

const styles = {
  button: cssObj({
    backgroundColor: "#00F58C"
  })
}