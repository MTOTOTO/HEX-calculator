import { useState } from 'react';
import { hexAdd, hexSubtract, hexMultiply, hexDivide } from './utils/calculator';
import styles from './App.module.css';

const HEX_DIGITS = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
const OPERATORS = ['+', '-', '*', '/'];

export default function App() {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  // When true the next digit press starts a fresh input (replaces display)
  const [isNewEntry, setIsNewEntry] = useState(true);

  function handleDigit(digit) {
    if (isNewEntry) {
      setDisplay(digit);
      setIsNewEntry(false);
    } else if (display.length < 2) {
      setDisplay(display + digit);
    }
    // max 2 digits — ignore extra presses
  }

  function handleOperator(op) {
    setFirstOperand(display);
    setOperator(op);
    setIsNewEntry(true);
    // display intentionally unchanged — shows the first operand
  }

  function handleEquals() {
    if (firstOperand === null || operator === null) return;
    let result;
    try {
      switch (operator) {
        case '+': result = hexAdd(firstOperand, display); break;
        case '-': result = hexSubtract(firstOperand, display); break;
        case '*': result = hexMultiply(firstOperand, display); break;
        case '/': result = hexDivide(firstOperand, display); break;
        default: return;
      }
    } catch {
      setDisplay('ERR');
      setFirstOperand(null);
      setOperator(null);
      setIsNewEntry(true);
      return;
    }
    setDisplay(result);
    setFirstOperand(null);
    setOperator(null);
    setIsNewEntry(true);
  }

  function handleClear() {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setIsNewEntry(true);
  }

  return (
    <div className={styles.calculator}>
      <header className={styles.header}>
        <span>HEX</span>
        <span className={styles.sub}>Calculator</span>
      </header>

      <div className={styles.display} data-testid="display">
        {display}
      </div>

      {operator && (
        <div className={styles.opIndicator} data-testid="op-indicator">
          {firstOperand} {operator}
        </div>
      )}

      <div className={styles.grid}>
        {HEX_DIGITS.map((d) => (
          <button
            key={d}
            className={styles.digitBtn}
            onClick={() => handleDigit(d)}
            data-testid={`digit-${d}`}
          >
            {d}
          </button>
        ))}

        {OPERATORS.map((op) => (
          <button
            key={op}
            className={styles.opBtn}
            onClick={() => handleOperator(op)}
            data-testid={`op-${op}`}
          >
            {op}
          </button>
        ))}

        <button
          className={styles.equalBtn}
          onClick={handleEquals}
          data-testid="equals"
        >
          =
        </button>

        <button
          className={styles.clearBtn}
          onClick={handleClear}
          data-testid="clear"
        >
          C
        </button>
      </div>
    </div>
  );
}
