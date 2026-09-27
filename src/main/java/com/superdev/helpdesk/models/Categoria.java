package com.superdev.helpdesk.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "categorias")
public class Categoria {
    @Id // PK da tabela
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Gerar o id automagicamente
    private Integer id;

    @Column(length = 60, nullable = false, unique = true)
    private String nome;

    @Column(length = 255)
    private String descricao;

    @Column(nullable = false)
    private boolean ativa;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    // Executado pelo JPA antes do INSERT; preenche os valores padrões
    @PrePersist
    void aoCriar(){
        if(criadoEm == null)
            criadoEm = LocalDateTime.now();
    }
}
