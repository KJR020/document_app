import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";
import { UpdateDocumentPayload } from "@/types/document";
import { type Prisma, DocumentChange } from "@prisma/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await auth();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documentId = parseInt(params.id);
    if (isNaN(documentId)) {
      return Response.json({ error: "Invalid document ID" }, { status: 400 });
    }

    const data = (await request.json()) as UpdateDocumentPayload;

    // Create a new document version
    const documentChange = await prisma.$transaction<DocumentChange>(
      async (tx) => {
        // Create document change record
        const change = await tx.documentChange.create({
          data: {
            documentId,
            changeType: "UPDATE",
            changedBy: user.id,
          },
        });

        // Create new version
        const newVersion = await tx.documentVersion.create({
          data: {
            documentId,
            name: data.name,
            content: data.content,
            documentChangeId: change.id,
          },
        });

        // Update current version reference
        await tx.currentDocumentVersion.upsert({
          where: {
            documentId,
          },
          create: {
            documentId,
            versionId: newVersion.id,
          },
          update: {
            versionId: newVersion.id,
          },
        });

        return change;
      }
    );

    return Response.json({ success: true, changeId: documentChange.id });
  } catch (error) {
    console.error("Error updating document:", error);
    return Response.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}
