import invariant from 'tiny-invariant'
import { TypedDataDomain, TypedDataField } from 'ethers'
import { TypedDataEncoder } from 'ethers'
import { MaxSigDeadline, MaxOrderedNonce, MaxAllowanceTransferAmount, MaxAllowanceExpiration } from './constants'
import { permit2Domain } from './domain'

export interface PermitDetails {
  token: string
  amount: bigint
  expiration: bigint
  nonce: bigint
}

export interface PermitSingle {
  details: PermitDetails
  spender: string
  sigDeadline: bigint
}

export interface PermitBatch {
  details: PermitDetails[]
  spender: string
  sigDeadline: bigint
}

export type PermitSingleData = {
  domain: TypedDataDomain
  types: Record<string, TypedDataField[]>
  values: PermitSingle
}

export type PermitBatchData = {
  domain: TypedDataDomain
  types: Record<string, TypedDataField[]>
  values: PermitBatch
}

const PERMIT_DETAILS = [
  { name: 'token', type: 'address' },
  { name: 'amount', type: 'uint160' },
  { name: 'expiration', type: 'uint48' },
  { name: 'nonce', type: 'uint48' },
]

const PERMIT_TYPES = {
  PermitSingle: [
    { name: 'details', type: 'PermitDetails' },
    { name: 'spender', type: 'address' },
    { name: 'sigDeadline', type: 'uint256' },
  ],
  PermitDetails: PERMIT_DETAILS,
}

const PERMIT_BATCH_TYPES = {
  PermitBatch: [
    { name: 'details', type: 'PermitDetails[]' },
    { name: 'spender', type: 'address' },
    { name: 'sigDeadline', type: 'uint256' },
  ],
  PermitDetails: PERMIT_DETAILS,
}

function isPermit(permit: PermitSingle | PermitBatch): permit is PermitSingle {
  return !Array.isArray(permit.details)
}

export abstract class AllowanceTransfer {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  // return the data to be sent in a eth_signTypedData RPC call
  // for signing the given permit data
  public static getPermitData(
    permit: PermitSingle | PermitBatch,
    permit2Address: string,
    chainId: number
  ): PermitSingleData | PermitBatchData {
    invariant(MaxSigDeadline >= permit.sigDeadline, 'SIG_DEADLINE_OUT_OF_RANGE');

    const domain = permit2Domain(permit2Address, chainId)
    if (isPermit(permit)) {
      validatePermitDetails(permit.details)
      return {
        domain,
        types: PERMIT_TYPES,
        values: permit,
      }
    } else {
      permit.details.forEach(validatePermitDetails)
      return {
        domain,
        types: PERMIT_BATCH_TYPES,
        values: permit,
      }
    }
  }

  public static hash(permit: PermitSingle | PermitBatch, permit2Address: string, chainId: number): string {
    const { domain, types, values } = AllowanceTransfer.getPermitData(permit, permit2Address, chainId)
    return TypedDataEncoder.hash(domain, types, values)
  }
}

function validatePermitDetails(details: PermitDetails) {
  invariant(MaxOrderedNonce >= details.nonce, 'NONCE_OUT_OF_RANGE');
  invariant(MaxAllowanceTransferAmount >= details.amount, 'AMOUNT_OUT_OF_RANGE');
  invariant(MaxAllowanceExpiration >= details.expiration, 'EXPIRATION_OUT_OF_RANGE');
}
