import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL no está configurado");
}

const adapter = new PrismaPg({
    connectionString,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    const email = "admin@controlgastos.com";
    const password = "123456";

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: {
            email,
        },
        update: {
            name: "Administrador",
            passwordHash,
            activo: true,
        },
        create: {
            name: "Administrador",
            email,
            passwordHash,
            activo: true,
            configuracion: {
                create: {
                    avisarPorCorreo: true,
                    diasAviso: [3, 2, 0],
                },
            },
        },
    });

    console.log("Usuario creado/actualizado:");
    console.log({
        id: user.id,
        email,
        password,
    });
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });