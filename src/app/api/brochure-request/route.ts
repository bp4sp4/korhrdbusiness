import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

// 소개서 받기 신청 처리
// 1) brochure_requests 테이블에 리드 저장
// 2) 다음 스마트워크 SMTP(admin@korhrdcorp.co.kr)로 소개서 열람 메일 발송
// 3) 슬랙 알림 (실패해도 접수는 성공 처리)

// Vercel: SMTP 통신은 10초 초과될 수 있음
export const runtime = "nodejs";
export const maxDuration = 60;

const SITE_URL = "https://www.eduvisor.kr";
const SENDER_NAME = "에듀바이저스";

const isValidPhone = (phone: string) =>
  /^(010\d{8}|011\d{7,8})$/.test(phone.replace(/\D/g, ""));
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildMailHtml(name: string, viewUrl: string) {
  const safeName = escapeHtml(name);
  return `
  <div style="margin:0;padding:32px 16px;background-color:#f4f6f9;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;">
    <div style="max-width:560px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e9f0;">
      <div style="padding:32px 32px 24px;border-bottom:1px solid #eef1f5;">
        <img src="${SITE_URL}/images/logo-full.png" alt="에듀바이저스" width="110" height="28"
          style="display:block;border:0;" />
        <h1 style="margin:12px 0 0;font-size:22px;line-height:1.4;color:#111827;">
          ${safeName}님, 요청하신<br/>에듀바이저스 소개서를 보내드려요
        </h1>
      </div>
      <div style="padding:28px 32px 36px;">
        <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#4b5563;">
          아래 버튼을 누르시면 소개서를 바로 열람하실 수 있습니다.<br/>
          궁금하신 점은 언제든 편하게 문의해주세요.
        </p>
        <a href="${viewUrl}"
          style="display:block;text-align:center;background-color:#2563eb;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 0;border-radius:12px;">
          소개서 열람하기
        </a>
        <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#9ca3af;">
          버튼이 눌리지 않는 경우 아래 주소를 복사해 브라우저에 붙여넣어 주세요.<br/>
          <a href="${viewUrl}" style="color:#6b7280;">${viewUrl}</a>
        </p>
      </div>
      <div style="padding:20px 32px;background-color:#f9fafb;border-top:1px solid #eef1f5;">
        <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
          에듀바이저스 · 본 메일은 소개서 요청에 따라 발송되었습니다.
        </p>
      </div>
    </div>
  </div>`;
}

async function sendSlackNotification(data: {
  name: string;
  phone: string;
  email: string;
}) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return;
  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: "📄 새로운 소개서 요청이 접수되었습니다!",
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: "소개서 요청", emoji: true },
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*이름:*\n${data.name}` },
            { type: "mrkdwn", text: `*연락처:*\n${data.phone}` },
            { type: "mrkdwn", text: `*이메일:*\n${data.email}` },
          ],
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `📅 접수시간: ${new Date().toLocaleString("ko-KR", {
                timeZone: "Asia/Seoul",
              })}`,
            },
          ],
        },
      ],
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const name = String(body?.name ?? "")
      .trim()
      .slice(0, 50);
    const phone = String(body?.phone ?? "")
      .trim()
      .slice(0, 20);
    const email = String(body?.email ?? "")
      .trim()
      .slice(0, 100);

    if (!name || !isValidPhone(phone) || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "이름/연락처/이메일을 확인해주세요." },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const smtpUser = process.env.BROCHURE_SMTP_USER;
    const smtpPass = process.env.BROCHURE_SMTP_PASS;

    if (!supabaseUrl || !serviceKey || !smtpUser || !smtpPass) {
      console.error("❌ 소개서 발송 환경변수가 설정되지 않았습니다.");
      return NextResponse.json(
        { success: false, error: "서버 설정 오류입니다." },
        { status: 500 },
      );
    }

    // service role 클라이언트 (RLS 우회, 서버 전용)
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 1) 리드 저장
    const { data: row, error: insertError } = await admin
      .from("brochure_requests")
      .insert([{ name, phone, email }])
      .select("id")
      .single();

    if (insertError || !row) {
      console.error("❌ brochure_requests insert 실패:", insertError);
      return NextResponse.json(
        { success: false, error: "접수 저장에 실패했습니다." },
        { status: 500 },
      );
    }

    // 2) 소개서 열람 메일 발송 (다음 스마트워크 SMTP)
    const viewUrl = `${SITE_URL}/api/brochure/view?id=${row.id}`;
    const transporter = nodemailer.createTransport({
      host: "smtp.daum.net",
      port: 465,
      secure: true,
      auth: { user: smtpUser, pass: smtpPass },
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 30_000,
    });

    try {
      await transporter.sendMail({
        from: { name: SENDER_NAME, address: smtpUser },
        to: email,
        subject: `[에듀바이저스] ${name}님, 요청하신 소개서를 보내드립니다`,
        html: buildMailHtml(name, viewUrl),
      });
    } catch (mailErr) {
      console.error("❌ 소개서 메일 발송 실패:", mailErr);
      // 발송 실패 시 리드는 남기되 상태 기록
      await admin
        .from("brochure_requests")
        .update({ mail_status: "failed" })
        .eq("id", row.id);
      return NextResponse.json(
        {
          success: false,
          error: "메일 발송에 실패했습니다. 다시 시도해주세요.",
        },
        { status: 500 },
      );
    }

    await admin
      .from("brochure_requests")
      .update({ mail_status: "sent", sent_at: new Date().toISOString() })
      .eq("id", row.id);

    // 3) 슬랙 알림 (실패해도 무시)
    try {
      await sendSlackNotification({ name, phone, email });
    } catch (slackErr) {
      console.error("소개서 요청 슬랙 알림 실패:", slackErr);
    }

    return NextResponse.json({ success: true, id: row.id }, { status: 201 });
  } catch (error) {
    console.error("❌ brochure-request 처리 중 오류:", error);
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
