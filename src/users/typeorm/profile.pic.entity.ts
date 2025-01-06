import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './profile';

@Entity()
export class ProfilePic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { array: true, nullable: true })
  image: string[];

  @Column()
  createdAt: Date;

  @ManyToOne(() => Profile, (profile) => profile.image, {
    cascade: ['insert', 'update'],
    onDelete: 'SET NULL',
  })
  profile: Profile;
}
