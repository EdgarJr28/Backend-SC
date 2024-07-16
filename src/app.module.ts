import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesModule } from './articles/articles.module';
import { environment } from './enviroment';
import config from './config';
import { DatabaseModule } from './database/database.module';
import { ArticleService } from './articles/services/articles.service';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environment[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
    }),
    DatabaseModule,
    ArticlesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly articleService: ArticleService) { }

  async onModuleInit() {
    let filePath = process.env.DATA_JSON || 'src/database/data.json';
    await this.articleService.loadArticlesFromFile(filePath);
  }
}
