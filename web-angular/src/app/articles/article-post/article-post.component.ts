import {Component} from "@angular/core";
import {ArticleService} from "../service/article.service";
import {ArticleRequest} from "../dto/article-request.type";

@Component({
  selector: 'article-post',
  templateUrl: './article-post.component.html',
  styleUrls: ['./article-post.component.scss']
})
export class ArticlePostComponent {
  articleContent = '';

  constructor(private articleService: ArticleService) {
  }

  createArticle(): void {
    const request: ArticleRequest = {
      title: '',
      text: this.articleContent
    };
    this.articleService.postArticle(request)
      .subscribe(() => location.reload());
  }
}
