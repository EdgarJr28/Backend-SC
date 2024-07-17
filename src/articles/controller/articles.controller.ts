import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ArticleService } from '../services/articles.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateArticleDto } from '../dto/articles.dto';



@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {

    constructor(private readonly articleService: ArticleService) { }

    @ApiOperation({ summary: 'Get all items from the application.' })
    @Auth()
    @ApiBearerAuth()
    @Get('/')
    async getAllArticles() {
        return this.articleService.findAll();
    }

    @ApiOperation({ summary: 'Save new Article.' })
    @Auth()
    @ApiBearerAuth()
    @ApiBody({ type: CreateArticleDto })
    @Post('/save')
    @UseGuards()
    async register(@Body() payload: CreateArticleDto) {
        return this.articleService.saveArticle(payload);
    }


    @ApiOperation({ summary: 'Update Article.' })
    @Auth()
    @ApiBearerAuth()
    @ApiBody({ type: CreateArticleDto })
    @Put(':id')
    @UseGuards()
    async updateArticle(@Param('id') articleId: string, @Body() updateData: any): Promise<void> {
        try {
            await this.articleService.updateArticleById(articleId, updateData);
        } catch (err: any) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @ApiOperation({ summary: 'Delete Article.' })
    @Auth()
    @ApiBearerAuth()
    @Delete(':id')
    @UseGuards()
    async deleteArticle(@Param('id') articleId: string): Promise<void> {
        try {
            await this.articleService.deleteArticleById(articleId);
        } catch (err: any) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
