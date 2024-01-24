import { myUtilityFunction } from '../../src/utils/index';

describe('Utility Functions', () => {
  test('myUtilityFunction', () => {
    const result = myUtilityFunction('test input');
    expect(result).toBe('expected output');
  });
});