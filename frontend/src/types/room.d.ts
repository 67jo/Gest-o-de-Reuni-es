interface Room {
  id: number;
  nome: string;
  capacidade: number;
  localizacao?: string;
  status: string;
  resources?: string[];
}