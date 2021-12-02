import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { deployments } from '../frontend/src/constants/apy-mainnet-constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const [signer] = await hre.ethers.getSigners();
  const {deploy} = hre.deployments;
  console.log(`Deploying contracts using ${signer.address}`);

  if (hre.network.name === "hardhat"){
    // give 100 eth to the account 
    await hre.network.provider.send('hardhat_setBalance', [
      signer.address,
      "0x21E19E0C9BAB2400000"
        ])
    }

  await deploy('YTCZap', {
    from: signer.address,
    args: [],
    log: true,
  });

  const deployedContract = await hre.deployments.get('YTCZap');

  console.log('contract deployed to: ', deployedContract.address)
  
};

export default func;
