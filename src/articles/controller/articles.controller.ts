import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
}
