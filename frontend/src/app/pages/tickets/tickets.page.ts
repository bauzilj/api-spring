import { LabelPipe } from '../../core/label.pipe';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TicketService, UsuarioService, errMsg } from '../../core/api.service';
import { Setor, Ticket, TicketCriarDto, TicketPrioridade, Usuario } from '../../core/models';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [LabelPipe, ReactiveFormsModule, DatePipe],
  templateUrl: './tickets.page.html',
  styleUrl: './tickets.page.css',
})
export class TicketsPage implements OnInit {
  private api = inject(TicketService);
  private usersApi = inject(UsuarioService);
  private fb = inject(FormBuilder);

  statuses = ['ABERTO', 'EM_ANALISE', 'RESOLVIDO', 'CANCELADO'];
  prioridades: TicketPrioridade[] = ['BAIXA', 'MEDIA', 'ALTA'];
  setores: Setor[] = ['TI', 'RH', 'FINANCEIRO', 'ADMINSTRACAO', 'MANUTENCAO'];

  tickets = signal<Ticket[]>([]);
  usuarios = signal<Usuario[]>([]);
  atendentes = computed(() => this.usuarios().filter(u => u.papel === 'ATENDENTE'));
  solicitantes = computed(() => this.usuarios().filter(u => u.papel === 'SOLICITANTE'));
  selected = signal<Ticket | null>(null);
  filter = signal('TODOS');
  creating = signal(false);
  error = signal('');
  visible = computed(() => this.tickets().filter(t => this.filter() === 'TODOS' || t.status === this.filter()));

  createForm = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
    descricao: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
    setor: ['TI' as Setor],
    solicitante_id: [null as number | null],
  });
  assignCtrl = new FormControl<number | null>(null);
  prioCtrl = new FormControl<TicketPrioridade>('MEDIA', { nonNullable: true });
  solucaoCtrl = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10), Validators.maxLength(5000)] });
  motivoCtrl = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10), Validators.maxLength(5000)] });

  ngOnInit() {
    this.load();
    this.usersApi.list().subscribe(v => this.usuarios.set(v));
  }
  load() { this.api.list().subscribe({ next: v => this.tickets.set(v), error: e => this.error.set(errMsg(e)) }); }
  isOpen(t: Ticket) { return t.status === 'ABERTO' || t.status === 'EM_ANALISE'; }

  select(t: Ticket) {
    this.selected.set(t);
    this.assignCtrl.reset(t.atendente?.id ?? null);
    this.prioCtrl.setValue(t.prioridade ?? 'MEDIA');
    this.solucaoCtrl.reset('');
    this.motivoCtrl.reset('');
  }
  private done = (t: Ticket) => {
    this.error.set('');
    this.tickets.update(l => l.map(x => (x.id === t.id ? t : x)));
    this.select(t);
  };
  private fail = (e: unknown) => this.error.set(errMsg(e));

  create() {
    const v = this.createForm.getRawValue();
    const dto: TicketCriarDto = { titulo: v.titulo!, descricao: v.descricao!, setor: v.setor ?? undefined, solicitante_id: v.solicitante_id ?? undefined };
    this.api.create(dto).subscribe({
      next: t => { this.error.set(''); this.tickets.update(l => [t, ...l]); this.createForm.reset({ setor: 'TI', solicitante_id: null }); this.creating.set(false); },
      error: this.fail,
    });
  }
  associar(t: Ticket) { this.api.associar(t.id, this.assignCtrl.value!).subscribe({ next: this.done, error: this.fail }); }
  prioridade(t: Ticket) { this.api.definirPrioridade(t.id, this.prioCtrl.value).subscribe({ next: this.done, error: this.fail }); }
  resolver(t: Ticket) { this.api.resolver(t.id, this.solucaoCtrl.value).subscribe({ next: this.done, error: this.fail }); }
  cancelar(t: Ticket) { this.api.cancelar(t.id, this.motivoCtrl.value).subscribe({ next: this.done, error: this.fail }); }
}
