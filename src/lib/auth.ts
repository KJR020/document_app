import { prisma } from "./prisma";

export async function getAdminUser() {
  const admin = await prisma.user.findFirst({
    where: { email: "admin@example.com" },
  });

  if (!admin) {
    throw new Error(
      "Admin user not found. Please ensure the app is initialized."
    );
  }

  return admin;
}
