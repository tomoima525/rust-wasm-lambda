import { aws_lambda as lambda } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";

export class LayerStack extends Construct {
  public readonly layer: lambda.LayerVersion;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.layer = new lambda.LayerVersion(this, "Layer", {
      code: lambda.Code.fromAsset(
        path.join(`${__dirname}/..`, "layers/wasm-add"),
      ),
      compatibleRuntimes: [lambda.Runtime.NODEJS_16_X],
      description: "A layer with wasm",
    });
  }
}
