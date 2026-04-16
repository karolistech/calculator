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
  error: false,
  input: ""
};

function inputDigit(digit: string) {
  if (state.error === true) return;

  state.input = state.input === "0" ? digit : state.input + digit;

  primaryOutput.textContent = state.input;
}

function inputDecimalPoint() {
  if (state.error === true || state.input.includes(".")) return;

  state.input = state.input === "" ? "0." : state.input + ".";

  primaryOutput.textContent = state.input;
}

function inputOperator(operator: Operator) {
  if (state.error === true) return;

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

function evaluate() {
  if (state.firstOperand === null || state.operator === null || state.input === "") return;

  state.secondOperand = Number(state.input);

  const { firstOperand, operator, secondOperand } = state;

  const result = calculate(firstOperand, operator, secondOperand);
  if (Number.isNaN(result)) state.error = true;

  secondaryOutput.textContent = `${firstOperand} ${operators[operator]} ${secondOperand} =`;
  primaryOutput.textContent = String(result);

  state.firstOperand = result;
  state.operator = null;
  state.secondOperand = null;
  state.input = "";
}

function calculate(a: number, operator: Operator, b: number) {
  switch (operator) {
    case "add":
      return a + b;
    case "subtract":
      return a - b;
    case "multiply":
      return a * b;
    case "divide":
      return a / b;
  }
}

function clear() {
  state.firstOperand = null;
  state.operator = null;
  state.secondOperand = null;
  state.error = false;
  state.input = "";
  secondaryOutput.textContent = "";
  primaryOutput.textContent = "0";
}

function del() {
  if (state.error === true || state.input === "") return;

  state.input = state.input.slice(0, -1);

  primaryOutput.textContent = state.input || "0";
}

function handleButtonInput(e: Event) {
  if (!(e.target instanceof HTMLButtonElement)) return;

  const { digit, decimalPoint, operator, action } = e.target.dataset;

  if (digit) inputDigit(digit);
  if (decimalPoint) inputDecimalPoint();
  if (operator) inputOperator(operator as Operator);
  if (action === "clear") clear();
  if (action === "del") del();
  if (action === "evaluate") evaluate();
}

function init() {
  buttons.addEventListener("click", handleButtonInput);
}

init();
