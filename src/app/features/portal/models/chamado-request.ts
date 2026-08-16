export interface ChamadoRequest {
  titulo: string;
  descricao: string;
  portalId: number;
  categoriaId: number;
  subtopicoId?: number;
  outroSubtopico?: string;
  prioridade: string;
  escopo: string;
}