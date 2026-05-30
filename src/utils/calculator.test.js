import {
  hexAdd,
  hexSubtract,
  hexMultiply,
  hexDivide,
  validateInput,
  validateOutput,
} from './calculator';

// ---------------------------------------------------------------------------
// Addition
// ---------------------------------------------------------------------------
describe('hexAdd', () => {
  test('adds two normal hex values', () => {
    expect(hexAdd('0A', '05')).toBe('000F'); // 10 + 5 = 15
  });

  test('adds single-digit hex values', () => {
    expect(hexAdd('A', 'B')).toBe('0015'); // 10 + 11 = 21
  });

  test('adds two-digit hex values', () => {
    expect(hexAdd('FF', 'FF')).toBe('01FE'); // 255 + 255 = 510
  });

  test('result exactly at FFFF is preserved', () => {
    // 0xFF00 (65280) + 0xFF (255) = 65535 = 0xFFFF
    expect(hexAdd('FF00', 'FF')).toBe('FFFF');
  });

  test('result over FFFF is clamped to FFFF', () => {
    // 0xFF00 (65280) + 0x0100 (256) = 65536 → clamped
    expect(hexAdd('FF00', '0100')).toBe('FFFF');
  });
});

// ---------------------------------------------------------------------------
// Subtraction
// ---------------------------------------------------------------------------
describe('hexSubtract', () => {
  test('subtracts two normal hex values', () => {
    expect(hexSubtract('1F', '0A')).toBe('0015'); // 31 - 10 = 21
  });

  test('result of zero', () => {
    expect(hexSubtract('0A', '0A')).toBe('0000');
  });

  test('negative result is clamped to 0000', () => {
    expect(hexSubtract('05', '0A')).toBe('0000'); // 5 - 10 = -5 → 0
  });
});

// ---------------------------------------------------------------------------
// Multiplication
// ---------------------------------------------------------------------------
describe('hexMultiply', () => {
  test('multiplies two normal hex values', () => {
    expect(hexMultiply('0A', '03')).toBe('001E'); // 10 * 3 = 30
  });

  test('multiplies max two-digit inputs', () => {
    expect(hexMultiply('FF', 'FF')).toBe('FE01'); // 255 * 255 = 65025
  });

  test('multiply by zero returns 0000', () => {
    expect(hexMultiply('FF', '00')).toBe('0000');
  });
});

// ---------------------------------------------------------------------------
// Division
// ---------------------------------------------------------------------------
describe('hexDivide', () => {
  test('divides two normal hex values', () => {
    expect(hexDivide('1E', '06')).toBe('0005'); // 30 / 6 = 5
  });

  test('truncates decimal result (floor)', () => {
    expect(hexDivide('07', '02')).toBe('0003'); // 7 / 2 = 3.5 → 3
  });

  test('divides to zero', () => {
    expect(hexDivide('01', '02')).toBe('0000'); // 1 / 2 = 0.5 → 0
  });

  test('throws on division by zero', () => {
    expect(() => hexDivide('0A', '00')).toThrow('Division by zero');
  });

  test('throws on division by zero (hex 0)', () => {
    expect(() => hexDivide('FF', '0')).toThrow();
  });
});

// ---------------------------------------------------------------------------
// validateInput
// ---------------------------------------------------------------------------
describe('validateInput', () => {
  test('accepts a single hex digit (0-9)', () => {
    expect(validateInput('5')).toBe(true);
  });

  test('accepts a single hex letter (A-F)', () => {
    expect(validateInput('A')).toBe(true);
  });

  test('accepts lowercase hex letters', () => {
    expect(validateInput('ff')).toBe(true);
  });

  test('accepts two hex digits', () => {
    expect(validateInput('FF')).toBe(true);
  });

  test('accepts 00', () => {
    expect(validateInput('00')).toBe(true);
  });

  test('rejects three or more digits', () => {
    expect(validateInput('FFF')).toBe(false);
  });

  test('rejects non-hex characters', () => {
    expect(validateInput('1G')).toBe(false);
  });

  test('rejects empty string', () => {
    expect(validateInput('')).toBe(false);
  });

  test('rejects string with spaces', () => {
    expect(validateInput('A ')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// validateOutput
// ---------------------------------------------------------------------------
describe('validateOutput', () => {
  test('accepts a 1-digit hex result', () => {
    expect(validateOutput('F')).toBe(true);
  });

  test('accepts a 4-digit hex result', () => {
    expect(validateOutput('FFFF')).toBe(true);
  });

  test('accepts 0000', () => {
    expect(validateOutput('0000')).toBe(true);
  });

  test('rejects a 5-digit hex string', () => {
    expect(validateOutput('10000')).toBe(false);
  });

  test('rejects non-hex characters', () => {
    expect(validateOutput('ZZZZ')).toBe(false);
  });

  test('rejects empty string', () => {
    expect(validateOutput('')).toBe(false);
  });
});
