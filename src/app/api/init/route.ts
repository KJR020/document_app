import { NextResponse } from "next/server";
import { seed } from "@/lib/seed";

export async function GET() {
  try {
    const { adminUser, rootDirectory } = await seed();
    return NextResponse.json({
      message: "Initialization completed successfully",
      adminUser: { id: adminUser.id, email: adminUser.email },
      rootDirectory: { id: rootDirectory.id, name: rootDirectory.name },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Initialization failed:", errorMessage);
    return NextResponse.json(
      { error: "Failed to initialize: " + errorMessage },
      { status: 500 }
    );
  }
}
