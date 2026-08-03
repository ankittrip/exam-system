import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditAction } from '@prisma/client';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}


  async logAction(userId: string, action: AuditAction, entity: string, entityId?: string, metadata?: any) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        metadata: metadata || {},
      },
    });
  }


  async getLogs() {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100, 
      include: {
        user: { select: { email: true, role: true } },
      },
    });
  }
}