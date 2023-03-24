package com.example.articles.clients

import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader
import java.util.*

@FeignClient(
    name = "authorization",
    url = "http://authorization:4000/api",
    fallback = AuthorizationClientFallback::class
)
@Qualifier("AuthorizationClient")
interface AuthorizationClient {
    @GetMapping("/user-info")
    fun getUserDetails(@RequestHeader("Authorization") jwt: String): ResponseEntity<String>
}
