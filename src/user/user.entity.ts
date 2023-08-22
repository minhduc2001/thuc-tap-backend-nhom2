import { Column, Entity, JoinColumn, ManyToMany, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { JoinTable } from 'typeorm';

import { AbstractEntity } from '@base/service/abstract-entity.service';

import { ERole } from '@/role/enum/roles.enum';
import { Permission } from '@/role/entities/permission.entity';
import { EState } from '@shared/enum/common.enum';
import { Payment } from '@/payment/entities/payment.entity';
import { Library } from '@/library/entities/library.entity';
import { History } from '@/history/entities/history.entity';
import { Support } from '@/support/entities/support.entity';

@Entity()
export class User extends AbstractEntity {
  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true, unique: true })
  phone: string;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  background: string;

  @Column({ nullable: false, type: 'enum', enum: ERole, default: ERole.Guest })
  role: ERole;

  @ManyToMany(() => Permission, (permission) => permission)
  @JoinTable()
  permissions: Permission[];

  // @Column({ nullable: true, default: null })
  // packageId: number;

  // @Column({ type: 'bigint', nullable: true, default: null })
  // packageExpire: string;

  @Column({ type: 'enum', enum: EState, default: EState.Active })
  state: EState;

  @Exclude()
  @Column({ nullable: true, default: null })
  refreshToken: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @OneToMany(() => Support, (support) => support.user)
  supports: Support[];

  @OneToMany(() => Payment, (payment) => payment.user)
  @JoinColumn()
  payments: Payment[];

  @OneToMany(() => History, (history) => history.user)
  @JoinColumn()
  history: History[];

  @OneToMany(() => Library, (library) => library.user)
  @JoinColumn()
  library: Library[];

  @Column({ nullable: true, default: null })
  packageId: number;

  @Column({ type: 'bigint', nullable: true, default: null })
  packageExpire: string;

  setPassword(password: string) {
    this.password = bcrypt.hashSync(password, 10);
  }

  setRefreshToken(refreshToken: string) {
    this.refreshToken = bcrypt.hashSync(refreshToken, 10);
  }

  comparePassword(rawPassword: string): boolean {
    const userPassword = this.password;
    return bcrypt.compareSync(rawPassword, userPassword);
  }

  compareRefreshToken(rawRefreshToken: string): boolean {
    const refreshToken = this.refreshToken;
    return bcrypt.compareSync(rawRefreshToken, refreshToken);
  }
}
