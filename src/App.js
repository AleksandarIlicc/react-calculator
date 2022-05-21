/* eslint-disable default-case */
/* eslint-disable no-undef */
import './App.css';
import OperationButton from './OperationButton';
import DigitButton from './DigitButton';
import { useReducer } from 'react';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  EVALUATE: 'evaluate'
}

const formatingInteger =  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

const formattingNumber = (number) => {
  if (number == null) return;
  const [integer, decimal] = number.toString().split('.');
  if (decimal == null) return formatingInteger.format(+integer);
  return `${formatingInteger.format(+integer)}.${+decimal}`;
}

const reducer = (state, { type, payload}) => {
  if(type === ACTIONS.ADD_DIGIT) {
    if(state.overwrite) {
      return {
        currentDigit: payload.digit,
        overwrite: false
      }
    }

    if (payload.digit === '0' && state.currentDigit === '0') return state;
    if (payload.digit === '.' && state.currentDigit?.includes('.')) return state;

    return {
      ...state,
      currentDigit: `${state.currentDigit || ""}${payload.digit}`,
    }
  }

  if (type === ACTIONS.CHOOSE_OPERATION) {
    if (state.currentDigit == null && state.prevDigit == null) return state;

    if (state.prevDigit == null) {
      return {
        currentDigit: null,
        prevDigit: state.currentDigit,
        operation: payload.operation
      }
    }

    if(state.currentDigit === null && state.prevDigit !== null && state.operation !== null ) {
      return {
        currentDigit: null,
        prevDigit: state.prevDigit,
        operation: payload.operation
      }
    }

    return {
      currentDigit: null,
      prevDigit: evaluate(state),
      operation: payload.operation
    }
  }

  if(type === ACTIONS.CLEAR) return {};

  if(type === ACTIONS.DELETE_DIGIT) {
    if(state.currentDigit == null) return state;

    return {
      currentDigit: state.currentDigit.slice(0, -1),
      prevDigit: state.prevDigit,
      operation: state.operation
    }
  }

  if(type === ACTIONS.EVALUATE) {
    if(state.currentDigit == null || state.prevDigit == null || state.operation == null) return state;

    return { 
      currentDigit: evaluate(state),
      overwrite: true
    }
  }
  
}

const evaluate = ({ currentDigit, prevDigit, operation }) => {
  if(operation === '÷') {
      return +prevDigit / +currentDigit;
  }
  if(operation === '*') {
      return +prevDigit * +currentDigit;
  }
  if(operation === '+') {
      return +prevDigit + +currentDigit;
  }
  if(operation === '-') {
      return +prevDigit - +currentDigit;
  }
}

function App() {
  const [{ currentDigit, prevDigit, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className="container">
      <div className="calculator-grid">
        <div className="shape"></div>
        <div className="output">
          <div className="previous-operand">{formattingNumber(prevDigit)} {operation}</div>
          <div className="current-operand">{formattingNumber(currentDigit)}</div>
        </div>
        <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton operation="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      </div>
    </div>
  )
}

export default App;
