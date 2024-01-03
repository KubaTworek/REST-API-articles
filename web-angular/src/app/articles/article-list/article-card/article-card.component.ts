import {Component, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import {Article} from "../../dto/article.type";
import {DataStorageService} from "../../../shared/data-storage.service";
import {ArticleDetailsComponent} from "./article-details/article-details.component";
import {AuthorizationService} from "../../../auth/service/authorization.service";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArticleCardComponent {
  @Input() article!: Article;
  @ViewChild(ArticleDetailsComponent) articleDetailsComponent!: ArticleDetailsComponent;

  constructor(
    private dataStorage: DataStorageService,
    private authorizationService: AuthorizationService
  ) {
  }

  openDetails(event: Event): void {
    const clickedElement = event.target as HTMLElement;
    const isInteractiveElement =
      clickedElement.classList.contains('article-card__like-button') ||
      clickedElement.classList.contains('article-card__follow-button') ||
      clickedElement.classList.contains('article-card__author-name');

    if (!isInteractiveElement) {
      this.articleDetailsComponent.open();
    }
  }

  likeArticle(articleId: string): void {
    if (this.isUser()) {
      this.dataStorage.likeArticle(articleId);
    }
  }

  showLikes(articleId: string): void {
    if (this.article.likes.users.length > 0) {
      const userNames = this.article.likes.users.map(user => `<div>${user}</div>`).join('');
      const tooltipContent = `<div class="article-card__like-tooltip-content">${userNames}</div>`;
      const tooltip = document.createElement('div');
      tooltip.classList.add('article-card__like-tooltip');
      tooltip.innerHTML = tooltipContent;
      const likeButton = document.querySelector(`#article-card__like-container-${articleId}`);
      likeButton?.appendChild(tooltip);
    }
  }

  hideLikes(articleId: string): void {
    const likeButton = document.querySelector(`#article-card__like-container-${articleId}`);
    const tooltip = likeButton?.querySelector('.article-card__like-tooltip');
    if (tooltip) {
      likeButton?.removeChild(tooltip);
    }
  }

  followOrUnfollowAuthor(id: string): void {
    if (this.article.author.isFollowed) {
      this.dataStorage.unfollowAuthor(id);
    } else {
      this.dataStorage.followAuthor(id);
    }
  }

  private isUser(): boolean {
    const role = this.authorizationService.getRole();
    return role == 'ROLE_USER';
  }
}
