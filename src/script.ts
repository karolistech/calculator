function $<T extends HTMLElement>(selector: string, constructor: new () => T): T {
  const element = document.querySelector(selector);

  if (element === null) {
    throw new Error(`Element "${selector}" was not found`);
  }

  if (!(element instanceof constructor)) {
    throw new TypeError(`Element "${selector}" is not an instance of ${constructor.name}`);
  }

  return element;
}

const previousInput = $(".calculator__input--previous", HTMLDivElement);
const currentInput = $(".calculator__input--current", HTMLDivElement);
const buttons = $(".calculator__buttons", HTMLDivElement);

type Operator = "add" | "subtract" | "multiply" | "divide";

type State =
  | { type: "operand1"; input: string }
  | { type: "operator"; operand1: number; operator: Operator }
  | { type: "operand2"; operand1: number; operator: Operator; input: string }
  | { type: "result"; operand1: number; operator: Operator; operand2: number; result: number };

type Calculator = {
  operatorSymbols: Record<Operator, string>;
  state: State;
};

const calculator: Calculator = {
  operatorSymbols: { add: "+", subtract: "−", multiply: "×", divide: "÷" },
  state: { type: "operand1", input: "0" }
};

function setState(state: State) {
  calculator.state = state;

  render();
}

function render() {
  const state = calculator.state;
  const symbols = calculator.operatorSymbols;

  switch (state.type) {
    case "operand1":
      previousInput.textContent = "";
      currentInput.textContent = state.input;
      return;

    case "operator":
      previousInput.textContent = `${state.operand1} ${symbols[state.operator]}`;
      currentInput.textContent = String(state.operand1);
      return;

    case "operand2":
      previousInput.textContent = `${state.operand1} ${symbols[state.operator]}`;
      currentInput.textContent = state.input;
      return;

    case "result":
      previousInput.textContent = `${state.operand1} ${symbols[state.operator]} ${state.operand2} =`;
      currentInput.textContent = String(state.result);
  }
}

function inputClear() {
  setState({ type: "operand1", input: "0" });
}

function inputDelete() {
  const state = calculator.state;

  switch (state.type) {
    case "operand1":
      return setState({
        type: "operand1",
        input: state.input.slice(0, -1) || "0"
      });

    case "operand2":
      setState({
        type: "operand2",
        operand1: state.operand1,
        operator: state.operator,
        input: state.input.slice(0, -1) || "0"
      });
  }
}

function inputDigit(digit: string) {
  const state = calculator.state;

  switch (state.type) {
    case "operand1":
      return setState({
        type: "operand1",
        input: state.input === "0" ? digit : state.input + digit
      });

    case "operator":
      return setState({
        type: "operand2",
        operand1: state.operand1,
        operator: state.operator,
        input: digit
      });

    case "operand2":
      return setState({
        type: "operand2",
        operand1: state.operand1,
        operator: state.operator,
        input: state.input === "0" ? digit : state.input + digit
      });
  }
}

function inputOperator(operator: Operator) {
  const state = calculator.state;

  switch(state.type) {
    case "operand1":
      return setState({
        type: "operator",
        operand1: Number(state.input),
        operator: operator
      });

    case "operator":
      return setState({
        type: "operator",
        operand1: state.operand1,
        operator: operator
      });
  }
}

function inputEvaluate() {
  const state = calculator.state;

  switch (state.type) {
    case "operand2":
      const operand2 = Number(state.input);
      const result = calculate(state.operand1, state.operator, operand2);

      setState({
        type: "result",
        operand1: state.operand1,
        operator: state.operator,
        operand2: operand2,
        result: result
      });
  }
}

function calculate(operand1: number, operator: Operator, operand2: number): number {
  switch (operator) {
    case "add":
      return operand1 + operand2;

    case "subtract":
      return operand1 - operand2;

    case "multiply":
      return operand1 * operand2;

    case "divide":
      return operand1 / operand2;
  }
}

function handleButtonInput(e: Event) {
  if (!(e.target instanceof HTMLButtonElement)) return;

  const { digit, decimalPoint, operator, action } = e.target.dataset;

  if (digit) inputDigit(digit);
  if (operator === "add") inputOperator(operator);
  if (operator === "subtract") inputOperator(operator);
  if (operator === "multiply") inputOperator(operator);
  if (operator === "divide") inputOperator(operator);
  if (action === "clear") inputClear();
  if (action === "delete") inputDelete();
  if (action === "evaluate") inputEvaluate();
}

function init() {
  buttons.addEventListener("click", handleButtonInput);
}

init();
