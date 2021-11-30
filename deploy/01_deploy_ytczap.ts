import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const [signer] = await hre.ethers.getSigners();
  const {deploy} = hre.deployments;
  console.log(`Deploying contracts using ${signer.address}`);

  const ytcAddress = (await hre.deployments.get("YieldTokenCompounding")).address;

  if (hre.network.name === "hardhat"){
    // give 100 eth to the account 
    await hre.network.provider.send('hardhat_setBalance', [
      signer.address,
      "0x21E19E0C9BAB2400000"
        ])
    }

    // const ytcContract = "0x3df5229f24040cf0218969c2406b302744edc18b"

  // const ytc_contract = await YTC.deploy(balVault, trancheFactory, bytecodeHash);
  await deploy('YTCZap', {
    from: signer.address,
    args: [ytcAddress],
    log: true,
  });

  const deployedContract = await hre.deployments.get('YTCZap');

  console.log('contract deployed to: ', deployedContract.address)
  
};

export default func;
