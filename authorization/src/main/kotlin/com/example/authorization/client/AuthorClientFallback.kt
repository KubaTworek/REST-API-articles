package com.example.authorization.clients

import com.example.authorization.controller.AuthorRequest
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.RequestBody

@Service
@Qualifier("AuthorClientFallback")
class AuthorClientFallback : AuthorClient {
    override fun createAuthor(@RequestBody theAuthor: AuthorRequest): ResponseEntity<Void> =
        ResponseEntity(HttpStatus.BAD_REQUEST)

    override fun deleteAuthorByUsername(username: String): ResponseEntity<Void> =
        ResponseEntity(HttpStatus.BAD_REQUEST)
}