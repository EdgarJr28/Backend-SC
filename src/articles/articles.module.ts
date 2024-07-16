import { Module } from '@nestjs/common';
import { ArticlesController } from './controller/articles.controller';
import { ArticleService } from './services/articles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entitys/article.entity';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [
    TypeOrmModule.forFeature([Article], 'DB')
  ],
  controllers: [ArticlesController],
  providers: [JwtService, ArticleService],
  exports: [ArticleService],
})
export class ArticlesModule { }
