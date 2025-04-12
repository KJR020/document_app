import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

import { getAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateDocumentPayload } from "@/types/document";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAdminUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documentId = parseInt(params.id);
    if (isNaN(documentId)) {
      return Response.json({ error: "Invalid document ID" }, { status: 400 });
    }

    const data = (await request.json()) as UpdateDocumentPayload;

    // Create a new document version
    const documentChange = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Get current version to get directory info
        const currentVersion = await tx.currentDocumentVersion.findUnique({
          where: { documentId },
          include: { version: true },
        });

        // If no current version exists, get the document's first version
        const latestVersion = currentVersion
          ? currentVersion.version
          : await tx.documentVersion.findFirst({
              where: { documentId },
              orderBy: { createdAt: "desc" },
            });

        if (!latestVersion) {
          throw new Error("No document version found");
        }

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
            // Use the same directory as the previous version
            parentDirectoryId: latestVersion.parentDirectoryId,
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
