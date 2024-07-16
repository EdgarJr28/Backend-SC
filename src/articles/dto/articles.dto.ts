import { IsString, IsNotEmpty, IsUrl, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
    @IsString()
    @IsNotEmpty()
    readonly _id: string;

    @ApiProperty({ description: 'The author of the article' })
    @IsString()
    @IsNotEmpty()
    readonly author: string;

    @ApiProperty({ description: 'The title of the article' })
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @ApiProperty({ description: 'The description of the article', required: false })
    @IsString()
    readonly description: string;

    @ApiProperty({ description: 'The URL of the article' })
    @IsUrl()
    @IsNotEmpty()
    readonly url: string;

    @ApiProperty({ description: 'The URL of the image for the article', required: false })
    @IsUrl()
    readonly urlToImage: string;

    @IsDateString()
    @IsNotEmpty()
    readonly publishedAt: string;
}
