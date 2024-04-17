import { Box, Button, Spinner } from '@fuel-ui/react';
import { useState } from 'react';
import { Code } from '~/src/components/Code';
import { ExampleBox } from '~/src/components/ExampleBox';
import { Paragraph } from '~/src/components/Paragraph';
import { Pre } from '~/src/components/Pre';
import { TESTNET_ENDPOINT } from '~/src/constants';

interface QueryProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any;
}

export function Query(props: QueryProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [resp, setResp] = useState<any>();
  const [loading, setLoading] = useState(false);

  function runQuery() {
    setLoading(true);
    fetch(TESTNET_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    data: string;
  }

  const PrettyPrintJson = ({ data }: IPrettyPrintJson) => {
    return (
      <div>
        <pre style={{ overflow: 'scroll', maxHeight: '500px' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <>
      {props.query && (
        <>
          <Pre>
            <Code className="language-graphql">{props.query}</Code>
          </Pre>

          {props.args && Object.keys(props.args).length > 0 && (
            <>
              <Paragraph>Variables:</Paragraph>
              <Pre>
                <Code className="language-json">
                  {JSON.stringify(props.args, null, 2)}
                </Code>
              </Pre>
            </>
          )}
        </>
      )}

      <ExampleBox>
        <Box.Flex direction="column" gap="$4">
          <>
            <Button intent="base" variant="outlined" onClick={runQuery}>
              {loading ? <Spinner /> : 'Run'}
            </Button>

            {resp && (
              <>
                <div>Response:</div>
                <PrettyPrintJson data={resp} />
              </>
            )}
          </>
        </Box.Flex>
      </ExampleBox>
    </>
  );
}
