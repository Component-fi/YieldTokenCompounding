import { approveAllTokens } from "./helpers/approveAlltokens";
import { approveAllBalancerPools } from "./helpers/approveBalancerPools";

async function main() {
  await approveAllBalancerPools();
  await approveAllTokens();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
