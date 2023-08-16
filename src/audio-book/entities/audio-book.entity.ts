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
import { Genre } from '@/genre/entities/genre.entity';
import { Author } from '@/author/entities/author.entity';
import { Comment } from '@/comment/entities/comment.entity';
import { History } from '@/history/entities/history.entity';
import { AudioBookLibrary } from '@/library/entities/audio-book-library.entity';

@Entity()
export class AudioBook extends AbstractEntity {
  @Column()
  title: string;

  @Column({ nullable: true, default: null })
  publishDate: number;

  @Column({ nullable: true, default: 0 })
  views?: number;

  @Column({ nullable: true, default: 0 })
  likes?: number;

  @Column({ nullable: true, default: '' })
  desc: string;

  @Column({ default: '', nullable: true })
  image: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ nullable: true })
  duration?: number;

  @Column({ nullable: true, type: 'boolean', default: true })
  free: boolean;

  @ManyToOne(() => Genre, (genre) => genre.audioBook)
  @JoinColumn()
  genre?: Genre;

  @ManyToMany(() => Author, (author) => author.audioBook)
  @JoinTable()
  author?: Author[];

  @OneToMany(() => Comment, (comment) => comment.audioBook)
  comment?: Comment[];

  @OneToMany(() => History, (history) => history.user)
  @JoinColumn()
  history?: History[];

  @OneToMany(
    () => AudioBookLibrary,
    (audioBookLibrary) => audioBookLibrary.audioBook,
  )
  audioBookLibrary?: AudioBookLibrary[];
}
