import { BrowserProvider, AbiCoder } from "ethers";
import { initFhevm, createInstance } from "fhevmjs";

export const init = async () => {
  await initFhevm();
};

// TFHE.sol contract address
const FHE_LIB_ADDRESS = "0x000000000000000000000000000000000000005d";

export const provider = new BrowserProvider(window.ethereum);

let instance;

export const createFhevmInstance = async () => {
  const network = await provider.getNetwork();
  const chainId = +network.chainId.toString();
  // Get blockchain public key
  const ret = await provider.call({
    to: FHE_LIB_ADDRESS,
    // first four bytes of keccak256('fhePubKey(bytes1)') + 1 byte for library
    data: "0xd9d47bb001",
  });
  const decoded = AbiCoder.defaultAbiCoder().decode(["bytes"], ret);
  const publicKey = decoded[0];
  instance = await createInstance({ chainId, publicKey });
};

export const getInstance = async () => {
  if (!instance) {
    await init();
    await createFhevmInstance();
  }
  return instance;
};
