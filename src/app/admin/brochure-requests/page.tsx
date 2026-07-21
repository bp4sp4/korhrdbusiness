"use client";

import { useState, useEffect, useMemo, CSSProperties } from "react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

interface BrochureRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  mail_status: string; // pending | sent | failed
  sent_at: string | null;
  viewed_at: string | null;
  view_count: number;
  created_at: string;
  requestDate?: string;
}

const ACCENT = "#2b50c4";
const GRID =
  "44px 84px 138px minmax(0,1.3fr) 92px 130px 106px 116px";
const itemsPerPage = 10;

// ---- 스타일 ----
const S = {
  page: { background: "#fff", minHeight: "100vh" } as CSSProperties,
  main: {
    padding: "40px 40px 44px",
    maxWidth: 1280,
    margin: "0 auto",
    fontFamily: '"Pretendard", -apple-system, sans-serif',
    color: "#161b26",
  } as CSSProperties,
  headerRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
  } as CSSProperties,
  h2: {
    margin: "0 0 6px",
    fontSize: 26,
    fontWeight: 800,
    letterSpacing: "-.02em",
  } as CSSProperties,
  sub: { margin: 0, fontSize: 14, color: "#7c8494" } as CSSProperties,
  btnGhost: {
    height: 40,
    padding: "0 16px",
    borderRadius: 10,
    border: "1px solid #e6e8ee",
    background: "#fff",
    color: "#3a4252",
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
  } as CSSProperties,
  btnDanger: {
    height: 40,
    padding: "0 16px",
    borderRadius: 10,
    border: "1px solid #f3d3d3",
    background: "#fff",
    color: "#d0524f",
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
  } as CSSProperties,
  search: {
    width: "100%",
    height: 44,
    border: "1px solid #e6e8ee",
    borderRadius: 11,
    padding: "0 16px",
    fontSize: 14,
    color: "#2a3040",
    outline: "none",
    background: "#fbfcfe",
    fontFamily: "inherit",
  } as CSSProperties,
  tableWrap: {
    border: "1px solid #eef0f4",
    borderRadius: 14,
    overflow: "hidden",
  } as CSSProperties,
  thead: {
    display: "grid",
    gridTemplateColumns: GRID,
    alignItems: "center",
    background: "#f8f9fc",
    borderBottom: "1px solid #eef0f4",
    padding: "0 4px",
    height: 46,
    fontSize: 12,
    fontWeight: 700,
    color: "#8a93a6",
    letterSpacing: ".02em",
  } as CSSProperties,
  row: {
    display: "grid",
    gridTemplateColumns: GRID,
    alignItems: "center",
    padding: "0 4px",
    height: 60,
    borderBottom: "1px solid #f2f4f7",
    fontSize: 13.5,
    color: "#3a4252",
  } as CSSProperties,
  ellipsis: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  } as CSSProperties,
  badge: {
    display: "inline-flex",
    alignItems: "center",
    height: 26,
    padding: "0 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
  } as CSSProperties,
  detailBtn: {
    height: 30,
    padding: "0 12px",
    borderRadius: 8,
    border: "1px solid #dfe3ea",
    background: "#fff",
    color: ACCENT,
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
  } as CSSProperties,
  delBtn: {
    height: 30,
    padding: "0 11px",
    borderRadius: 8,
    border: "1px solid #f3dada",
    background: "#fff",
    color: "#d0524f",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  } as CSSProperties,
  empty: {
    padding: "56px 0",
    textAlign: "center",
    color: "#a2aab8",
    fontSize: 14,
  } as CSSProperties,
};

