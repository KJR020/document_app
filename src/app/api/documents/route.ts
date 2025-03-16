import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DocumentsApiResponse } from "@/types/document";

export async function GET(
  request: Request
): Promise<NextResponse<DocumentsApiResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const directoryId = searchParams.get("directoryId");

    const where = {
      currentVersion: {
        isNot: null,
      },
      ...(directoryId && {
        currentVersion: {
          version: {
            parentDirectoryId: parseInt(directoryId),
          },
        },
      }),
    };

    const rawDocuments = await prisma.document.findMany({
      where,
      include: {
        currentVersion: {
          include: {
            version: true,
          },
        },
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    const documents = rawDocuments.map((doc) => ({
      id: doc.id,
      createdAt: doc.createdAt,
      createdBy: doc.createdBy,
      name: doc.currentVersion?.version.name ?? "",
      content: doc.currentVersion?.version.content ?? "",
      versionId: doc.currentVersion?.version.id ?? null,
      lastUpdatedAt: doc.currentVersion?.appliedAt ?? doc.createdAt,
      user: {
        username: doc.user.username,
        email: doc.user.email,
      },
    }));

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    const errorResponse: DocumentsApiResponse = {
      error: "Failed to fetch documents",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = await prisma.$transaction(async (tx) => {
      const document = await tx.document.create({
        data: {
          createdBy: 1,
        },
      });

      const documentChange = await tx.documentChange.create({
        data: {
          documentId: document.id,
          changeType: "CREATE",
          changedBy: 1,
        },
      });

      const documentVersion = await tx.documentVersion.create({
        data: {
          documentId: document.id,
          name: json.name || "",
          content: json.content || "",
          parentDirectoryId: json.directoryId,
          documentChangeId: documentChange.id,
        },
      });

      const currentDocument = await tx.currentDocumentVersion.create({
        data: {
          documentId: document.id,
          versionId: documentVersion.id,
        },
      });

      return { document, documentChange, documentVersion, currentDocument };
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Failed to create document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}
