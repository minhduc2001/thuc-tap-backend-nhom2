import { Processor, OnQueueActive, Process } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/user/user.entity';

@Processor('terminate-package')
@Injectable()
export class TerminatePackageConsumer {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Process('cancelSubscription')
  async onActive(job) {
    const userId = job.data.userId;
    const user = await this.userRepository.findOne(userId);

    if (user && Number(user.packageExpire) <= new Date().getTime()) {
      user.packageId = null;
      user.packageExpire = null;
      await user.save();
      console.log(`Terminated package`);
    }
  }
}
