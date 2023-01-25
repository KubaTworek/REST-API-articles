package com.example.articles.controller

data class ArticleRequest(
    val title: String,
    val text: String,
    val magazine: String,
    val author_firstName: String,
    val author_lastName: String
)