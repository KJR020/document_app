import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Helper function to check if move is valid
async function isValidMove(targetId: number, toId: number): Promise<boolean> {
  // Check if trying to move to itself
  if (targetId === toId) {
    return false;
  }

  // Check if trying to move to its descendant
  const descendants = await prisma.directoryHierarchy.findMany({
    where: {
      ancestorId: targetId,
    },
    select: {
      descendantId: true,
    },
  });

  return !descendants.some((d) => d.descendantId === toId);
}

// Validation schema for directory move
const DirectoryMoveSchema = z.object({
  toDirectoryId: z
    .string()
    .or(z.number())
    .transform((val) => (typeof val === "string" ? parseInt(val) : val)),
});

// Move directory endpoint
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAdminUser();
    const body = await request.json();

    // Validate request body
    const result = DirectoryMoveSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.errors,
        },
        { status: 400 }
      );
    }

    const targetId = parseInt(params.id);
    const toId = result.data.toDirectoryId;

    // Prevent moving root directory
    if (targetId === 1) {
      return NextResponse.json(
        { error: "ルートディレクトリは移動できません" },
        { status: 400 }
      );
    }

    // Validate directories exist and move is valid
    const [targetDir, toDir, isValidMoveResult] = await Promise.all([
      prisma.directory.findUnique({ where: { id: targetId } }),
      prisma.directory.findUnique({ where: { id: toId } }),
      isValidMove(targetId, toId),
    ]);

    if (!targetDir || !toDir) {
      return NextResponse.json(
        { error: "One or more directories not found" },
        { status: 404 }
      );
    }

    if (!isValidMoveResult) {
      return NextResponse.json(
        {
          error:
            "Invalid move operation: Cannot move a directory into itself or its descendants",
        },
        { status: 400 }
      );
    }

    // Get current parent directory
    const currentParent = await prisma.directoryHierarchy.findFirst({
      where: {
        descendantId: targetId,
        depth: 1,
      },
      select: {
        ancestorId: true,
      },
    });

    const fromDirectoryId = currentParent?.ancestorId;

    if (!fromDirectoryId) {
      return NextResponse.json(
        { error: "Current parent directory not found" },
        { status: 404 }
      );
    }

    // Start transaction
    await prisma.$transaction(async (tx) => {
      // Remove old hierarchy entries
      await tx.directoryHierarchy.deleteMany({
        where: {
          descendantId: targetId,
          depth: { gt: 0 },
        },
      });

      // Insert new hierarchy entry
      await tx.directoryHierarchy.create({
        data: {
          ancestorId: toId,
          descendantId: targetId,
          depth: 1,
          createdBy: user.id,
        },
      });

      // Create directory move record
      await tx.directoryMove.create({
        data: {
          targetDirectoryId: targetId,
          fromDirectoryId,
          toDirectoryId: toId,
          movedBy: user.id,
        },
      });
    });

    revalidatePath("/documents");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error moving directory:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await getAdminUser();

    const directory = await prisma.directory.findUnique({
      where: {
        id: parseInt(params.id),
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    if (!directory) {
      return NextResponse.json(
        { error: "Directory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ directory });
  } catch (error) {
    console.error("Error fetching directory:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
