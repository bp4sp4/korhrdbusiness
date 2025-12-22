import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("❌ Slack webhook URL이 설정되지 않았습니다.");
      return NextResponse.json(
        { success: false, error: "Webhook URL not configured" },
        { status: 500 }
      );
    }

    console.log("📤 Slack 메시지 전송 시도:", {
      webhookUrl: webhookUrl.substring(0, 30) + "...",
      messageText: body.text,
    });

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log("📥 Slack API 응답:", {
      status: response.status,
      statusText: response.statusText,
      body: responseText,
    });

    if (!response.ok) {
      throw new Error(
        `Slack API error: ${response.status} - ${responseText}`
      );
    }

    console.log("✅ Slack 알림이 성공적으로 전송되었습니다.");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Slack 알림 전송 중 오류:", error);
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
