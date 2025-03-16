import { getAdminUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DocumentChange, DocumentHistoryResponse } from "@/types/document";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAdminUser();

    const documentId = parseInt(params.id, 10);
    if (isNaN(documentId)) {
      return NextResponse.json(
        { error: "Invalid document ID" },
        { status: 400 }
      );
    }

    // ドキュメントの存在確認
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // バージョン履歴の取得
    const versions = await prisma.documentVersion.findMany({
      where: { documentId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
      },
    });

    // 変更履歴の取得
    const changes = await prisma.documentChange.findMany({
      where: { documentId },
      orderBy: { changedAt: "desc" },
      select: {
        id: true,
        changeType: true,
        changedAt: true,
        user: {
          select: {
            username: true,
            email: true,
          },
        },
        documentVersion: {
          select: {
            id: true,
            name: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });

    const response: DocumentHistoryResponse = {
      history: {
        versions,
        changes: changes.map((change) => ({
          id: change.id,
          changeType: change.changeType,
          changedAt: change.changedAt,
          changedBy: change.user,
          documentVersion: change.documentVersion || undefined,
        })),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching document history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
