import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { MentionModule } from 'angular-mentions';
import { PortalConfigService } from '../../../portal/services/portal-config.service';
import { Subtopico } from '../../../portal/models/subtopico';
import { ChamadoService } from '../../../portal/services/chamado.service';

import { AlertComponent } from '../../../../shared/components/alert/alert';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { CardComponent } from '../../../../shared/components/card/card';
import { InputComponent } from '../../../../shared/components/input/input';
import { SelectComponent, SelectOption } from '../../../../shared/components/select/select';

import { Time } from '../../../admin/models/time';
import { TimeService } from '../../../admin/services/time.service';

type Prioridade = 'BAIXA' | 'NORMAL' | 'ALTA';
type Escopo = 'TODOS' | 'SOMENTE_EU';

@Component({
  selector: 'app-novo-chamado',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,

    AlertComponent,
    ButtonComponent,
    CardComponent,
    InputComponent,
    SelectComponent,
    MentionModule, 
  ],

  templateUrl: './novo-chamado.html',
  styleUrl: './novo-chamado.scss',
})
export class NovoChamadoComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  
  private readonly timeService = inject(TimeService);

  portalId!: number;
  categoriaId!: number;

  subtopicos: Subtopico[] = [];
  subtopicoOptions: SelectOption[] = [];
  
  timesDisponiveis: Time[] = []; 

  loading = true;
  submitting = false;

  errorMessage = '';
  successMessage = '';

  readonly prioridades: {
    value: Prioridade;
    label: string;
  }[] = [
    { value: 'BAIXA', label: 'Baixa' },
    { value: 'NORMAL', label: 'Normal' },
    { value: 'ALTA', label: 'Alta' },
  ];

  readonly escopos: {
    value: Escopo;
    label: string;
  }[] = [
    { value: 'TODOS', label: 'Todos' },
    { value: 'SOMENTE_EU', label: 'Somente eu' },
  ];

  form = this.fb.nonNullable.group({
    titulo: [
      '',
      [Validators.required, Validators.minLength(5)],
    ],
    descricao: [
      '',
      [Validators.required, Validators.minLength(10)],
    ],
    subtopicoId: [''],
    outroSubtopico: [''],
    prioridade: [
      '' as Prioridade | '',
      Validators.required,
    ],
    escopo: [
      '' as Escopo | '',
      Validators.required,
    ],
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly portalConfigService: PortalConfigService,
    private readonly chamadoService: ChamadoService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.carregarParametros();
    this.carregarTimes();
  }

  private carregarTimes(): void {
    this.timeService.listarTodos().subscribe({
      next: (times) => {
        this.timesDisponiveis = times ?? [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar times:', error);
      },
    });
  }

  private carregarParametros(): void {
    this.route.queryParamMap.subscribe((params) => {
      const portalId = Number(params.get('portalId'));
      const categoriaId = Number(params.get('categoriaId'));

      if (!portalId || !categoriaId) {
        this.errorMessage = 'Portal ou categoria não informados.';
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      this.portalId = portalId;
      this.categoriaId = categoriaId;

      this.carregarSubtopicos();
    });
  }

  private carregarSubtopicos(): void {
    this.loading = true;
    this.errorMessage = '';

    this.portalConfigService
      .listarSubtopicosPorCategoria(this.categoriaId)
      .subscribe({
        next: (subtopicos) => {
          this.subtopicos = subtopicos ?? [];
          this.subtopicoOptions = this.subtopicos.map((s) => ({
            value: String(s.id),
            label: s.nome,
          }));

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao carregar subtópicos:', error);
          this.subtopicos = [];
          this.loading = false;
          this.errorMessage = 'Não foi possível carregar os subtópicos.';
          this.cdr.detectChanges();
        },
      });
  }

  abrirChamado(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.form.getRawValue();
    const descricaoFinal = formValue.descricao.trim();

    const timesMencionadosNoTexto = this.timesDisponiveis.filter(time => 
      descricaoFinal.includes(`@${time.nome}`)
    );
    
    const idsDosTimes = timesMencionadosNoTexto.map(time => time.id);

    const request = {
      titulo: formValue.titulo.trim(),
      descricao: descricaoFinal,
      portalId: this.portalId,
      categoriaId: this.categoriaId,
      subtopicoId: formValue.subtopicoId ? Number(formValue.subtopicoId) : null,
      outroSubtopico: formValue.outroSubtopico.trim() || null,
      prioridade: formValue.prioridade as Prioridade,
      escopo: formValue.escopo as Escopo,
      timeIds: idsDosTimes,
    };

    this.chamadoService
      .criarChamado(request)
      .subscribe({
        next: (chamado) => {
          console.log('Chamado criado:', chamado);

          this.submitting = false;
          this.successMessage = `Chamado ${chamado.codigo} criado com sucesso.`;

          this.form.reset();
          this.cdr.detectChanges();

          setTimeout(() => {
            this.router.navigate(['/portal', this.portalId]);
          }, 1200);
        },
        error: (error) => {
          console.error('Erro ao criar chamado:', error);

          this.submitting = false;
          this.errorMessage = error?.error?.message ?? 'Não foi possível abrir o chamado.';

          this.cdr.detectChanges();
        },
      });
  }

  voltar(): void {
    if (this.portalId) {
      this.router.navigate(['/portal', this.portalId]);
      return;
    }
    this.router.navigate(['/portal']);
  }
}