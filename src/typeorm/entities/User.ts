import { IsEmail } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import * as bcrypt from "bcrypt";
import { Role } from "src/enum";

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column()
  createdAt: Date;

@Column({ type: 'varchar', length: 10, nullable: true })
otp: string;   
@Column({ type: 'bigint', nullable: true })
otpExpiry: number;

  @Column({
    type:'enum',
    enum:Role,
    default: Role.USER
  })
  role:Role

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