// ---- 뱃지 ----
function MailStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    sent: { label: "발송완료", bg: "#e9f6ef", color: "#1c8a51" },
    failed: { label: "발송실패", bg: "#fdecec", color: "#d0524f" },
    pending: { label: "대기", bg: "#f2f4f7", color: "#7c8494" },
  };
  const s = map[status] ?? map.pending;
  return (
    <span style={{ ...S.badge, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function ViewBadge({ row }: { row: BrochureRequest }) {
  if (!row.viewed_at) {
    return (
      <span style={{ ...S.badge, background: "#f2f4f7", color: "#8a93a6" }}>
        미열람
      </span>
    );
  }
  return (
    <span
      style={{ ...S.badge, background: "#eef2ff", color: ACCENT }}
      title={`최초 열람: ${formatDateTime(row.viewed_at)}`}
    >
      열람 {row.view_count}회
    </span>
  );
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---- 상세 모달 ----
function DetailModal({
  row,
  onClose,
  onDelete,
}: {
  row: BrochureRequest;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  const info = (title: string, body: React.ReactNode) => (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: "#2a3040",
          marginBottom: 9,
        }}
      >
        {title}
      </div>
      <div
        style={{
          border: "1px solid #eef0f4",
          borderRadius: 12,
          padding: "16px 18px",
          fontSize: 14,
          lineHeight: 1.7,
          color: "#3a4252",
          background: "#fcfcfe",
          wordBreak: "break-word",
        }}
      >
        {body}
      </div>
    </div>
  );
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20,26,42,.5)",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 28,
        zIndex: 2000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(600px,94vw)",
          maxHeight: "88vh",
          overflow: "auto",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 40px 90px -30px rgba(15,23,42,.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "26px 28px 18px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-.02em",
              color: "#161b26",
            }}
          >
            소개서 요청 상세
          </h3>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "1px solid #eef0f4",
              background: "#fff",
              color: "#7c8494",
              fontSize: 18,
              lineHeight: 1,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: "0 28px 28px" }}>
          <div
            style={{
              background: "#eef2ff",
              borderRadius: 14,
              padding: "20px 22px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
              marginBottom: 22,
            }}
          >
            {[
              ["이름", row.name],
              ["연락처", row.phone],
              ["신청일", row.requestDate || ""],
            ].map(([k, v]) => (
              <div key={k}>
                <div
                  style={{
                    fontSize: 12,
                    color: "#8a93a6",
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  {k}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: k === "이름" ? 800 : 700,
                    color: "#161b26",
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
          {info("이메일", row.email)}
          {info(
            "메일 발송",
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 10 }}
            >
              <MailStatusBadge status={row.mail_status} />
              <span style={{ color: "#6b7383", fontSize: 13.5 }}>
                {row.sent_at ? formatDateTime(row.sent_at) : ""}
              </span>
            </span>,
          )}
          {info(
            "소개서 열람",
            row.viewed_at ? (
              <span>
                <strong style={{ color: ACCENT }}>
                  열람 {row.view_count}회
                </strong>
                <span style={{ color: "#6b7383", marginLeft: 10 }}>
                  최초 열람 {formatDateTime(row.viewed_at)}
                </span>
              </span>
            ) : (
              <span style={{ color: "#8a93a6" }}>아직 열람하지 않았어요.</span>
            ),
          )}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              onClick={() => {
                if (confirm("정말 삭제하시겠습니까?")) onDelete(row.id);
              }}
              style={{
                height: 44,
                padding: "0 20px",
                borderRadius: 11,
                border: "1px solid #f3dada",
                background: "#fff",
                color: "#d0524f",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              삭제
            </button>
            <button
              onClick={onClose}
              style={{
                height: 44,
                padding: "0 24px",
                borderRadius: 11,
                border: "none",
                background: ACCENT,
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- 체크박스 ----
function Check({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <span
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 16,
        height: 16,
        borderRadius: 5,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: checked ? `1.5px solid ${ACCENT}` : "1.5px solid #c9cfda",
        background: checked ? ACCENT : "#fff",
        color: "#fff",
        fontSize: 11,
        lineHeight: 1,
      }}
    >
      {checked ? "✓" : ""}
    </span>
  );
}

// ---- 메인 컴포넌트 ----
const BrochureRequestsAdminPage = () => {
  const [data, setData] = useState<BrochureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      const { data, error } = await supabase
        .from("brochure_requests")
        .select(
          "id, name, phone, email, mail_status, sent_at, viewed_at, view_count, created_at",
        )
        .order("created_at", { ascending: false });
      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }
      setData(
        (data as BrochureRequest[]).map((item) => ({
          ...item,
          requestDate: item.created_at?.split("T")[0] || "",
        })),
      );
      setLoading(false);
    }
    fetchRequests();
  }, []);

  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (item) =>
        (item.name || "").toLowerCase().includes(q) ||
        (item.phone || "").includes(searchTerm.trim()) ||
        (item.email || "").toLowerCase().includes(q),
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = useMemo(
    () => filteredData.slice(startIndex, startIndex + itemsPerPage),
    [filteredData, startIndex],
  );

  const selected = data.find((r) => r.id === selectedId) || null;

  const handleExcelDownload = () => {
    const exportData = filteredData.map((item) => ({
      이름: item.name,
      연락처: item.phone,
      이메일: item.email,
      발송상태:
        item.mail_status === "sent"
          ? "발송완료"
          : item.mail_status === "failed"
            ? "발송실패"
            : "대기",
      열람여부: item.viewed_at ? `열람 ${item.view_count}회` : "미열람",
      최초열람: item.viewed_at ? formatDateTime(item.viewed_at) : "",
      신청일: item.requestDate,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "소개서요청");
    XLSX.writeFile(workbook, "소개서요청.xlsx");
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginatedData.map((item) => item.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((itemId) => itemId !== id),
    );
  };

  const deleteRows = async (ids: string[]) => {
    if (ids.length === 0) return;
    const { error } = await supabase
      .from("brochure_requests")
      .delete()
      .in("id", ids);
    if (!error) {
      setData((prev) => prev.filter((row) => !ids.includes(row.id)));
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
      if (selectedId !== null && ids.includes(selectedId)) setSelectedId(null);
    } else {
      alert("삭제 실패: " + error.message);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm("선택한 항목을 모두 삭제하시겠습니까?")) return;
    await deleteRows(selectedIds);
  };

  const allChecked =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedIds.includes(item.id));

  const rangeStart = filteredData.length === 0 ? 0 : startIndex + 1;
  const rangeEnd = Math.min(currentPage * itemsPerPage, filteredData.length);
  const viewedCount = filteredData.filter((r) => r.viewed_at).length;

  return (
    <AdminAuthGuard>
      <div style={S.page}>
        <main style={S.main}>
          <div style={S.headerRow}>
            <div>
              <h2 style={S.h2}>소개서 요청 관리</h2>
              <p style={S.sub}>
                총{" "}
                <strong style={{ color: ACCENT }}>
                  {filteredData.length}건
                </strong>
                의 요청 중{" "}
                <strong style={{ color: ACCENT }}>{viewedCount}건</strong>이
                소개서를 열람했어요.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={S.btnGhost} onClick={handleExcelDownload}>
                엑셀 다운로드
              </button>
              <button
                style={{
                  ...S.btnDanger,
                  opacity: selectedIds.length === 0 ? 0.5 : 1,
                  cursor: selectedIds.length === 0 ? "not-allowed" : "pointer",
                }}
                disabled={selectedIds.length === 0}
                onClick={handleDeleteSelected}
              >
                선택 삭제
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <input
              style={S.search}
              placeholder="이름, 연락처 또는 이메일 검색"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {loading ? (
            <div style={{ ...S.empty, padding: "80px 0" }}>불러오는 중…</div>
          ) : (
            <>
              <div style={S.tableWrap}>
                <div style={S.thead}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Check checked={allChecked} onChange={handleSelectAll} />
                  </div>
                  <div>이름</div>
                  <div>연락처</div>
                  <div>이메일</div>
                  <div>발송</div>
                  <div>열람</div>
                  <div>신청일</div>
                  <div style={{ textAlign: "center" }}>관리</div>
                </div>

                {paginatedData.length === 0 ? (
                  <div style={S.empty}>소개서 요청이 없습니다.</div>
                ) : (
                  paginatedData.map((r) => (
                    <div key={r.id} style={S.row}>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Check
                          checked={selectedIds.includes(r.id)}
                          onChange={(v) => handleSelectOne(r.id, v)}
                        />
                      </div>
                      <div style={{ fontWeight: 700, color: "#161b26" }}>
                        {r.name}
                      </div>
                      <div
                        style={{
                          color: "#5b6474",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {r.phone}
                      </div>
                      <div
                        style={{ ...S.ellipsis, color: "#3a4252" }}
                        title={r.email}
                      >
                        {r.email}
                      </div>
                      <div>
                        <MailStatusBadge status={r.mail_status} />
                      </div>
                      <div>
                        <ViewBadge row={r} />
                      </div>
                      <div
                        style={{
                          color: "#8a93a6",
                          fontSize: 13,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {r.requestDate}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          justifyContent: "center",
                        }}
                      >
                        <button
                          style={S.detailBtn}
                          onClick={() => setSelectedId(r.id)}
                        >
                          상세
                        </button>
                        <button
                          style={S.delBtn}
                          onClick={() => {
                            if (confirm("정말 삭제하시겠습니까?"))
                              deleteRows([r.id]);
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <span style={{ fontSize: 13, color: "#8a93a6" }}>
                  {rangeStart}–{rangeEnd} of {filteredData.length} 항목
                </span>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <button
                    style={{
                      height: 34,
                      padding: "0 13px",
                      borderRadius: 9,
                      border: "1px solid #e6e8ee",
                      background: "#fff",
                      color: currentPage === 1 ? "#c9cfda" : "#3a4252",
                      fontSize: 13,
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    }}
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                  >
                    이전
                  </button>
                  <span
                    style={{
                      height: 34,
                      minWidth: 34,
                      padding: "0 8px",
                      borderRadius: 9,
                      background: ACCENT,
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {totalPages === 0 ? 0 : currentPage} / {totalPages}
                  </span>
                  <button
                    style={{
                      height: 34,
                      padding: "0 13px",
                      borderRadius: 9,
                      border: "1px solid #e6e8ee",
                      background: "#fff",
                      color:
                        currentPage === totalPages || totalPages === 0
                          ? "#c9cfda"
                          : "#3a4252",
                      fontSize: 13,
                      cursor:
                        currentPage === totalPages || totalPages === 0
                          ? "not-allowed"
                          : "pointer",
                    }}
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                  >
                    다음
                  </button>
                </div>
              </div>
            </>
          )}
        </main>

        {selected && (
          <DetailModal
            row={selected}
            onClose={() => setSelectedId(null)}
            onDelete={(id) => deleteRows([id])}
          />
        )}
      </div>
    </AdminAuthGuard>
  );
};

export default BrochureRequestsAdminPage;
