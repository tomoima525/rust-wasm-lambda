import { send_slack_message } from "slack-notif";
const webhookUrl = process.env.SLACK_WEBHOOK_URL as string;
const composeMessage = ({
  title,
  message,
}: {
  title: string;
  message: string;
}) =>
  JSON.stringify({
    text: `Slack Notification`,
    attachments: [
      {
        color: "#FFD600",
        fields: [
          {
            title,
            value: message,
            short: true,
          },
        ],
      },
    ],
  });

export const handler = async (event: any) => {
  const { message, title } = event;
  const result = await send_slack_message(
    webhookUrl,
    composeMessage({ title, message }),
  );
  console.log({ result });
  return {};
};
