import { MaxUint48, MaxUint160, MaxUint256, InstantExpiration } from './constants'

describe('Constants', () => {
  it('MaxUint256', () => {
    expect(MaxUint256).toEqual(BigInt(2) ** BigInt(256) - BigInt(1))
  })

  it('MaxUint160', () => {
    expect(MaxUint160).toEqual(BigInt(2) ** BigInt(160) - BigInt(1))
  })

  it('MaxUint48', () => {
    expect(MaxUint48).toEqual(BigInt(2) ** BigInt(48) - BigInt(1))
  })

  it('InstantExpiration', () => {
    expect(InstantExpiration).toEqual(BigInt(0))
  })
})
