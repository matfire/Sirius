import { Body, Controller, Post } from '@nestjs/common';
import { Record } from '@prisma/client';
import { RecordService } from './record.service';

@Controller('record')
export class RecordController {
  constructor(private recordService: RecordService) {}
  @Post('/')
  async createRecord(
    @Body() data: { date: Date; latitude: string; longitude: string },
  ): Promise<Record> {
    console.log('creating record');
    return this.recordService.createRecord({
      ...data,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
    });
  }
}
