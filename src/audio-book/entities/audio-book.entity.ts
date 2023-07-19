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
  publicationDate: Date;

  @Column({ nullable: true, default: 0 })
  views: number;

  @Column({ nullable: true, default: 0 })
  likes: number;

  @Column({ nullable: true, default: 0 })
  followers: number;

  @Column({ nullable: true, default: '' })
  description: string;

  @Column({ type: 'boolean', default: false })
  accomplished: boolean;

  @Column({ default: '', nullable: true })
  image: string;

  @ManyToOne(() => Genre, (genre) => genre.audioBook)
  @JoinColumn()
  genre: Genre;

  @ManyToMany(() => Author, (author) => author.audioBook)
  @JoinTable()
  author: Author[];

  @OneToMany(() => Comment, (comment) => comment.audioBook)
  comment: Comment;

  @OneToMany(() => History, (history) => history.user)
  @JoinColumn()
  history: History[];

  @OneToMany(
    () => AudioBookLibrary,
    (audioBookLibrary) => audioBookLibrary.audioBook,
  )
  audioBookLibrary: AudioBookLibrary[];
}
