package com.example.authorization.entity

import jakarta.persistence.*
import org.jetbrains.annotations.NotNull

@Entity
@Table(name = "authorities")
data class Authorities(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    val id: Int,

    @get: NotNull
    val authority: String,

    @OneToMany(mappedBy = "authorities", cascade = [CascadeType.ALL], orphanRemoval = true)
    val users: MutableList<User>
) {
    constructor() : this(
        0,
        "authority",
        mutableListOf()
    )
}