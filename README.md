# Rust-based WebAssembly (wasm) module as a Lambda Layer

This repo showcases how we can call wasm from Lambda layer

# Why we need this?

- By using Rust-based WebAssembly (wasm), we can access its power while keeping the functions accessible from TypeScript.
- Additionally, we can avoid including the wasm files in Lambda, which reduces the size and makes it reusable.

# Prerequisite

install `wasm-pack` to build wasm file from rust

```
cargo install wasm-pack
```

# How to use

1. Set your development Stack account

- create .env file and add your setup

```
ACCOUNT_NAME=xxx
```

2. Build wasm

- Compile wasm from Rust. In this example, we build `wasm-add` module into wasm file.

```
make build_wasm moduleName=wasm-add
```

3. Install files

This will link local dependencies as well

```
yarn install
```

4. Deploy

- Then call deploy

```
yarn cdk:deploy --profile={your profile}
```

# Accessing Lambda layer

- CDK's `NodejsFunction` uses esbuild under the hood, hence all js files in Lambda layer will be bundled into one `index.js` file
- This approach does not work with wasm since internally a wasm-js tries to access wasm in the same directory which is `/var/task` on Lambda.

```wasm-add.js
const path = require('path').join(__dirname, 'wasm_add_bg.wasm'); // path is `/var/task/wasm_add_bg.wasm`
const bytes = require('fs').readFileSync(path); // The file doesn't exist!

const wasmModule = new WebAssembly.Module(bytes);
```

- In order to call wasm from our Lambda, we deploy our wasm Lambda layer under `opt/nodejs/node_modules` (`NODE_PATH`)
- To do so, we copy all files under `layer/wasm-add/nodejs/node_modules` after `wasm-pack build`
  - This has another benefit; We don't have to add `/opt/xxx` in `tsconfig`'s `paths` because `layer/wasm-add` is accessible as a workspace from Lambda functions
- When we deploy, path should be `layers/{moduleName}` so that the same directory structure will be kept on `Lambda layer`

```
this.layer = new Lambda.LayerVersion(this, "Layer", {
  code: Lambda.Code.fromAsset(
    path.join(`${__dirname}/..`, "layers/wasm-add"),
  ),
  compatibleRuntimes: [Lambda.Runtime.NODEJS_16_X],
  description: "A layer with wasm",
});
```

- The Lambda function access `wasm-add` like this

```
import { add } from "wasm-add"; // we don't use `/opt/nodejs/wasm-add`!

export const handler = {...};
```

# Reference

- A tutorial for Rust wasm https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm#rust_and_webassembly_use_cases
- Rust wasm https://rustwasm.github.io/wasm-bindgen/examples/add.html
- Great explanation about not including the code from Lambda Layer in Lambda function https://www.shawntorsitano.com/2022/06/19/creating-lambda-layers-with-typescript-and-cdk-the-right-way/
