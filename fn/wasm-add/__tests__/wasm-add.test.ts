import { add } from "../pkg/wasm_add";
describe("add", () => {
  it("should return add", () => {
    expect(add(1, 2)).toBe(3);
  });
});
