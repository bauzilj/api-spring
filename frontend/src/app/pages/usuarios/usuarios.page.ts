import { LabelPipe } from '../../core/label.pipe';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UsuarioService, errMsg } from '../../core/api.service';
import { Usuario, UsuarioDto } from '../../core/models';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [LabelPipe, ReactiveFormsModule, DatePipe],
  templateUrl: './usuarios.page.html',
  styleUrl: './usuarios.page.css',
})
export class UsuariosPage implements OnInit {
  private api = inject(UsuarioService);
  private fb = inject(FormBuilder);
  items = signal<Usuario[]>([]);
  editing = signal<Usuario | null>(null);
  error = signal('');
  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    papel: ['SOLICITANTE'],
  });

  ngOnInit() { this.load(); }
  load() { this.api.list().subscribe({ next: v => this.items.set(v), error: e => this.error.set(errMsg(e)) }); }
  edit(u: Usuario) { this.editing.set(u); this.form.patchValue(u); }
  reset() { this.editing.set(null); this.form.reset({ nome: '', email: '', papel: 'SOLICITANTE' }); }
  save() {
    const dto = this.form.getRawValue() as UsuarioDto;
    const e = this.editing();
    (e ? this.api.update(e.id, dto) : this.api.create(dto)).subscribe({
      next: () => { this.error.set(''); this.reset(); this.load(); },
      error: err => this.error.set(errMsg(err)),
    });
  }
  remove(u: Usuario) {
    if (!confirm(`Excluir ${u.nome}?`)) return;
    this.api.remove(u.id).subscribe({ next: () => this.load(), error: e => this.error.set(errMsg(e)) });
  }
}
