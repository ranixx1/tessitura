export interface Portal {
  id: number;
  codigo: string;
  nome: string;
  descricao: string | null;
  criadoEm: string;
  sigla?: string; 
}