package com.superdev.helpdesk.exceptions;

import org.springframework.http.HttpStatus;

public class ConflitoException extends ErroAplicacao {
    public ConflitoException(String mensagem){
        super(HttpStatus.CONFLICT, "conflito", mensagem);
    }

}
