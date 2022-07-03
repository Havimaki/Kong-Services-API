import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Service } from "../../service/entity/service.entity"

@Entity('version')
@Unique("UQ_SERVICE_VERSION", ["serviceId", "number"])
export class Version {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: "int" })
  public serviceId: number;

  @Column({ type: 'varchar', length: 120 })
  public name: string;

  @Column({ type: 'varchar', length: 120, nullable: true, default: null })
  public description?: string;

  @Column({ type: "decimal", default: 1.0 })
  public number: number;

  @CreateDateColumn({ type: 'timestamp', select: false })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  public updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', select: false })
  public deletedAt?: Date;

  @ManyToOne(() => Service, (service) => service.versions)
  service: Service
}
