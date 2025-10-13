import { Seeder } from '@mikro-orm/seeder';
import { UserEntity } from '../user/user.entity';
import { RoleEntity } from '../roles/role.entity';
import { CityEntity } from '../locations/city.entity';
import { IncidentCategoryEntity } from '../incident-categories/incident-category.entity';
import { ProvinceEntity } from 'src/locations/province.entity';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

export class MainSeeder extends Seeder {
    async run(em: Parameters<Seeder['run']>[0]) {
        //PROVINCES
        const now = new Date();
        const provinces = [
            { id: crypto.randomUUID(), name: 'Cundinamarca', createdAt: now, updatedAt: now },
            { id: crypto.randomUUID(), name: 'Antioquia', createdAt: now, updatedAt: now },
            { id: crypto.randomUUID(), name: 'Valle del Cauca', createdAt: now, updatedAt: now },
        ];
        for (const province of provinces) {
            em.create(ProvinceEntity, province);
        }

        //CITIES
        const cundinamarca = await em.findOne(ProvinceEntity, { name: 'Cundinamarca' });
        const antioquia = await em.findOne(ProvinceEntity, { name: 'Antioquia' });
        const valle = await em.findOne(ProvinceEntity, { name: 'Valle del Cauca' });

        if (!cundinamarca || !antioquia || !valle) {
            throw new Error('Primero corre ProvinceSeeder antes de CitySeeder');
        }

        const cities = [
            { name: 'Bogotá', province: cundinamarca as ProvinceEntity, createdAt: now, updatedAt: now },
            { name: 'Medellín', province: antioquia as ProvinceEntity, createdAt: now, updatedAt: now },
            { name: 'Cali', province: valle as ProvinceEntity, createdAt: now, updatedAt: now },
        ];

        for (const city of cities) {
            em.create(CityEntity, city);
        }

        //ROLES
        const roles = [
            { id: crypto.randomUUID(), name: 'Admin', description: 'Administrador del sistema', createdAt: now, updatedAt: now },
            { id: crypto.randomUUID(), name: 'User', description: 'Usuario normal', createdAt: now, updatedAt: now },
            { id: crypto.randomUUID(), name: 'Verifier', description: 'Usuario Verificador', createdAt: now, updatedAt: now },
        ];

        for (const role of roles) {
            em.create(RoleEntity, role);
        }

        //INCIDENT-CATEGORIES
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

        //USERS
        const password = await bcrypt.hash('123456', 10);
        const role = await em.findOne(RoleEntity, { name: 'User' });
        const city = await em.findOne(CityEntity, { name: 'Bogotá' });
        if (!role) {
            throw new Error('Role Admin no existe, corre RoleSeeder primero');
        }
        if (!city) {
            throw new Error('City Bogotá no existe, corre CitySeeder primero');
        }
        em.create(UserEntity, {
            email: 'hozkar178@gmail.com',
            name: 'Oscar',
            last_name: 'Guerrero',
            password,
            role,
            city,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        for (let i = 0; i < 15; i++) {
            em.create(UserEntity, {
                email: faker.internet.email(),
                name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                password,
                role,
                city,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

    }
}
