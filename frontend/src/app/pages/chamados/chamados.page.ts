import { DatePipe } from '@angular/common';
import { LabelPipe } from '../../core/label.pipe';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaService, ChamadoService, UsuarioService, errMsg } from '../../core/api.service';
import { Categoria, Chamado, ChamadoDto, Usuario } from '../../core/models';

@Component({
  selector: 'app-chamados',
  standalone: true,
  imports: [LabelPipe, ReactiveFormsModule, DatePipe],
  templateUrl: './chamados.page.html',
  styleUrl: './chamados.page.css',
})
export class ChamadosPage implements OnInit {
  private api = inject(ChamadoService);
  private fb = inject(FormBuilder);
  private cats = inject(CategoriaService);
  private users = inject(UsuarioService);
  prioridades = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'];
  statuses = ['ABERTO', 'EM_ANDAMENTO', 'RESOLVIDO', 'FECHADO'];
  items = signal<Chamado[]>([]);
  categorias = signal<Categoria[]>([]);
  usuarios = signal<Usuario[]>([]);
  editing = signal<Chamado | null>(null);
  error = signal('');
  private blank = { titulo: '', descricao: '', prioridade: 'MEDIA', status: 'ABERTO', prazo: '', categoriaId: null, solicitanteId: null };
  form = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    descricao: ['', [Validators.required, Validators.maxLength(2000)]],
    prioridade: ['MEDIA', Validators.required],
    status: ['ABERTO', Validators.required],
    prazo: ['', Validators.required],
    categoriaId: [null as number | null, Validators.required],
    solicitanteId: [null as number | null, Validators.required],
  });

  ngOnInit() {
    this.load();
    this.cats.list().subscribe(v => this.categorias.set(v));
    this.users.list().subscribe(v => this.usuarios.set(v));
  }
  load() { this.api.list().subscribe({ next: v => this.items.set(v), error: e => this.error.set(errMsg(e)) }); }
  edit(c: Chamado) {
    this.editing.set(c);
    this.form.patchValue({ ...c, categoriaId: c.categoria?.id, solicitanteId: c.solicitante?.id });
  }
  reset() { this.editing.set(null); this.form.reset(this.blank); }
  save() {
    const dto = this.form.getRawValue() as ChamadoDto;
    const e = this.editing();
    (e ? this.api.update(e.id, dto) : this.api.create(dto)).subscribe({
      next: () => { this.error.set(''); this.reset(); this.load(); },
      error: err => this.error.set(errMsg(err)),
    });
  }
  remove(c: Chamado) {
    if (!confirm(`Excluir "${c.titulo}"?`)) return;
    this.api.remove(c.id).subscribe({ next: () => this.load(), error: e => this.error.set(errMsg(e)) });
  }
}
