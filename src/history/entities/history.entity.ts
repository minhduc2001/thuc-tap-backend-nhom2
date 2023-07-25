import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from '@base/service/abstract-entity.service';
import { User } from '@/user/user.entity';
import { AudioBook } from '@/audio-book/entities/audio-book.entity';

@Entity()
export class History extends AbstractEntity {
  @ManyToOne(() => User, (user) => user.history)
  @JoinColumn()
  user: User;

  @ManyToOne(() => AudioBook, (audioBook) => audioBook.history)
  @JoinColumn()
  audioBook: AudioBook;

  @Column({ nullable: true, default: 0 })
  duration: number;
}
