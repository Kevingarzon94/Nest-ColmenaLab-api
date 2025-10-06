import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MedicalOrder } from '../../medical-orders/entities/medical-order.entity';

@Entity('medications')
export class Medication {
  @PrimaryGeneratedColumn('uuid')
  medicationId: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  diseases: string;

  @ManyToMany(() => MedicalOrder, (medicalOrder) => medicalOrder.medications)
  medicalOrders: MedicalOrder[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
