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

const buttons = $(".calculator__buttons", HTMLDivElement);

type Operator = "add" | "subtract" | "multiply" | "divide";

type State =
  | { type: "operand1"; input: string }
  | { type: "operator"; operand1: number; operator: Operator }
  | { type: "operand2"; operand1: number; operator: Operator; input: string }
  | { type: "result"; operand1: number; operator: Operator; operand2: number; result: number };

type Calculator = {
  state: State;
};

const calculator: Calculator = {
  state: { type: "operand1", input: "0" }
};

function setState(state: State) {
  calculator.state = state;
}

function handleButtonInput(e: Event) {
  if (!(e.target instanceof HTMLButtonElement)) return;

  const { digit, decimalPoint, operator, action } = e.target.dataset;
}

function init() {
  buttons.addEventListener("click", handleButtonInput);
}

init();
