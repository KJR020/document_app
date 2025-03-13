import { prisma } from "./prisma";

export async function seed() {
  try {
    // Create admin user if it doesn't exist
    let adminUser = await prisma.user.findFirst({
      where: { email: "admin@example.com" },
    });

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          username: "admin",
          email: "admin@example.com",
          passwordHash: "dummy", // TODO: Replace with proper hashed password
        },
      });
      console.log("Created admin user");
    }

    // Create root directory if it doesn't exist
    let rootDirectory = await prisma.directory.findFirst({
      where: {
        name: "root",
        createdBy: adminUser.id,
      },
    });

    if (!rootDirectory) {
      rootDirectory = await prisma.$transaction(async (tx) => {
        // Create the directory
        const directory = await tx.directory.create({
          data: {
            name: "root",
            createdBy: adminUser.id,
          },
        });

        // Create directory version
        const version = await tx.directoryVersion.create({
          data: {
            name: "root",
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
            changedBy: adminUser.id,
          },
        });

        // Update version with correct change ID
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

        // Create self-referential hierarchy
        await tx.directoryHierarchy.create({
          data: {
            ancestorId: directory.id,
            descendantId: directory.id,
            depth: 0,
            createdBy: adminUser.id,
          },
        });

        return directory;
      });

      console.log("Created root directory");
    }

    return { adminUser, rootDirectory };
  } catch (error) {
    console.error("Seed error:", error);
    throw error;
  }
}
