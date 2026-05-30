import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
describe('renders all buttons', () => {
  test('renders all 16 hex digit buttons (0-F)', () => {
    render(<App />);
    ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'].forEach((d) => {
      expect(screen.getByTestId(`digit-${d}`)).toBeInTheDocument();
    });
  });

  test('renders all four operator buttons', () => {
    render(<App />);
    ['+', '-', '*', '/'].forEach((op) => {
      expect(screen.getByTestId(`op-${op}`)).toBeInTheDocument();
    });
  });

  test('renders equals and clear buttons', () => {
    render(<App />);
    expect(screen.getByTestId('equals')).toBeInTheDocument();
    expect(screen.getByTestId('clear')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Digit input → display updates
// ---------------------------------------------------------------------------
describe('digit input', () => {
  test('clicking a single digit updates the display', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('digit-A'));
    expect(screen.getByTestId('display').textContent).toBe('A');
  });

  test('clicking two digits builds a two-digit hex value', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('digit-1'));
    fireEvent.click(screen.getByTestId('digit-F'));
    expect(screen.getByTestId('display').textContent).toBe('1F');
  });

  test('input exceeding 2 digits is blocked — display stays at 2 chars', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('digit-A'));
    fireEvent.click(screen.getByTestId('digit-B'));
    fireEvent.click(screen.getByTestId('digit-C')); // should be ignored
    expect(screen.getByTestId('display').textContent).toBe('AB');
  });
});

// ---------------------------------------------------------------------------
// Operator selection
// ---------------------------------------------------------------------------
describe('operator selection', () => {
  test('clicking operator keeps the display showing the first operand', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('digit-1'));
    fireEvent.click(screen.getByTestId('digit-F'));
    fireEvent.click(screen.getByTestId('op-+'));
    // display must still show the first operand, not be cleared
    expect(screen.getByTestId('display').textContent).toBe('1F');
  });

  test('after operator, entering new digits starts fresh (not appended)', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('digit-A'));
    fireEvent.click(screen.getByTestId('op-+'));
    fireEvent.click(screen.getByTestId('digit-5'));
    // display should show the new operand, not 'A5'
    expect(screen.getByTestId('display').textContent).toBe('5');
  });
});

// ---------------------------------------------------------------------------
// Full operation flows
// ---------------------------------------------------------------------------
describe('full operation flows', () => {
  test('addition: 1F + 01 = 0020', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('digit-1'));
    fireEvent.click(screen.getByTestId('digit-F'));
    fireEvent.click(screen.getByTestId('op-+'));
    fireEvent.click(screen.getByTestId('digit-0'));
    fireEvent.click(screen.getByTestId('digit-1'));
    fireEvent.click(screen.getByTestId('equals'));
    expect(screen.getByTestId('display').textContent).toBe('0020');
  });

  test('subtraction: 1F - 0A = 0015', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('digit-1'));
    fireEvent.click(screen.getByTestId('digit-F'));
    fireEvent.click(screen.getByTestId('op--'));
    fireEvent.click(screen.getByTestId('digit-0'));
    fireEvent.click(screen.getByTestId('digit-A'));
    fireEvent.click(screen.getByTestId('equals'));
    expect(screen.getByTestId('display').textContent).toBe('0015');
  });

  test('multiplication: 0A * 03 = 001E', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('digit-0'));
    fireEvent.click(screen.getByTestId('digit-A'));
    fireEvent.click(screen.getByTestId('op-*'));
    fireEvent.click(screen.getByTestId('digit-0'));
    fireEvent.click(screen.getByTestId('digit-3'));
    fireEvent.click(screen.getByTestId('equals'));
    expect(screen.getByTestId('display').textContent).toBe('001E');
  });

  test('division: 1E / 06 = 0005', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('digit-1'));
    fireEvent.click(screen.getByTestId('digit-E'));
    fireEvent.click(screen.getByTestId('op-/'));
    fireEvent.click(screen.getByTestId('digit-0'));
    fireEvent.click(screen.getByTestId('digit-6'));
    fireEvent.click(screen.getByTestId('equals'));
    expect(screen.getByTestId('display').textContent).toBe('0005');
  });

  test('subtraction that would go negative returns 0000', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('digit-0'));
    fireEvent.click(screen.getByTestId('digit-5'));
    fireEvent.click(screen.getByTestId('op--'));
    fireEvent.click(screen.getByTestId('digit-0'));
    fireEvent.click(screen.getByTestId('digit-A'));
    fireEvent.click(screen.getByTestId('equals'));
    expect(screen.getByTestId('display').textContent).toBe('0000');
  });

  test('division by zero shows ERR', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('digit-A'));
    fireEvent.click(screen.getByTestId('op-/'));
    fireEvent.click(screen.getByTestId('digit-0'));
    fireEvent.click(screen.getByTestId('equals'));
    expect(screen.getByTestId('display').textContent).toBe('ERR');
  });
});

// ---------------------------------------------------------------------------
// Clear
// ---------------------------------------------------------------------------
describe('clear button', () => {
  test('clears the display back to 0', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('digit-A'));
    fireEvent.click(screen.getByTestId('digit-B'));
    fireEvent.click(screen.getByTestId('clear'));
    expect(screen.getByTestId('display').textContent).toBe('0');
  });

  test('clears mid-operation state so next digit starts fresh', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('digit-A'));
    fireEvent.click(screen.getByTestId('op-+'));
    fireEvent.click(screen.getByTestId('clear'));
    fireEvent.click(screen.getByTestId('digit-5'));
    expect(screen.getByTestId('display').textContent).toBe('5');
  });
});
