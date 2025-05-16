// seed.ts
import { DataSource } from 'typeorm';
import { User } from './src/user/user.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
    const AppDataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '1234',
        database: 'userdb',
        entities: [User],
        synchronize: true,
    });

    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);

    const existingSuperAdmin = await userRepository.findOneBy({
        email: 'superadmin@example.com',
    });

    if (existingSuperAdmin) {
        console.log('Super Admin already exists.');
        process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('SuperSecurePassword123', 10);

    const superAdmin = userRepository.create({
        username: 'superadmin',
        email: 'superadmin@example.com',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
    } as Partial<User>);

    await userRepository.save(superAdmin);

    console.log('Super Admin user created successfully!');
    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
