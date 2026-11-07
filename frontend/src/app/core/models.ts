export type Papel = 'ATENDENTE' | 'SOLICITANTE';
export type Setor = 'TI' | 'RH' | 'FINANCEIRO' | 'ADMINSTRACAO' | 'MANUTENCAO'; // spelled as in the API
export type TicketStatus = 'ABERTO' | 'EM_ANALISE' | 'RESOLVIDO' | 'CANCELADO';
export type TicketPrioridade = 'BAIXA' | 'MEDIA' | 'ALTA';

export interface Usuario { id: number; nome: string; email: string; papel: Papel; ativo: boolean; criadoEm: string; }
export interface UsuarioDto { nome: string; email: string; papel?: Papel; }

export interface Categoria { id: number; nome: string; descricao: string; ativa: boolean; criadoEm: string; }
export interface CategoriaDto { nome: string; descricao?: string; }

export interface Chamado {
  id: number; titulo: string; descricao: string; prioridade: string; status: string; prazo: string;
  categoria: Categoria; solicitante: Usuario; ativo: boolean; criadoEm: string;
}
export interface ChamadoDto {
  titulo: string; descricao: string; prioridade: string; status: string; prazo: string;
  categoriaId: number; solicitanteId: number;
}

export interface Ticket {
  id: number; titulo: string; numeroProtocolo: string; descricao: string; descricaoSolucao?: string;
  status: TicketStatus; prioridade: TicketPrioridade; setor: Setor; motivoCancelamento?: string;
  dataCriacao: string; dataAtualizacao: string; atendente?: Usuario; solicitante?: Usuario;
}
export interface TicketCriarDto { titulo: string; descricao: string; setor?: Setor; solicitante_id?: number; }
