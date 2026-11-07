import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Categoria, CategoriaDto, Chamado, ChamadoDto, Ticket, TicketCriarDto, TicketPrioridade, Usuario, UsuarioDto,
} from './models';

export const API_URL = 'http://localhost:8081';

export function errMsg(e: any): string {
  if (e?.status === 0) return 'Não foi possível acessar a API na porta 8081. Verifique se ela está em execução e se permite CORS para esta origem.';
  if (typeof e?.error === 'string' && e.error) return e.error;
  return e?.error?.message ?? e?.error?.detail ?? `A requisição falhou (${e?.status}).`;
}

export abstract class CrudService<T, D> {
  protected http = inject(HttpClient);
  protected abstract path: string;
  private get url() { return `${API_URL}/${this.path}`; }
  list() { return this.http.get<T[]>(this.url); }
  get(id: number) { return this.http.get<T>(`${this.url}/${id}`); }
  create(dto: D) { return this.http.post<T>(this.url, dto); }
  update(id: number, dto: D) { return this.http.put<T>(`${this.url}/${id}`, dto); }
  remove(id: number) { return this.http.delete<T>(`${this.url}/${id}`); }
}

@Injectable({ providedIn: 'root' }) export class UsuarioService extends CrudService<Usuario, UsuarioDto> { protected path = 'usuarios'; }
@Injectable({ providedIn: 'root' }) export class CategoriaService extends CrudService<Categoria, CategoriaDto> { protected path = 'categorias'; }
@Injectable({ providedIn: 'root' }) export class ChamadoService extends CrudService<Chamado, ChamadoDto> { protected path = 'chamados'; }

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);
  private url = `${API_URL}/tickets`;
  list() { return this.http.get<Ticket[]>(this.url); }
  create(dto: TicketCriarDto) { return this.http.post<Ticket>(this.url, dto); }
  associar(id: number, usuarioId: number) { return this.http.post<Ticket>(`${this.url}/${id}/associar`, { usuarioId }); }
  definirPrioridade(id: number, prioridade: TicketPrioridade) { return this.http.post<Ticket>(`${this.url}/${id}/definir-prioridade`, { prioridade }); }
  resolver(id: number, descricaoSolucao: string) { return this.http.post<Ticket>(`${this.url}/${id}/resolver`, { descricaoSolucao }); }
  cancelar(id: number, motivoCancelamento: string) { return this.http.post<Ticket>(`${this.url}/${id}/cancelar`, { motivoCancelamento }); }
}
