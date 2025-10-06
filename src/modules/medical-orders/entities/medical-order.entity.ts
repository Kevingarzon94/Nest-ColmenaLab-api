import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Medication } from '../../medications/entities/medication.entity';

@Entity('medical_orders')
export class MedicalOrder {
  @PrimaryGeneratedColumn('uuid')
  orderId: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date' })
  expirationDate: Date;

  @Column({ type: 'varchar', length: 100 })
  specialty: string;

  @ManyToOne(() => Appointment, (appointment) => appointment.medicalOrders)
  @JoinColumn({ name: 'appointmentId' })
  appointment: Appointment;

  @Column()
  appointmentId: string;

  @ManyToMany(() => Medication, (medication) => medication.medicalOrders, {
    eager: true,
  })
  @JoinTable({
    name: 'medical_order_medications',
    joinColumn: { name: 'orderId', referencedColumnName: 'orderId' },
    inverseJoinColumn: { name: 'medicationId', referencedColumnName: 'medicationId' },
  })
  medications: Medication[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
