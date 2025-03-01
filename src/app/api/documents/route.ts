import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const documents = await prisma.currentDocumentVersion.findMany({
      include: {
        document: true,
        version: true,
      },
    });
    return NextResponse.json(documents);
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
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
