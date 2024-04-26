import { TypedDataDomain, TypedDataField } from 'ethers'

const PERMIT2_DOMAIN_NAME = 'Permit2'

export function permit2Domain(permit2Address: string, chainId: number): TypedDataDomain {
  return {
    name: PERMIT2_DOMAIN_NAME,
    chainId,
    verifyingContract: permit2Address,
  }
}

export type PermitData = {
  domain: TypedDataDomain
  types: Record<string, TypedDataField[]>
  values: any
}
