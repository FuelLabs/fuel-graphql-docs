import { Query } from "./query";

export function BlockByHeight() {
  const query = `query Block($height: U64) {
    block(height: $height) {
      id
    }
  }`;

  const args = {
    height: "5968"
  };

  return <Query query={query} args={args} />;
}
