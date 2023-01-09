import { SignatureTransfer } from './signatureTransfer'
import { MaxUnorderedNonce, MaxSignatureTransferAmount, MaxSigDeadline } from './constants'

describe('SignatureTransfer', () => {
  describe('Max values', () => {
    it('max values', () => {
      expect(() =>
        SignatureTransfer.hash(
          {
            permitted: {
              token: '0x0000000000000000000000000000000000000000',
              amount: MaxSignatureTransferAmount.toString(),
            },
            nonce: MaxUnorderedNonce.toString(),
            deadline: MaxSigDeadline.toString(),
          },
          '0x0000000000000000000000000000000000000000',
          1
        )
      ).not.toThrow()
    })

    it('nonce out of range', () => {
      expect(() =>
        SignatureTransfer.hash(
          {
            permitted: {
              token: '0x0000000000000000000000000000000000000000',
              amount: '0',
            },
            nonce: MaxUnorderedNonce.add(1).toString(),
            deadline: '0',
          },
          '0x0000000000000000000000000000000000000000',
          1
        )
      ).toThrow('NONCE_OUT_OF_RANGE')
    })

    it('amount out of range', () => {
      expect(() =>
        SignatureTransfer.hash(
          {
            permitted: {
              token: '0x0000000000000000000000000000000000000000',
              amount: MaxSignatureTransferAmount.add(1).toString(),
            },
            nonce: '0',
            deadline: '0',
          },
          '0x0000000000000000000000000000000000000000',
          1
        )
      ).toThrow('AMOUNT_OUT_OF_RANGE')
    })

    it('deadline out of range', () => {
      expect(() =>
        SignatureTransfer.hash(
          {
            permitted: {
              token: '0x0000000000000000000000000000000000000000',
              amount: '0',
            },
            nonce: '0',
            deadline: MaxSigDeadline.add(1).toString(),
          },
          '0x0000000000000000000000000000000000000000',
          1
        )
      ).toThrow('SIG_DEADLINE_OUT_OF_RANGE')
    })
  })

  it('non-batch, no witness', () => {
    expect(
      SignatureTransfer.hash(
        {
          permitted: {
            token: '0x0000000000000000000000000000000000000000',
            amount: '0',
          },
          nonce: '0',
          deadline: '0',
        },
        '0x0000000000000000000000000000000000000000',
        1
      )
    ).toBe('0x93d8341d5ec92a469ef737478766630bfdccfef3b43adc337bd99215dafae9a8')
  })

  it('non-batch, witness', () => {
    expect(
      SignatureTransfer.hash(
        {
          permitted: {
            token: '0x0000000000000000000000000000000000000000',
            amount: '0',
          },
          nonce: '0',
          deadline: '0',
        },
        '0x0000000000000000000000000000000000000000',
        1,
        {
          witnessTypeName: 'MockWitness',
          witnessType: { MockWitness: [{ name: 'mock', type: 'uint256' }] },
          witness: { mock: '0x0000000000000000000000000000000000000000000000000000000000000000' },
        }
      )
    ).toBe('0x6c166b9b0d7cdd60898b3dd0ae6642fe1110ff70861b735b844fb8f8f4777b54')
  })

  it('batch, no witness', () => {
    expect(
      SignatureTransfer.hash(
        {
          permitted: [
            {
              token: '0x0000000000000000000000000000000000000000',
              amount: '0',
            },
          ],
          nonce: '0',
          deadline: '0',
        },
        '0x0000000000000000000000000000000000000000',
        1
      )
    ).toBe('0xd7063d4aead7aada30fab802d8e37ae6b6639faaab76d8dc143c2eaba828242f')
  })

  it('batch, witness', () => {
    expect(
      SignatureTransfer.hash(
        {
          permitted: [
            {
              token: '0x0000000000000000000000000000000000000000',
              amount: '0',
            },
          ],
          nonce: '0',
          deadline: '0',
        },
        '0x0000000000000000000000000000000000000000',
        1,
        {
          witnessTypeName: 'MockWitness',
          witnessType: { MockWitness: [{ name: 'mock', type: 'uint256' }] },
          witness: { mock: '0x0000000000000000000000000000000000000000000000000000000000000000' },
        }
      )
    ).toBe('0x53f20f7fa80703f2dbd9fed53248baf086a304910ab8694fa40ab8359f73ed69')
  })
})
