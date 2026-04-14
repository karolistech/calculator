const primaryOutput = document.querySelector<HTMLOutputElement>(".calculator__output--primary")!;
const secondaryOutput = document.querySelector<HTMLOutputElement>(".calculator__output--secondary")!;
const buttons = document.querySelector<HTMLDivElement>(".calculator__buttons")!;

type Operator = "add" | "subtract" | "multiply" | "divide";

const operators: Record<Operator, string> = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷"
};

const state = {
  firstOperand: null as number | null,
  operator: null as Operator | null,
  secondOperand: null as number | null,
  input: ""
};

function inputDigit(digit: string) {
  state.input = state.input === "0" ? digit : state.input + digit;
  primaryOutput.textContent = state.input;
}

function inputOperator(operator: Operator) {
  if (state.operator === null && state.input !== "") {
    state.firstOperand = Number(state.input);
    state.operator = operator;
    state.input = "";

    secondaryOutput.textContent = `${state.firstOperand} ${operators[operator]}`;
  }

  else if (state.firstOperand !== null && state.input === "") {
    state.operator = operator;

    secondaryOutput.textContent = `${state.firstOperand} ${operators[operator]}`;
  }
}

function handleButtonInput(e: Event) {
  if (!(e.target instanceof HTMLButtonElement)) return;

  const { digit, decimalPoint, operator, action } = e.target.dataset;

  if (digit) inputDigit(digit);
  if (operator) inputOperator(operator as Operator);
}

function init() {
  buttons.addEventListener("click", handleButtonInput);
}

init();
