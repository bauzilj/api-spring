import { Pipe, PipeTransform } from '@angular/core';

const LABELS: Record<string, string> = {
  ABERTO: 'Aberto', EM_ANALISE: 'Em análise', RESOLVIDO: 'Resolvido', CANCELADO: 'Cancelado',
  EM_ANDAMENTO: 'Em andamento', FECHADO: 'Fechado',
  BAIXA: 'Baixa', MEDIA: 'Média', ALTA: 'Alta', URGENTE: 'Urgente',
  TI: 'TI', RH: 'RH', FINANCEIRO: 'Financeiro', ADMINSTRACAO: 'Administração', MANUTENCAO: 'Manutenção',
  ATENDENTE: 'Atendente', SOLICITANTE: 'Solicitante',
};

/** Shows a Portuguese label for an API enum value (the value sent to the API is unchanged). */
@Pipe({ name: 'label', standalone: true })
export class LabelPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return value ? (LABELS[value] ?? value) : '';
  }
}
