import type { FhevmInstance } from "fhevmjs";

import { EncryptedERC20, SecretTender } from "../types";
import type { Signers } from "./signers";

declare module "mocha" {
  export interface Context {
    signers: Signers;
    contractAddress: string;
    instances: FhevmInstances;
    secretTender: SecretTender;
  }
}

export interface FhevmInstances {
  alice: FhevmInstance;
  bob: FhevmInstance;
  carol: FhevmInstance;
  dave: FhevmInstance;
}
