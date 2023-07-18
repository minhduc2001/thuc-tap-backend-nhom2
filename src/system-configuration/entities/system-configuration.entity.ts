import { AbstractEntity } from '@/base/service/abstract-entity.service';
import { Column, Entity } from 'typeorm';

@Entity()
export class SystemConfiguration extends AbstractEntity {
  @Column()
  favicon: string;

  @Column()
  title: string;
}
