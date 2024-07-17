import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entitys/article.entity';
import * as fs from 'fs';
import { ArticleEntRepository } from '../repository/article.repository';
import { CreateArticleDto } from '../dto/articles.dto';
import { promisify } from 'util';
import { ObjectId } from 'mongodb';

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
        } catch (err: any) {
            console.error('Error al escribir en el archivo:', err);
            throw new HttpException(err.message, 500);

        }
    }

    async saveArticleToMongoDB(articleData: any): Promise<void> {
        try {
            const newArticle = this.articleRepository.create(articleData);
            await this.articleRepository.save(newArticle);
        } catch (err: any) {
            console.error('Error al guardar artículo en MongoDB:', err);
            throw new HttpException(err.message, 500);

        }
    }

    async updateArticleById(articleId: string, updateData: any): Promise<any> {
        try {
            const articleObjectId = new ObjectId(articleId);
            const existingArticle = await this.articleRepository.findOne({ where: { _id: articleObjectId } });

            if (!existingArticle) {
                throw new HttpException('Article not found', 404);
            }

            await this.articleRepository.update(articleObjectId, updateData);

            const filePath = process.env.DATA_JSON || 'src/database/data.json';
            let existingArticles: CreateArticleDto[] = [];

            try {
                const data = await fs.promises.readFile(filePath, 'utf8');
                existingArticles = JSON.parse(data);
            } catch (err) {
                console.log('El archivo no existe, creando uno nuevo.');
            }

            let articleUpdated = false;
            const updatedArticles = existingArticles.map(article => {
                if (article._id === articleId) {
                    articleUpdated = true;
                    return { ...article, ...updateData };
                }
                return article;
            });

            if (!articleUpdated) {
                const newArticle = { ...updateData, _id: articleId, publishedAt: new Date().toISOString() };
                updatedArticles.push(newArticle);
            }

            await fs.promises.writeFile(filePath, JSON.stringify(updatedArticles, null, 2), 'utf8');

            return { message: 'Artículo actualizado correctamente' };
        } catch (err: any) {
            console.error('Error al actualizar el artículo en MongoDB o en el archivo:', err);
            throw new HttpException(err.message, 500);
        }
    }

    async deleteArticleById(articleId: string): Promise<void> {
        try {
            const articleObjectId = new ObjectId(articleId);
            const existingArticle = await this.articleRepository.findOne({ where: { _id: articleObjectId } });

            if (!existingArticle) {
                throw new HttpException('Article not found', 404);
            }

            await this.articleRepository.delete(articleObjectId);

            const filePath = process.env.DATA_JSON || 'src/database/data.json';
            let existingArticles: CreateArticleDto[] = [];

            try {
                const data = await fs.promises.readFile(filePath, 'utf8');
                existingArticles = JSON.parse(data);
            } catch (err) {
                console.log('El archivo no existe, creando uno nuevo.');
            }

            const updatedArticles = existingArticles.filter(article => article._id !== articleId);

            await fs.promises.writeFile(filePath, JSON.stringify(updatedArticles, null, 2), 'utf8');
        } catch (err: any) {
            console.error('Error al eliminar el artículo en MongoDB o en el archivo:', err);
            throw new HttpException(err.message, 500);
        }
    }
}
