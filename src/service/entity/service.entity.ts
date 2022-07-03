import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany
} from 'typeorm';
import { Version } from "../../version/entity/version.entity"

@Entity('service')
export class Service {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', length: 120 })
  public name: string;

  @Column({ type: 'varchar', length: 120, default: null })
  public description?: string;

  @CreateDateColumn({ type: 'timestamp', select: false })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  public updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', select: false })
  public deletedAt?: Date;

  @OneToMany(() => Version, (version) => version.service)
  versions: Version[]
}
