package com.example.notifications.client

import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@FeignClient(
    name = "articles",
    url = "http://articles:2111/api",
    fallback = ArticleClientFallback::class
)
@Qualifier("ArticleClient")
interface ArticleClient {
    @GetMapping("/id/{articleId}")
    fun getArticleById(@PathVariable articleId: Int): ResponseEntity<String>
}