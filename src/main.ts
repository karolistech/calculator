const primaryOutput = document.querySelector<HTMLOutputElement>(".calculator__output--primary")!;
const secondaryOutput = document.querySelector<HTMLOutputElement>(".calculator__output--secondary")!;
const buttons = document.querySelector<HTMLDivElement>(".calculator__buttons")!;

const state = {
  input: ""
};

function inputDigit(digit: string) {
  state.input = state.input === "0" ? digit : state.input + digit;
  primaryOutput.textContent = state.input;
}

function handleButtonInput(e: Event) {
  if (!(e.target instanceof HTMLButtonElement)) return;

  const { digit, decimalPoint, operator, action } = e.target.dataset;

  if (digit) inputDigit(digit);
}

function init() {
  buttons.addEventListener("click", handleButtonInput);
}

init();
