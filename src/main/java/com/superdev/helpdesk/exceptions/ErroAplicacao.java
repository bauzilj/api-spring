package com.superdev.helpdesk.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 *  Base das execoes de dominio. Os servicos lancam estas excepcoes sem saber
 *  nada de HTTP; o TratadorDeErros traduz cada uma para status + corpo padrao
 * */
@Getter
public class ErroAplicacao  extends  RuntimeException{
    // Atttributos protegidos com final para n permitir a mudanca
    // Com Getter (que permitira somente a leitura), sem Setter + final
    private final HttpStatus status;
    private final String codigo;

    //Construtor
    protected  ErroAplicacao(HttpStatus status, String codigo, String mensagem){
        // Passando para o construtor da classe pai(RuntimeExeption) a mensagem
        super(mensagem);
        this.status = status;
        this.codigo = codigo;
    }
}
