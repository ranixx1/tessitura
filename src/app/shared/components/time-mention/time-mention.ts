import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Time } from '../../../features/admin/models/time';
import { TimeService } from '../../../features/admin/services/time.service';

@Component({
  selector: 'app-time-mention',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './time-mention.html',
  styleUrl: './time-mention.scss',
})
export class TimeMentionComponent implements OnInit {

  private readonly timeService = inject(TimeService);

  @Output()
  timesChange = new EventEmitter<Time[]>();

  times: Time[] = [];
  timesFiltrados: Time[] = [];
  timesSelecionados: Time[] = [];

  mencaoTexto = '';

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.carregarTimes();
  }

  private carregarTimes(): void {
    this.loading = true;
    this.errorMessage = '';

    this.timeService.listarTodos().subscribe({
      next: (times) => {
        this.times = times ?? [];
        this.timesFiltrados = this.times;
        this.loading = false;
      },

      error: (error) => {
        console.error('Erro ao carregar times:', error);

        this.times = [];
        this.timesFiltrados = [];
        this.loading = false;

        this.errorMessage =
          'Não foi possível carregar os times.';
      },
    });
  }

  filtrarTimes(): void {
    const termo = this.mencaoTexto
      .replace('@', '')
      .trim()
      .toLowerCase();

    if (!termo) {
      this.timesFiltrados = this.times.filter(
        (time) => !this.timeJaSelecionado(time)
      );

      return;
    }

    this.timesFiltrados = this.times.filter(
      (time) =>
        !this.timeJaSelecionado(time) &&
        time.nome.toLowerCase().includes(termo)
    );
  }

  selecionarTime(time: Time): void {
    if (this.timeJaSelecionado(time)) {
      return;
    }

    this.timesSelecionados = [
      ...this.timesSelecionados,
      time,
    ];

    this.mencaoTexto = '';
    this.timesFiltrados = [];

    this.emitirTimes();
  }

  removerTime(time: Time): void {
    this.timesSelecionados =
      this.timesSelecionados.filter(
        (selecionado) =>
          selecionado.id !== time.id
      );

    this.filtrarTimes();
    this.emitirTimes();
  }

  private timeJaSelecionado(time: Time): boolean {
    return this.timesSelecionados.some(
      (selecionado) =>
        selecionado.id === time.id
    );
  }

  private emitirTimes(): void {
    this.timesChange.emit(this.timesSelecionados);
  }
}