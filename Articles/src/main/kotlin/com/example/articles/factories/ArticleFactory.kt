package com.example.articles.factories

import com.example.articles.clients.AuthorClient
import com.example.articles.clients.AuthorizationClient
import com.example.articles.controller.ArticleRequest
import com.example.articles.controller.ArticleResponse
import com.example.articles.model.dto.AuthorDTO
import com.example.articles.model.dto.UserDetailsDTO
import com.example.articles.model.entity.Article
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import java.sql.Timestamp
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter


@Component
class ArticleFactory(
    @Qualifier("AuthorClient") private val authorClient: AuthorClient,
    @Qualifier("AuthorizationClient") private val authorizationClient: AuthorizationClient,
    private val objectMapper: ObjectMapper
) {
    fun createArticle(request: ArticleRequest, jwt: String): Article {
        val userDetails = deserializeUserDetails(getUserDetailsFromToken(jwt))
        val author = deserializeAuthor(getAuthorByUsername(userDetails.username))

        return Article(
            0,
            getCurrentDate(),
            Timestamp(System.currentTimeMillis()),
            request.text,
            author.id
        )
    }

    fun createResponse(theArticle: Article): ArticleResponse {
        val author = deserializeAuthor(getAuthorById(theArticle.authorId))

        return ArticleResponse(
            theArticle.id,
            theArticle.text,
            theArticle.timestamp,
            author.firstName,
            author.lastName,
            author.username
        )
    }

    private fun getAuthorById(authorId: Int): ResponseEntity<String> =
        authorClient.getAuthorById(authorId)

    private fun getAuthorByUsername(username: String): ResponseEntity<String> =
        authorClient.getAuthorByUsername(username)

    private fun getUserDetailsFromToken(jwt: String): ResponseEntity<String> =
        authorizationClient.getUserDetails(jwt)

    private fun deserializeAuthor(response: ResponseEntity<String>): AuthorDTO =
        objectMapper.readValue(response.body, AuthorDTO::class.java)

    private fun deserializeUserDetails(response: ResponseEntity<String>): UserDetailsDTO =
        objectMapper.readValue(response.body, UserDetailsDTO::class.java)

    private fun getCurrentDate(): String {
        val dateFormatter: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyy/MM/dd")
        return dateFormatter.format(LocalDateTime.now())
    }
}