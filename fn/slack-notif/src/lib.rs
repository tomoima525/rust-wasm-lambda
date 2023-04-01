use reqwest::Client;
use reqwest::Error;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub async fn send_slack_message(webhook_url: &str, message: &str) -> Result<JsValue, JsValue> {
    let payload = format!(r#"{}"#, message);
    let client = Client::new();
    let res = client
        .post(webhook_url)
        .header("Content-Type", "application/json")
        .body(payload)
        .send()
        .await
        .map_err(|e: Error| JsValue::from_str(&e.to_string()))?;
    if !res.status().is_success() {
        return Err(JsValue::from_str(&format!(
            "Slack API returned code: {} and Message:{}",
            res.status(),
            res.text().await.unwrap()
        )));
    }

    Ok(JsValue::from_str("Slack API Success"))
}
