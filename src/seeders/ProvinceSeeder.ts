import { Seeder } from '@mikro-orm/seeder';
import { ProvinceEntity } from 'src/locations/province.entity';

export class ProvinceSeeder extends Seeder {
    async run(em: Parameters<Seeder['run']>[0]) {
        const now = new Date();

        const provinces = [
            { id: crypto.randomUUID(), name: 'Cundinamarca', createdAt: now, updatedAt: now },
            { id: crypto.randomUUID(), name: 'Antioquia', createdAt: now, updatedAt: now },
            { id: crypto.randomUUID(), name: 'Valle del Cauca', createdAt: now, updatedAt: now },
        ];
        for (const province of provinces) {
            em.create(ProvinceEntity, province);
        }
    }
}
