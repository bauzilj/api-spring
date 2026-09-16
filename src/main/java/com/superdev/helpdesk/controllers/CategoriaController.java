package com.superdev.helpdesk.controllers;

import com.superdev.helpdesk.dtos.categoria.CategoriaCriarDto;
import com.superdev.helpdesk.models.Categoria;
import com.superdev.helpdesk.services.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping

public class CategoriaController {
    private final CategoriaService service;

    public CategoriaController(CategoriaService service){
        this.service = service;
    }

    @GetMapping
    public List<Categoria> listar(){
        return this.service.listar();
    }
    @PostMapping
    public Categoria criar(@RequestBody @Valid CategoriaCriarDto dto){
        return  this.service.criar(dto);
    }

}
