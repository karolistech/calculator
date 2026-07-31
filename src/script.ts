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
  configuration: { maxInputLength: number; maxDisplayLength: number };
  operatorSymbols: Record<Operator, string>;
  state: State;
};

const calculator: Calculator = {
  configuration: { maxInputLength: 12, maxDisplayLength: 16 },
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
      previousInput.textContent = `${format(state.operand1)} ${symbols[state.operator]}`;
      currentInput.textContent = format(state.operand1);
      return;

    case "operand2":
      previousInput.textContent = `${format(state.operand1)} ${symbols[state.operator]}`;
      currentInput.textContent = state.input;
      return;

    case "result":
      previousInput.textContent = `${format(state.operand1)} ${symbols[state.operator]} ${format(state.operand2)} =`;
      currentInput.textContent = format(state.result);
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
  const config = calculator.configuration;
  const state = calculator.state;

  switch (state.type) {
    case "operand1":
      if (state.input.length >= config.maxInputLength) return;

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
      if (state.input.length >= config.maxInputLength) return;

      return setState({
        type: "operand2",
        operand1: state.operand1,
        operator: state.operator,
        input: state.input === "0" ? digit : state.input + digit
      });

    case "result":
      setState({ type: "operand1", input: digit });
  }
}

function inputDecimalPoint(decimalPoint: string) {
  const state = calculator.state;

  switch (state.type) {
    case "operand1":
      if (state.input.includes(decimalPoint)) return;

      return setState({
        type: "operand1",
        input: state.input + decimalPoint
      });

    case "operator":
      return setState({
        type: "operand2",
        operand1: state.operand1,
        operator: state.operator,
        input: "0" + decimalPoint
      });

    case "operand2":
      if (state.input.includes(decimalPoint)) return;

      return setState({
        type: "operand2",
        operand1: state.operand1,
        operator: state.operator,
        input: state.input + decimalPoint
      });

    case "result":
      setState({ type: "operand1", input: "0" + decimalPoint });
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

    case "operand2":
      const operand2 = Number(state.input);
      const result = calculate(state.operand1, state.operator, operand2);

      return setState({
        type: "operator",
        operand1: result,
        operator: operator
      });

    case "result":
      setState({
        type: "operator",
        operand1: state.result,
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

function format(value: number): string {
  const config = calculator.configuration;

  const fixed = value.toFixed(12).replace(/\.?0+$/, "");
  if (fixed.length <= config.maxDisplayLength) return fixed;

  const rounded = value.toFixed(6).replace(/\.?0+$/, "");
  if (rounded.length <= config.maxDisplayLength) return rounded;

  const scientific = value.toExponential(6).replace(/\.?0+e/, "e");
  return scientific;
}

function handleButtonInput(e: Event) {
  if (!(e.target instanceof HTMLButtonElement)) return;

  const { digit, decimalPoint, operator, action } = e.target.dataset;

  if (digit) inputDigit(digit);
  if (decimalPoint) inputDecimalPoint(decimalPoint);
  if (operator === "add") inputOperator(operator);
  if (operator === "subtract") inputOperator(operator);
  if (operator === "multiply") inputOperator(operator);
  if (operator === "divide") inputOperator(operator);
  if (action === "clear") inputClear();
  if (action === "delete") inputDelete();
  if (action === "evaluate") inputEvaluate();
}

function handleKeyboardInput(e: KeyboardEvent) {
  const key = e.key;

  if (key >= "0" && key <= "9") inputDigit(key);
  if (key === ".") inputDecimalPoint(key);
  if (key === "+") inputOperator("add");
  if (key === "-") inputOperator("subtract");
  if (key === "*") inputOperator("multiply");
  if (key === "/") { e.preventDefault(); inputOperator("divide"); }
  if (key === "Escape") inputClear();
  if (key === "Backspace") inputDelete();
  if (key === "=" || key === "Enter") { e.preventDefault(); inputEvaluate(); }
}

function init() {
  document.addEventListener("keydown", handleKeyboardInput);
  buttons.addEventListener("click", handleButtonInput);
}

init();
