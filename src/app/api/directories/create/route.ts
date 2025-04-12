import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { getAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const admin = await getAdminUser();
  try {
    const json = await request.json();
    const { name, parentId } = json;

    if (!name || !parentId) {
      return NextResponse.json(
        { error: "Name and parent directory ID are required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Create the directory first
        const directory = await tx.directory.create({
          data: {
            name,
            createdBy: admin.id,
          },
        });

        // Create directory version
        const version = await tx.directoryVersion.create({
          data: {
            name,
            directoryId: directory.id,
            directoryChangeId: -1, // Temporary ID
          },
        });

        // Create directory change
        const change = await tx.directoryChange.create({
          data: {
            directoryId: directory.id,
            versionId: version.id,
            changeType: "CREATE",
            changedBy: admin.id,
          },
        });

        // Update the version with the correct change ID
        await tx.directoryVersion.update({
          where: { id: version.id },
          data: { directoryChangeId: change.id },
        });

        // Create current version
        await tx.currentDirectoryVersion.create({
          data: {
            directoryId: directory.id,
            versionId: version.id,
          },
        });

        // Create hierarchy relationship with parent
        await tx.directoryHierarchy.create({
          data: {
            ancestorId: parentId,
            descendantId: directory.id,
            depth: 1,
            createdBy: admin.id,
          },
        });

        // Directory needs to reference itself in the hierarchy
        await tx.directoryHierarchy.create({
          data: {
            ancestorId: directory.id,
            descendantId: directory.id,
            depth: 0,
            createdBy: admin.id,
          },
        });

        return directory;
      }
    );

    return NextResponse.json({ directory: result });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to create directory:", errorMessage);
    return NextResponse.json(
      { error: "Failed to create directory: " + errorMessage },
      { status: 500 }
    );
  }
}
