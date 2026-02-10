import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectFields1738294000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar columnas de technologies, repository_url y demo_url
    await queryRunner.query(`
      ALTER TABLE "projects" 
      ADD COLUMN IF NOT EXISTS "technologies" jsonb DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS "repository_url" text,
      ADD COLUMN IF NOT EXISTS "demo_url" text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar las columnas agregadas
    await queryRunner.query(`
      ALTER TABLE "projects" 
      DROP COLUMN IF EXISTS "technologies",
      DROP COLUMN IF EXISTS "repository_url",
      DROP COLUMN IF EXISTS "demo_url"
    `);
  }
}
