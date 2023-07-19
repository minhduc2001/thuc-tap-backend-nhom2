import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@base/service/abstract-entity.service';
import { User } from '@/user/user.entity';
import { AudioBook } from '@/audio-book/entities/audio-book.entity';

@Entity()
export class Comment extends AbstractEntity {
  @Column({ nullable: false })
  content: string;

  @Column({ nullable: true, default: 0 })
  likes: string;

  @Column({ nullable: true, default: null })
  parentCommentId: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  reply: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  author: User;

  @ManyToOne(() => AudioBook, (audioBook) => audioBook.comment)
  @JoinColumn()
  audioBook: AudioBook;
}
