import { Seeder } from '@mikro-orm/seeder';
import { RoleEntity } from '../roles/role.entity';

export class RoleSeeder extends Seeder {
  async run(em: Parameters<Seeder['run']>[0]) {
    const now = new Date();

    const roles = [
      { id: crypto.randomUUID(), name: 'Admin', description: 'Administrador del sistema', createdAt: now, updatedAt: now },
      { id: crypto.randomUUID(), name: 'User', description: 'Usuario normal', createdAt: now, updatedAt: now },
    ];

    for (const role of roles) {
      em.create(RoleEntity, role);
    }
  }
}
