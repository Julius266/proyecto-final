import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTeacherSubjectUnique1738299000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Eliminar el constraint único anterior (solo curriculumSubjectId)
    await queryRunner.query(`
      ALTER TABLE "teacher_subjects" 
      DROP CONSTRAINT IF EXISTS "UQ_270944526388fb4963450e8dcab";
    `);

    // Crear el nuevo constraint único (teacherId + curriculumSubjectId)
    await queryRunner.query(`
      ALTER TABLE "teacher_subjects" 
      ADD CONSTRAINT "UQ_teacher_curriculum_subject" 
      UNIQUE ("teacher_id", "curriculum_subject_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir: eliminar el nuevo constraint
    await queryRunner.query(`
      ALTER TABLE "teacher_subjects" 
      DROP CONSTRAINT IF EXISTS "UQ_teacher_curriculum_subject";
    `);

    // Restaurar el constraint anterior
    await queryRunner.query(`
      ALTER TABLE "teacher_subjects" 
      ADD CONSTRAINT "UQ_270944526388fb4963450e8dcab" 
      UNIQUE ("curriculum_subject_id");
    `);
  }
}
