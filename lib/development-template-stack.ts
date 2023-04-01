import { Stack, StackProps } from "aws-cdk-lib";
import {
  aws_lambda_nodejs as lambda_nodejs,
  aws_lambda as lambda,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";
import { LayerStack } from "./layer-stack";

export class DevelopmentTemplateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const layerStack = new LayerStack(this, "LayerStack");
    new lambda_nodejs.NodejsFunction(this, "Add Function", {
      description: "Add two numbers",
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "handler",
      entry: path.join(
        `${__dirname}/../`,
        "functions",
        "simple-function/index.ts",
      ),
      layers: [layerStack.layer],
      bundling: {
        externalModules: [
          "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
          "wasm-add",
        ],
      },
    });

    new lambda_nodejs.NodejsFunction(this, "Slack Notification", {
      description: "Send slack notification",
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "handler",
      entry: path.join(`${__dirname}/../`, "functions", "slack/index.ts"),
      layers: [layerStack.slackLayer],
      environment: {
        SLACK_WEBHOOK_URL:
          // "https://hooks.slack.com/services/xxx/yyy/zzz",
          "Set your own webhook url",
      },
      bundling: {
        externalModules: [
          "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
          "slack-notif",
        ],
      },
    });
  }
}
