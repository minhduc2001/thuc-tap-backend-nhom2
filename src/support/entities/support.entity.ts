import { BaseEntity, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { EPrioritySuport, EResloved } from '../support.enum';
import { User } from '@/user/user.entity';
import { Subject } from './subject.entity';
import { AbstractEntity } from '@/base/service/abstract-entity.service';

@Entity()
export class Support extends AbstractEntity {
  @Column()
  code: string;

  @Column({ nullable: false })
  title: string;

  @ManyToOne(() => Subject, (subject) => subject.support)
  @JoinColumn()
  subject: Subject;

  @Column()
  content: string;

  @Column('text', { array: true, default: [] })
  images: string[];

  @Column({ type: 'enum', default: EPrioritySuport.Low, enum: EPrioritySuport })
  priority: EPrioritySuport;

  @Column({ type: 'enum', default: EResloved.Pendding, enum: EResloved })
  resolved: EResloved;

  @ManyToOne(() => User, (user) => user.supports)
  @JoinColumn()
  user: User;
}
