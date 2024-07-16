import { Repository } from "typeorm";
import { CustomRepository } from "../../typeorm/typeorm-ex.decorator";
import { Article } from "../entitys/article.entity";

@CustomRepository(Article)
export class ArticleEntRepository extends Repository<Article> {}