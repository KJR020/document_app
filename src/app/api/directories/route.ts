import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";

interface DirectoryNode {
  id: number;
  name: string;
  children: {
    directories: DirectoryNode[];
    documents: Array<{
      id: number;
      name: string;
    }>;
  };
}

async function buildDirectoryTree(
  rootId: number
): Promise<DirectoryNode | null> {
  const directory = await prisma.directory.findUnique({
    where: { id: rootId },
    include: {
      currentVersion: {
        include: {
          version: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      versions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!directory) {
    return null;
  }

  // Get the name either from current version or latest version
  const directoryName =
    directory.currentVersion?.version.name ||
    (directory.versions[0]?.name ?? "Untitled");

  // Get child directories
  const childDirectories = await prisma.directoryHierarchy.findMany({
    where: {
      ancestorId: rootId,
      depth: 1, // Direct children only
    },
    include: {
      descendant: {
        include: {
          currentVersion: {
            include: {
              version: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          versions: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  // Get documents in this directory
  const documents = await prisma.documentVersion.findMany({
    where: {
      parentDirectoryId: rootId,
      currentVersion: {
        isNot: null,
      },
    },
    include: {
      currentVersion: true,
    },
  });

  // Build children recursively
  const children = await Promise.all(
    childDirectories.map((child) => buildDirectoryTree(child.descendantId))
  );

  return {
    id: directory.id,
    name: directory.currentVersion?.version.name || directoryName,
    children: {
      directories: children.filter(
        (child): child is DirectoryNode => child !== null
      ),
      documents: documents
        .filter((doc) => doc.currentVersion) // Only include documents that are current versions
        .map((doc) => ({
          id: doc.documentId,
          name: doc.name,
        })),
    },
  };
}

export async function GET() {
  try {
    const admin = await getAdminUser();

    // Find or create root directory if it doesn't exist
    let rootDirectory = await prisma.directory.findFirst({
      where: {
        name: "root",
        createdBy: admin.id,
      },
    });

    if (!rootDirectory) {
      // Root directory should be created by init endpoint
      return NextResponse.json(
        {
          error:
            "Root directory not found. Please ensure the app is initialized.",
        },
        { status: 500 }
      );
    }

    const tree = await buildDirectoryTree(rootDirectory.id);
    if (!tree) {
      throw new Error("Failed to build directory tree");
    }
    return NextResponse.json({ directory: tree });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to fetch directory structure:", errorMessage);
    return NextResponse.json(
      { error: "Failed to fetch directory structure: " + errorMessage },
      { status: 500 }
    );
  }
}
