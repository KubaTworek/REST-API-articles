import {Injectable} from '@angular/core';
import {Article} from '../dto/article.type';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {AuthorDto} from "../dto/author.type";
import {LikesInfo} from "../dto/likes-info.type";
import {ArticleWithComments} from "../dto/article-with-comments.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  articlesChanged = new Subject<Article[]>();
  activityChanged = new Subject<ArticleWithComments>();
  private isForYouActiveSubject = new BehaviorSubject<boolean>(true);
  isForYouActive$: Observable<boolean> = this.isForYouActiveSubject.asObservable();
  private isFollowingActiveSubject = new BehaviorSubject<boolean>(false);
  isFollowingActive$: Observable<boolean> = this.isFollowingActiveSubject.asObservable();
  private articles: Article[] = [];
  private article: ArticleWithComments = new ArticleWithComments(
    new AuthorDto("", "", "", "", true),
    new Date(),
    "",
    "",
    "",
    "",
    new LikesInfo([]),
    0,
    []
  );

  updateActiveStatus(isForYouActive: boolean, isFollowingActive: boolean): void {
    this.isForYouActiveSubject.next(isForYouActive);
    this.isFollowingActiveSubject.next(isFollowingActive);
  }

  setArticlesAndNotify(articles: Article[]): void {
    this.articles = articles;
    this.notifyArticlesChanged();
  }

  setArticles(articles: Article[]): void {
    this.articles = articles;
  }

  getArticles(): Article[] {
    return [...this.articles];
  }

  setArticle(article: ArticleWithComments) {
    this.article = article;
    this.notifyChangesActivities();
  }

  getArticle(): ArticleWithComments {
    return this.article;
  }

  getArticlesByKeyword(keyword: string): Article[] {
    const lowerKeyword = keyword.toLowerCase();
    return this.articles.filter(article => article.text.toLowerCase().includes(lowerKeyword));
  }

  updateArticle(articleId: any, text: string): void {
    const article = this.findArticleById(articleId);

    if (!article) {
      console.error(`Article with ID ${articleId} not found`);
      return;
    }

    article.text = text;
  }

  deleteArticle(articleId: string): void {
    const index = this.findArticleIndex(articleId);
    if (index !== -1) {
      this.articles.splice(index, 1);
      this.notifyArticlesChanged();
    }
  }

  likeOrDislikeArticle(articleId: string, action: 'like' | 'dislike'): void {
    const article = this.findArticleById(articleId);

    if (!article) {
      console.error(`Article with ID ${articleId} not found`);
      return;
    }

    const fullName = this.getUserFullNameFromSession();

    switch (action) {
      case 'like':
        this.likeArticle(article, fullName);
        this.likeThisArticle(articleId, fullName);
        break;
      case 'dislike':
        this.dislikeArticle(article, fullName);
        this.dislikeThisArticle(articleId, fullName);
        break;
      default:
        console.error(`Unknown action: ${action}`);
        return;
    }

    this.notifyArticlesChanged();
  }

  followAuthor(id: string): void {
    if (this.article.author.id === id) {
      this.article.author.isFollowed = true;
    }
  }

  unfollowAuthor(id: string): void {
    if (this.article.author.id === id) {
      this.article.author.isFollowed = false;
    }
  }

  addArticle(article: Article, articleMotherId: string | null) {
    if (articleMotherId == null) {
      this.articles.unshift(article);
      this.notifyArticlesChanged();
    } else {
      const art = this.getArticle();
      art.comments.unshift(article)
      art.numOfComments++
    }
  }

  private notifyChangesActivities() {
    this.activityChanged.next(this.article);
  }

  private notifyArticlesChanged(): void {
    this.articlesChanged.next([...this.articles]);
  }

  private findArticleIndex(articleId: string): number {
    return this.articles.findIndex(article => article.id === articleId);
  }

  private findArticleById(articleId: string): Article | undefined {
    return this.articles.find(article => article.id === articleId);
  }

  private getUserFullNameFromSession(): string {
    const userData = sessionStorage.getItem('userData');
    if (userData === null) {
      console.error('User data is missing in sessionStorage');
      return '';
    }
    const {firstName, lastName} = JSON.parse(userData);
    return `${firstName} ${lastName}`;
  }

  private likeArticle(article: Article, fullName: string): void {
    article.numOfLikes += 1;
    article.likes.users.push(fullName);
  }

  private likeThisArticle(articleId: string, fullName: string): void {
    if (this.article.id == articleId) {
      this.article.numOfLikes += 1;
      this.article.likes.users.push(fullName);
    }
  }

  private dislikeArticle(article: Article, fullName: string): void {
    article.numOfLikes -= 1;
    const userIndex = article.likes.users.indexOf(fullName);
    if (userIndex !== -1) {
      article.likes.users.splice(userIndex, 1);
    }
  }

  private dislikeThisArticle(articleId: string, fullName: string): void {
    if (this.article.id == articleId) {
      this.article.numOfLikes -= 1;
      const userIndex = this.article.likes.users.indexOf(fullName);
      if (userIndex !== -1) {
        this.article.likes.users.splice(userIndex, 1);
      }
    }
  }
}
