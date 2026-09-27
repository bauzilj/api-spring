package com.superdev.helpdesk.models;

import com.superdev.helpdesk.enums.Papel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id // PK da tabela
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Gerar o id automagicamente
    private Integer id;

    @Column(length = 100, nullable = false)
    private String nome;

    @Column(length = 150, nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private Papel papel;

    @Column(nullable = false)
    private boolean ativo;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    // Executado pelo JPA antes do INSERT; preenche os valores padrões
    @PrePersist
    void aoCriar(){
        if(criadoEm == null)
            criadoEm = LocalDateTime.now();
    }
}
