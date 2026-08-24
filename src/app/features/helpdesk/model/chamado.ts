export interface Comentario {
  id: number;
  mensagem: string;
  username: string;
  dataHoraCriacao: string;
}

export interface Chamado {
  id: number;
  codigo: string;
  titulo: string;
  descricao: string;

  status: 'ABERTO'
    | 'EM_PROGRESSO'
    | 'AGUARDANDO_USUARIO'
    | 'FECHADO';

  prioridade:
    | 'BAIXA'
    | 'NORMAL'
    | 'ALTA';

  escopo:
    | 'TODOS'
    | 'SOMENTE_EU';

  userId: number;

  horarioAbertura: string;
  horarioAtualizacao: string;

  portal: {
    id: number;
    nome: string;
    sigla: string;
  };

  categoria: {
    id: number;
    nome: string;
  } | null;

  subtopico: {
    id: number;
    nome: string;
  } | null;

  comentarios: Comentario[];
}