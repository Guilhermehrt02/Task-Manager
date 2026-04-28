import { Injectable } from '@nestjs/common';
import { last } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryTaskDto } from './dto/query-task.dto';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    create(title: string, userId: string) {
        return (this.prisma as any).task.create({
            data: {
                title,
                userId
            }
        })
    }

    async findAll(userId: string, query: QueryTaskDto) {
        const { completed, page = 1, limit = 10 } = query;
        
        const where: any = {
            userId
        }

        if (completed !== undefined) {
            where.completed = completed === 'true';
        }

        const tasks = await (this.prisma as any).task.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        })

        const total = await (this.prisma as any).task.count({
            where
        })

        return {
            data: tasks,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit)
            }
        }
    }

    async update(id: string, userId: string, data: any) {
        const task = await (this.prisma as any).task.findFirst({
            where: {
                id,
                userId
            }
        })

        if (!task) {
            throw new Error('Task not found')
        }

        return (this.prisma as any).task.update({
            where: {
                id
            },
            data
        })
    } 

    async delete(id: string, userId: string) {
        const task = await (this.prisma as any).task.findFirst({
            where: {
                id,
                userId
            }
        })

        if (!task) {
            throw new Error('Task not found')
        }

        return (this.prisma as any).task.delete({
            where: {
                id
            }
        })
    }
}
