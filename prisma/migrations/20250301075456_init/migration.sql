-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_versions" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "document_change_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "current_document_versions" (
    "document_id" INTEGER NOT NULL,
    "version_id" INTEGER NOT NULL,
    "applied_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "current_document_versions_pkey" PRIMARY KEY ("document_id")
);

-- CreateTable
CREATE TABLE "document_changes" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "change_type" TEXT NOT NULL,
    "changed_by" INTEGER NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentVersionId" INTEGER,

    CONSTRAINT "document_changes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "directories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directory_versions" (
    "id" SERIAL NOT NULL,
    "directory_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "directory_change_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "directory_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "current_directory_versions" (
    "directory_id" INTEGER NOT NULL,
    "version_id" INTEGER NOT NULL,
    "applied_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "current_directory_versions_pkey" PRIMARY KEY ("directory_id")
);

-- CreateTable
CREATE TABLE "directory_changes" (
    "id" SERIAL NOT NULL,
    "directory_id" INTEGER NOT NULL,
    "version_id" INTEGER NOT NULL,
    "change_type" TEXT NOT NULL,
    "changed_by" INTEGER NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "directory_changes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directory_hierarchy" (
    "ancestor_id" INTEGER NOT NULL,
    "descendant_id" INTEGER NOT NULL,
    "depth" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "directory_hierarchy_pkey" PRIMARY KEY ("ancestor_id","descendant_id")
);

-- CreateTable
CREATE TABLE "directory_moves" (
    "id" SERIAL NOT NULL,
    "target_directory_id" INTEGER NOT NULL,
    "from_parent_id" INTEGER NOT NULL,
    "to_parent_id" INTEGER NOT NULL,
    "moved_by" INTEGER NOT NULL,
    "moved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "directory_moves_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "current_document_versions_version_id_key" ON "current_document_versions"("version_id");

-- CreateIndex
CREATE UNIQUE INDEX "current_directory_versions_version_id_key" ON "current_directory_versions"("version_id");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "current_document_versions" ADD CONSTRAINT "current_document_versions_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "current_document_versions" ADD CONSTRAINT "current_document_versions_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "document_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_changes" ADD CONSTRAINT "document_changes_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_changes" ADD CONSTRAINT "document_changes_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_changes" ADD CONSTRAINT "document_changes_documentVersionId_fkey" FOREIGN KEY ("documentVersionId") REFERENCES "document_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directories" ADD CONSTRAINT "directories_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directory_versions" ADD CONSTRAINT "directory_versions_directory_id_fkey" FOREIGN KEY ("directory_id") REFERENCES "directories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "current_directory_versions" ADD CONSTRAINT "current_directory_versions_directory_id_fkey" FOREIGN KEY ("directory_id") REFERENCES "directories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "current_directory_versions" ADD CONSTRAINT "current_directory_versions_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "directory_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directory_changes" ADD CONSTRAINT "directory_changes_directory_id_fkey" FOREIGN KEY ("directory_id") REFERENCES "directories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directory_changes" ADD CONSTRAINT "directory_changes_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "directory_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directory_changes" ADD CONSTRAINT "directory_changes_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directory_hierarchy" ADD CONSTRAINT "directory_hierarchy_ancestor_id_fkey" FOREIGN KEY ("ancestor_id") REFERENCES "directories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directory_hierarchy" ADD CONSTRAINT "directory_hierarchy_descendant_id_fkey" FOREIGN KEY ("descendant_id") REFERENCES "directories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directory_moves" ADD CONSTRAINT "directory_moves_target_directory_id_fkey" FOREIGN KEY ("target_directory_id") REFERENCES "directories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directory_moves" ADD CONSTRAINT "directory_moves_from_parent_id_fkey" FOREIGN KEY ("from_parent_id") REFERENCES "directories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directory_moves" ADD CONSTRAINT "directory_moves_to_parent_id_fkey" FOREIGN KEY ("to_parent_id") REFERENCES "directories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directory_moves" ADD CONSTRAINT "directory_moves_moved_by_fkey" FOREIGN KEY ("moved_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
