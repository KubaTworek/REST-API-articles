package pl.jakubtworek.articles.external

import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import pl.jakubtworek.articles.exception.AuthorApiException
import pl.jakubtworek.common.client.AuthorClient
import pl.jakubtworek.common.model.AuthorDTO

@Service
class AuthorApiServiceImpl(
    private val authorClient: AuthorClient,
    private val objectMapper: ObjectMapper
) : AuthorApiService {

    private val logger: Logger = LoggerFactory.getLogger(AuthorApiServiceImpl::class.java)

    override fun getAuthorById(authorId: Int): AuthorDTO {
        logger.info("Getting author by ID: $authorId")
        val response = authorClient.getAuthorById(authorId)
        return deserializeAuthor(response)
    }

    private fun deserializeAuthor(response: ResponseEntity<String>): AuthorDTO {
        val responseBody: String? = response.body
        if (response.statusCode != HttpStatus.OK) {
            logger.error("Author API request failed with status code: ${response.statusCode}")
            throw AuthorApiException("Author API request failed with status code: ${response.statusCode}")
        }

        if (responseBody != null) {
            try {
                val authorDTO = objectMapper.readValue(responseBody, AuthorDTO::class.java)
                logger.debug("Deserialized author: $authorDTO")
                return authorDTO
            } catch (e: Exception) {
                logger.error("Error deserializing AuthorDTO", e)
                throw AuthorApiException("Error deserializing AuthorDTO", e)
            }
        } else {
            logger.error("Author API response body is null")
            throw AuthorApiException("Author API response body is null")
        }
    }
}