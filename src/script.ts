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
