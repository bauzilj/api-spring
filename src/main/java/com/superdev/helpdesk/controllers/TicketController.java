package com.superdev.helpdesk.controllers;

import com.superdev.helpdesk.dtos.ticket.TicketCriarDto;
import com.superdev.helpdesk.models.Ticket;
import com.superdev.helpdesk.services.TicketService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
@Tag(name= "Tickets")
public class TicketController {
    private final TicketService service;

    public TicketController(TicketService service){
        this.service = service;
    }

    @GetMapping
    public List<Ticket> listar(){
        return  service.listar();
    }

    @PostMapping
    public Ticket criar(@RequestBody @Valid TicketCriarDto dado){
        return service.criar(dado);
    }
}

