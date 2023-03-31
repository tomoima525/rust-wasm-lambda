import { add } from "wasm-add";

export const handler = async (event: any) => {
  const num1 = event.num1 || 0;
  const num2 = event.num2 || 0;

  const sum = add(num1, num2);
  console.log("===", { sum });
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from serverless!",
      input: event,
    }),
  };
};
