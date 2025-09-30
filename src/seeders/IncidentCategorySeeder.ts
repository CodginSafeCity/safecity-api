import { Seeder } from '@mikro-orm/seeder';
import { IncidentCategoryEntity } from '../incident-categories/incident-category.entity';

export class IncidentCategorySeeder extends Seeder {
    async run(em: Parameters<Seeder['run']>[0]) {
        const now = new Date();

        em.create(IncidentCategoryEntity, {
            id: crypto.randomUUID(),
            name: 'Robo',
            description: 'Reportes relacionados con hurtos o robos.',
            icon: 'robbery.png',
            createdAt: now, 
            updatedAt: now,
        });

        em.create(IncidentCategoryEntity, {
            id: crypto.randomUUID(),
            name: 'Accidente de tráfico',
            description: 'Reportes de accidentes vehiculares o de tránsito.',
            icon: 'traffic.png',
            createdAt: now, 
            updatedAt: now,
        });

        em.create(IncidentCategoryEntity, {
            id: crypto.randomUUID(),
            name: 'Violencia',
            description: 'Incidentes relacionados con violencia física o verbal.',
            icon: 'violence.png',
            createdAt: now, 
            updatedAt: now,
        });

        em.create(IncidentCategoryEntity, {
            id: crypto.randomUUID(),
            name: 'Emergencia médica',
            description: 'Reportes de emergencias de salud o médicas.',
            icon: 'medical.png',
            createdAt: now, 
            updatedAt: now,
        });


    }
}