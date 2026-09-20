import { Categoria } from './categoria';
import { Comentario } from './comentario';
import { Portal } from './portal';
import { Subtopico } from './subtopico';

export interface ChamadoResponse {
  id: number;
  codigo: string;
  titulo: string;
  descricao: string;

  status: string;
  prioridade: string;
  escopo: string;

  userId: number;

  horarioAbertura: string;
  horarioAtualizacao: string;

  portal: Portal;
  categoria: Categoria | null;
  subtopico: Subtopico | null;

  comentarios: Comentario[];
}