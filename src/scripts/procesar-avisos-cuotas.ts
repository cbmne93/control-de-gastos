import "dotenv/config";

import { procesarAvisosCuotasJob } from "@/features/cuotas/jobs/procesar-avisos-cuotas.job";
import { prisma } from "@/lib/prisma-client";

async function main() {
    const result = await procesarAvisosCuotasJob();

    console.info(JSON.stringify(result, null, 2));
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });