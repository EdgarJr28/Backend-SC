import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entitys/article.entity';
import * as fs from 'fs';
import { ArticleEntRepository } from '../repository/article.repository';
import { CreateArticleDto } from '../dto/articles.dto';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(Article, 'DB') private articleRepository: ArticleEntRepository
    ) { }

    async loadArticlesFromFile(filePath: string): Promise<void> {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const articles = JSON.parse(data);
            for (const article of articles) {
                const exists = await this.articleRepository.findOne({ where: { title: article.title } });
                if (!exists) {
                    const newArticle = this.articleRepository.create(article);
                    await this.articleRepository.save(newArticle);
                }
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }

    async findAll(): Promise<Article[]> {
        return this.articleRepository.find();
    }

    async saveArticle(article: CreateArticleDto): Promise<{}> {
        try {
            let filePath = process.env.DATA_JSON || 'src/database/data.json';
            let existingArticles: CreateArticleDto[] = [];

            try {
                const data = await fs.promises.readFile(filePath, 'utf8');
                existingArticles = JSON.parse(data);
            } catch (err) {
                // El archivo probablemente no existe todavía, lo manejamos como un archivo vacío
                console.log('El archivo no existe, creando uno nuevo.');
            }
            // Crea un nuevo objeto de artículo con la fecha actual antes de guardarlo 
            const newArticle = { ...article, publishedAt: new Date().toISOString() };
            // Agrega el nuevo artículo al array de artículos existentes
            existingArticles.push(newArticle);

            await fs.promises.writeFile(filePath, JSON.stringify(existingArticles, null, 2), 'utf8');
            await this.saveArticleToMongoDB(article);
            return { message: 'Artículo guardado correctamente' };
        } catch (err) {
            console.error('Error al escribir en el archivo:', err);
            throw err; // O maneja el error según tus necesidades
        }
    }

    async saveArticleToMongoDB(articleData: any): Promise<void> {
        try {
            const newArticle = this.articleRepository.create(articleData);
            await this.articleRepository.save(newArticle);
        } catch (err) {
            console.error('Error al guardar artículo en MongoDB:', err);
            throw err; // O maneja el error según tus necesidades
        }
    }
}
