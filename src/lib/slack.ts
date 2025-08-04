interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
    emoji?: boolean;
  };
  fields?: {
    type: string;
    text: string;
  }[];
  elements?: {
    type: string;
    text: string;
  }[];
}

interface SlackMessage {
  text: string;
  blocks?: SlackBlock[];
}

export async function sendSlackNotification(message: SlackMessage) {
  console.log("🔍 Slack 알림 전송 시도...");

  try {
    const response = await fetch("/api/slack", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Slack 알림 전송 실패: ${response.status}`);
    }

    const result = await response.json();
    if (result.success) {
      console.log("Slack 알림이 성공적으로 전송되었습니다.");
    } else {
      throw new Error(result.error || "알 수 없는 오류");
    }
  } catch (error) {
    console.error("Slack 알림 전송 중 오류:", error);
  }
}

export function createCounselingNotification(data: {
  name: string;
  phone: string;
  experience: string;
  field: string;
}) {
  const message = {
    text: "🎓 새로운 교육 상담 신청이 접수되었습니다!",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🎓 새로운 교육 상담 신청",
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*이름:*\n${data.name}`,
          },
          {
            type: "mrkdwn",
            text: `*연락처:*\n${data.phone}`,
          },
          {
            type: "mrkdwn",
            text: `*최종학력:*\n${data.experience}`,
          },
          {
            type: "mrkdwn",
            text: `*관심분야:*\n${data.field}`,
          },
        ],
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `📅 접수시간: ${new Date().toLocaleString("ko-KR", {
              timeZone: "Asia/Seoul",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}`,
          },
        ],
      },
    ],
  };

  return message;
}
