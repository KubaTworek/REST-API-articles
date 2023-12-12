package pl.jakubtworek.notifications.client

import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service

@Service
@Qualifier("AuthorClientFallback")
class AuthorClientFallback : pl.jakubtworek.notifications.client.AuthorClient {
    override fun getAuthorById(authorId: Int): ResponseEntity<String> =
        ResponseEntity(HttpStatus.NOT_FOUND)
}