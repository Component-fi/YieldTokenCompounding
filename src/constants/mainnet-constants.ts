import { ConstantsObject } from "../types/manual/types";

export const constants: ConstantsObject = {
	"tokens": {
		"usdc": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
		"weth": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
		"dai": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
		"lusd3crv-f": "0xEd279fDD11cA84bEef15AF5D39BB4d4bEE23F0cA",
		"crvtricrypto": "0xcA3d75aC011BF5aD07a98d02f18225F9bD9A6BDF",
		"stecrv": "0x06325440D014e39736583c165C2963BA99fAf14E",
		"crv3crypto": "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff",
		"wbtc": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
	},
	"wrappedPositions": {
		"yearn": {
			"lusd3crv-f": "0x53b1aEAa018da00b4F458Cc13d40eB3e8d1B85d6",
			"crvtricrypto": "0x97278Ce17D4860f8f49afC6E4c1C5AcBf2584cE5",
			"stecrv": "0xB3295e739380BD68de96802F7c4Dba4e54477206",
			"dai": "0x21BbC083362022aB8D7e42C18c47D484cc95C193",
			"usdc": "0xdEa04Ffc66ECD7bf35782C70255852B34102C3b0",
			"crv3crypto": "0x4F424B26c7c659F198797Bd87282BF602F543521",
			"wbtc": "0x8D9487b81e0fEdcd2D8Cab91885756742375CDC5"
		}
	},
	"vaults": {
		"yearn": {
			"lusd3crv-f": "0x5fA5B62c8AF877CB37031e0a3B2f34A78e3C56A6",
			"crvtricrypto": "0x3D980E50508CFd41a13837A60149927a11c03731",
			"stecrv": "0xdCD90C7f6324cfa40d7169ef80b12031770B4325",
			"dai": "0xdA816459F1AB5631232FE5e97a05BBBb94970c95",
			"usdc": "0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9",
			"crv3crypto": "0xE537B5cc158EB71037D4125BDD7538421981E6AA",
			"wbtc": "0xA696a63cc78DfFa1a63E9E50587C197387FF6C7E"
		}
	},
	"trancheFactory": "0x62F161BF3692E4015BefB05A03a94A40f520d1c0",
	"userProxy": "0xEe4e158c03A10CBc8242350d74510779A364581C",
	"balancerVault": "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
	"weightedPoolFactory": "0x8E9aa87E45e92bad84D5F8DD1bff34Fb92637dE9",
	"convergentCurvePoolFactory": "0xb7561f547F3207eDb42A6AfA42170Cd47ADD17BD",
	"tranches": {
		"stecrv": [
			{
				"expiration": 1634325622,
				"address": "0x26941C63F4587796aBE199348ecd3d7C44F9aE0C",
				"trancheFactory": "0x62F161BF3692E4015BefB05A03a94A40f520d1c0",
				"ptPool": {
					"address": "0xce16E7ed7654a3453E8FaF748f2c82E57069278f",
					"poolId": "0xce16e7ed7654a3453e8faf748f2c82e57069278f00020000000000000000006d",
					"fee": "0.1",
					"timeStretch": 26.1
				},
				"ytPool": {
					"address": "0xD5D7bc115B32ad1449C6D0083E43C87be95F2809",
					"poolId": "0xd5d7bc115b32ad1449c6d0083e43c87be95f280900020000000000000000006c",
					"fee": "0.003"
				},
				"weightedPoolFactory": "0x8E9aa87E45e92bad84D5F8DD1bff34Fb92637dE9",
				"convergentCurvePoolFactory": "0xb7561f547F3207eDb42A6AfA42170Cd47ADD17BD"
			}
		],
		"lusd3crv-f": [
			{
				"address": "0x9b44Ed798a10Df31dee52C5256Dcb4754BCf097E",
				"expiration": 1632834462,
				"trancheFactory": "0x62F161BF3692E4015BefB05A03a94A40f520d1c0",
				"ptPool": {
					"address": "0xA8D4433BAdAa1A35506804B43657B0694deA928d",
					"poolId": "0xa8d4433badaa1a35506804b43657b0694dea928d00020000000000000000005e",
					"fee": "0.1",
					"timeStretch": 16
				},
				"ytPool": {
					"address": "0xDe620bb8BE43ee54d7aa73f8E99A7409Fe511084",
					"poolId": "0xde620bb8be43ee54d7aa73f8e99a7409fe51108400020000000000000000005d",
					"fee": "0.003"
				},
				"weightedPoolFactory": "0x8E9aa87E45e92bad84D5F8DD1bff34Fb92637dE9",
				"convergentCurvePoolFactory": "0xb7561f547F3207eDb42A6AfA42170Cd47ADD17BD"
			},
			{
				"expiration": 1640620258,
				"address": "0xa2b3d083AA1eaa8453BfB477f062A208Ed85cBBF",
				"trancheFactory": "0x62F161BF3692E4015BefB05A03a94A40f520d1c0",
				"ptPool": {
					"address": "0x893B30574BF183d69413717f30b17062eC9DFD8b",
					"poolId": "0x893b30574bf183d69413717f30b17062ec9dfd8b000200000000000000000061",
					"fee": "0.1",
					"timeStretch": 24
				},
				"ytPool": {
					"address": "0x67F8FCb9D3c463da05DE1392EfDbB2A87F8599Ea",
					"poolId": "0x67f8fcb9d3c463da05de1392efdbb2a87f8599ea000200000000000000000060",
					"fee": "0.003"
				},
				"weightedPoolFactory": "0x8E9aa87E45e92bad84D5F8DD1bff34Fb92637dE9",
				"convergentCurvePoolFactory": "0xb7561f547F3207eDb42A6AfA42170Cd47ADD17BD"
			}
		],
		"crvtricrypto": [
			{
				"expiration": 1628997564,
				"address": "0x237535Da7e2f0aBa1b68262ABCf7C4e60B42600C",
				"trancheFactory": "0x62F161BF3692E4015BefB05A03a94A40f520d1c0",
				"ptPool": {
					"address": "0x3A693EB97b500008d4Bb6258906f7Bbca1D09Cc5",
					"poolId": "0x3a693eb97b500008d4bb6258906f7bbca1d09cc5000200000000000000000065",
					"fee": "0.1",
					"timeStretch": 6.16
				},
				"ytPool": {
					"address": "0xF94A7Df264A2ec8bCEef2cFE54d7cA3f6C6DFC7a",
					"poolId": "0xf94a7df264a2ec8bceef2cfe54d7ca3f6c6dfc7a000200000000000000000064",
					"fee": "0.003"
				},
				"weightedPoolFactory": "0x8E9aa87E45e92bad84D5F8DD1bff34Fb92637dE9",
				"convergentCurvePoolFactory": "0xb7561f547F3207eDb42A6AfA42170Cd47ADD17BD"
			}
		],
		"dai": [
			{
				"expiration": 1634346845,
				"address": "0xb1cc77e701de60FE246607565CF7eDC9D9b6b963",
				"trancheFactory": "0x62F161BF3692E4015BefB05A03a94A40f520d1c0",
				"ptPool": {
					"address": "0x71628c66C502F988Fbb9e17081F2bD14e361FAF4",
					"poolId": "0x71628c66c502f988fbb9e17081f2bd14e361faf4000200000000000000000078",
					"fee": "0.1",
					"timeStretch": 22.19
				},
				"ytPool": {
					"address": "0xE54B3F5c444a801e61BECDCa93e74CdC1C4C1F90",
					"poolId": "0xe54b3f5c444a801e61becdca93e74cdc1c4c1f90000200000000000000000077",
					"fee": "0.003"
				},
				"weightedPoolFactory": "0x8E9aa87E45e92bad84D5F8DD1bff34Fb92637dE9",
				"convergentCurvePoolFactory": "0xb7561f547F3207eDb42A6AfA42170Cd47ADD17BD"
			}
		],
		"usdc": [
			{
				"expiration": 1635528110,
				"address": "0xf38c3E836Be9cD35072055Ff6a9Ba570e0B70797",
				"trancheFactory": "0x62F161BF3692E4015BefB05A03a94A40f520d1c0",
				"ptPool": {
					"address": "0x787546Bf2c05e3e19e2b6BDE57A203da7f682efF",
					"poolId": "0x787546bf2c05e3e19e2b6bde57a203da7f682eff00020000000000000000007c",
					"fee": "0.1",
					"timeStretch": 18.5
				},
				"ytPool": {
					"address": "0x2D6e3515C8b47192Ca3913770fa741d3C4Dac354",
					"poolId": "0x2d6e3515c8b47192ca3913770fa741d3c4dac35400020000000000000000007b",
					"fee": "0.003"
				},
				"weightedPoolFactory": "0x8E9aa87E45e92bad84D5F8DD1bff34Fb92637dE9",
				"convergentCurvePoolFactory": "0xb7561f547F3207eDb42A6AfA42170Cd47ADD17BD"
			}
		],
		"crv3crypto": [
			{
				"expiration": 1636746083,
				"address": "0x9CF2AB51aC93711Ec2fa32Ec861349568A16c729",
				"trancheFactory": "0x62F161BF3692E4015BefB05A03a94A40f520d1c0",
				"ptPool": {
					"address": "0xF6dc4640D2783654BeF88E0dF3fb0F051f0DfC1A",
					"poolId": "0xf6dc4640d2783654bef88e0df3fb0f051f0dfc1a00020000000000000000007e",
					"fee": "0.1",
					"timeStretch": 4.44
				},
				"ytPool": {
					"address": "0xd16847480D6bc218048CD31Ad98b63CC34e5c2bF",
					"poolId": "0xd16847480d6bc218048cd31ad98b63cc34e5c2bf00020000000000000000007d",	
					"fee": "0.003"
				},
				"weightedPoolFactory": "0x8E9aa87E45e92bad84D5F8DD1bff34Fb92637dE9",
				"convergentCurvePoolFactory": "0xb7561f547F3207eDb42A6AfA42170Cd47ADD17BD"
			}
		],
		"wbtc": [
			{
				"expiration": 1637941844,
				"address": "0x6BF924137E769C0A5c443dcE6eC885552d31D579",
				"trancheFactory": "0x62F161BF3692E4015BefB05A03a94A40f520d1c0",
				"ptPool": {
					"address": "0x4Db9024fc9F477134e00Da0DA3c77DE98d9836aC",
					"poolId": "0x4db9024fc9f477134e00da0da3c77de98d9836ac000200000000000000000086",
					"fee": "0.1",
					"timeStretch": 31.7
				},
				"ytPool": {
					"address": "0x7320d680Ca9BCE8048a286f00A79A2c9f8DCD7b3",
					"poolId": "0x7320d680ca9bce8048a286f00a79a2c9f8dcd7b3000200000000000000000085",
					"fee": "0.003"
				},
				"weightedPoolFactory": "0x8E9aa87E45e92bad84D5F8DD1bff34Fb92637dE9",
				"convergentCurvePoolFactory": "0xb7561f547F3207eDb42A6AfA42170Cd47ADD17BD"
			}
		]
	}
};