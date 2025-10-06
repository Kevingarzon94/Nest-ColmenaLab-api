import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  doctorId: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  id: string;

  @Column({ type: 'varchar', length: 90 })
  firstName: string;

  @Column({ type: 'varchar', length: 90 })
  lastName: string;

  @Column({ type: 'varchar', length: 200, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 200 })
  address: string;

  @Column({ type: 'varchar', length: 90 })
  city: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  professionalCard: string;

  @Column({ type: 'date' })
  admissionDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
