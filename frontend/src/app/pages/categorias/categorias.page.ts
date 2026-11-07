import { LabelPipe } from '../../core/label.pipe';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaService, errMsg } from '../../core/api.service';
import { Categoria, CategoriaDto } from '../../core/models';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [LabelPipe, ReactiveFormsModule],
  templateUrl: './categorias.page.html',
  styleUrl: './categorias.page.css',
})
export class CategoriasPage implements OnInit {
  private api = inject(CategoriaService);
  private fb = inject(FormBuilder);
  items = signal<Categoria[]>([]);
  editing = signal<Categoria | null>(null);
  error = signal('');
  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    descricao: ['', Validators.maxLength(255)],
  });

  ngOnInit() { this.load(); }
  load() { this.api.list().subscribe({ next: v => this.items.set(v), error: e => this.error.set(errMsg(e)) }); }
  edit(c: Categoria) { this.editing.set(c); this.form.patchValue(c); }
  reset() { this.editing.set(null); this.form.reset({ nome: '', descricao: '' }); }
  save() {
    const dto = this.form.getRawValue() as CategoriaDto;
    const e = this.editing();
    (e ? this.api.update(e.id, dto) : this.api.create(dto)).subscribe({
      next: () => { this.error.set(''); this.reset(); this.load(); },
      error: err => this.error.set(errMsg(err)),
    });
  }
  remove(c: Categoria) {
    if (!confirm(`Excluir ${c.nome}?`)) return;
    this.api.remove(c.id).subscribe({ next: () => this.load(), error: e => this.error.set(errMsg(e)) });
  }
}
