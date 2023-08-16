import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { EPrioritySuport, EResloved } from '../support.enum';
import { Support } from './support.entity';
import { AbstractEntity } from '@/base/service/abstract-entity.service';

@Entity()
export class Subject extends AbstractEntity {
  @Column()
  desc: string;

  @Column({ nullable: false })
  title: string;

  @OneToMany(() => Support, (support) => support.subject)
  support: Support[];
}
