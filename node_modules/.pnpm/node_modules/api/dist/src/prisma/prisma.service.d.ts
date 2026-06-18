import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
export declare class PrismaService implements OnModuleInit, OnModuleDestroy {
    private client;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    get db(): PrismaClient<import("../../generated/prisma").Prisma.PrismaClientOptions, never, import("generated/prisma/runtime/client").DefaultArgs>;
}
