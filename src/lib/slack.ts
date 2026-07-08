// 슬랙 알림 클라이언트 헬퍼.
// 실제 메시지 조립은 서버(/api/slack)에서 수행한다. 클라이언트는 알림 종류와
// 필드 값만 전달하므로, 외부에서 임의의 슬랙 메시지/블록을 주입할 수 없다.

export type SlackNotificationType = "counseling" | "recruit" | "partner";

export async function sendSlackNotification(
  type: SlackNotificationType,
  data: Record<string, string>
) {
  try {
    const response = await fetch("/api/slack", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, data }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Slack 알림 전송 실패: ${response.status} - ${errorText}`
      );
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "알 수 없는 오류");
    }
  } catch (error) {
    console.error("❌ Slack 알림 전송 중 오류:", error);
    throw error; // 호출자가 처리할 수 있도록 다시 throw
  }
}
