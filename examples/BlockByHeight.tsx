import { Query } from "./Query";

export function BlockByHeight() {
  const query = `query Block($height: U64) {
    block(height: $height) {
      id
    }
  }`;

  const args = {
    height: "3412"
  };

  return <Query query={query} args={args} />;
}
