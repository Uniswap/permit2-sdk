import { MaxUint48, MaxUint160, MaxUint256, InstantExpiration } from './constants'

describe('Constants', () => {
  it('MaxUint256', () => {
    expect(MaxUint256).toEqual((2n ** 256n) - 1n);
  });

  it('MaxUint160', () => {
    expect(MaxUint160).toEqual((2n ** 160n) - 1n);
  });

  it('MaxUint48', () => {
    expect(MaxUint48).toEqual((2n ** 48n) - 1n);
  });

  it('InstantExpiration', () => {
    expect(InstantExpiration).toEqual(0n);
  });
})