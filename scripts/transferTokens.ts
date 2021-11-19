import { approveAllTokens } from "./helpers/approveAlltokens";
import { approveAllBalancerPools } from "./helpers/approveBalancerPools";
import { getAllTokens } from "./helpers/getTokens";

async function main() {
  // await getAllTokens();
  // await approveAllBalancerPools();
  await approveAllTokens();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
