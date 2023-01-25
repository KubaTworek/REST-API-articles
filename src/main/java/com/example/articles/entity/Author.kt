package com.example.articles.entity

import org.hibernate.Hibernate
import java.util.Collections.emptyList
import javax.persistence.*

@Entity
@Table(name = "Author")
data class Author(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    val id: Int,

    @Column(name = "first_name")
    val firstName: String,

    @Column(name = "last_name")
    val lastName: String,

    @OneToMany(mappedBy = "author", cascade = [CascadeType.ALL])
    val articles: MutableList<Article>
) {
    constructor() : this(
        0,
        "asd",
        "asd",
        emptyList<Article>()
    )

    fun add(tempArticle: Article) {
        articles.add(tempArticle)
        tempArticle.author = this
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as Author

        return id == other.id
    }

    override fun hashCode(): Int = hashCode()

    @Override
    override fun toString(): String {
        return this::class.simpleName + "(id = $id , firstName = $firstName , lastName = $lastName )"
    }
}