import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal } from "lucide-react";

export interface ConsultationTableRow {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  experience: string;
  field: string;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: string;
  requestDate?: string;
}

type DataTableProps = {
  data: ConsultationTableRow[];
  onStatusChange: (id: string, status: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
};

export default function DataTable({
  data,
  onStatusChange,
  getStatusBadge,
}: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">이름</TableHead>
            <TableHead className="font-semibold">연락처</TableHead>
            <TableHead className="font-semibold">경력</TableHead>
            <TableHead className="font-semibold">분야</TableHead>
            <TableHead className="font-semibold">상담유형</TableHead>
            <TableHead className="font-semibold">희망일</TableHead>
            <TableHead className="font-semibold">희망시간</TableHead>
            <TableHead className="font-semibold">메시지</TableHead>
            <TableHead className="font-semibold">상태</TableHead>
            <TableHead className="font-semibold">신청일</TableHead>
            <TableHead className="font-semibold text-center">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={String(item.id)} className="hover:bg-muted/30">
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium flex items-center gap-2">
                    {item.name}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    {item.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>{item.phone}</TableCell>
              <TableCell>{item.experience}</TableCell>
              <TableCell>
                <Badge variant="outline">{item.field}</Badge>
              </TableCell>
              <TableCell>{item.consultationType}</TableCell>
              <TableCell>{item.preferredDate}</TableCell>
              <TableCell>{item.preferredTime}</TableCell>
              <TableCell>{item.message}</TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell>{item.requestDate}</TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="상세보기"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          onStatusChange(String(item.id), "approved")
                        }
                        className="text-blue-600"
                      >
                        승인
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onStatusChange(String(item.id), "rejected")
                        }
                        className="text-red-600"
                      >
                        거절
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onStatusChange(String(item.id), "completed")
                        }
                        className="text-green-600"
                      >
                        완료 처리
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
