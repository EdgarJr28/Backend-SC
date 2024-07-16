import { Entity, Column, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class Article {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    author: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    url: string;

    @Column()
    urlToImage: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    publishedAt: Date;
}
