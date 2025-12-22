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
  console.log("🔍 Slack 알림 전송 시도...", message);

  try {
    const response = await fetch("/api/slack", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Slack API 응답 오류:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(
        `Slack 알림 전송 실패: ${response.status} - ${errorText}`
      );
    }

    const result = await response.json();
    if (result.success) {
      console.log("✅ Slack 알림이 성공적으로 전송되었습니다.");
    } else {
      console.error("❌ Slack 알림 전송 실패:", result.error);
      throw new Error(result.error || "알 수 없는 오류");
    }
  } catch (error) {
    console.error("❌ Slack 알림 전송 중 오류:", error);
    throw error; // 에러를 다시 throw하여 호출자가 처리할 수 있도록
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
          text: "교육 상담 신청",
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

export function createRecruitApplicationNotification(data: {
  name: string;
  phone: string;
  location: string;
  message: string;
  jobTitle: string;
}) {
  const message = {
    text: "📝 새로운 채용 지원서가 접수되었습니다!",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "채용 지원서 접수",
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*채용 공고:*\n${data.jobTitle}`,
          },
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
            text: `*거주지:*\n${data.location}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*하고싶은말:*\n${data.message || "-"}`,
        },
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
