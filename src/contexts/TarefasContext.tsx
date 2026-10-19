import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  alterarTarefa,
  criarTarefa,
  excluirTarefa,
  listarTarefas,
} from "../services/tarefaService";
import type { Tarefa } from "../types/Tarefa";

type NovaTarefa = Omit<Tarefa, "_id">;

type TarefasContextType = {
  tarefas: Tarefa[];
  carregando: boolean;
  erro: string;
  adicionarTarefa: (novaTarefa: NovaTarefa) => Promise<void>;
  atualizarTarefa: (id: string, dados: NovaTarefa) => Promise<void>;
  alternarConclusao: (tarefa: Tarefa) => Promise<void>;
  removerTarefa: (id: string) => Promise<void>;
};

const TarefasContext = createContext<TarefasContextType | undefined>(undefined);

type TarefasProviderProps = {
  children: ReactNode;
};

export function TarefasProvider({ children }: Readonly<TarefasProviderProps>) {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarTarefas() {
      try {
        setCarregando(true);
        setErro("");
        const dados = await listarTarefas();
        setTarefas(dados);
      } catch {
        setErro("Não foi possível carregar as tarefas.");
      } finally {
        setCarregando(false);
      }
    }
    carregarTarefas();
  }, []);

  async function adicionarTarefa(novaTarefa: NovaTarefa) {
    try {
      setErro("");
      const tarefaCriada = await criarTarefa(novaTarefa);
      setTarefas((tarefasAtuais) => [tarefaCriada, ...tarefasAtuais]);
    } catch {
      setErro("Não foi possível criar a tarefa.");
      throw new Error("Não foi possível criar a tarefa.");
    }
  }

  async function removerTarefa(id: string) {
    try {
      setErro("");
      await excluirTarefa(id);
      setTarefas((tarefasAtuais) =>
        tarefasAtuais.filter((tarefa) => tarefa._id !== id),
      );
    } catch {
      setErro("Não foi possível excluir a tarefa.");
    }
  }

  async function atualizarTarefa(id: string, dados: NovaTarefa) {
    try {
      setErro("");

      const tarefaAtualizada = await alterarTarefa(id, dados);

      setTarefas((tarefasAtuais) =>
        tarefasAtuais.map((tarefaAtual) =>
          tarefaAtual._id === tarefaAtualizada._id
            ? tarefaAtualizada
            : tarefaAtual,
        ),
      );
    } catch {
      setErro("Não foi possível atualizar a tarefa.");
      // relança para o TaskModal não fechar se a edição falhar
      throw new Error("Não foi possível atualizar a tarefa.");
    }
  }

  async function alternarConclusao(tarefa: Tarefa) {
    const { _id, ...dados } = tarefa;

    if (!_id) return;

    try {
      await atualizarTarefa(_id, {
        ...dados,
        concluida: !tarefa.concluida,
      });
    } catch {
      // o erro já foi registrado em atualizarTarefa
    }
  }

  return (
    <TarefasContext.Provider
      value={{
        tarefas,
        carregando,
        erro,
        adicionarTarefa,
        atualizarTarefa,
        removerTarefa,
        alternarConclusao,
      }}
    >
      {children}
    </TarefasContext.Provider>
  );
}

export function useTarefas() {
  const contexto = useContext(TarefasContext);
  if (!contexto) {
    throw new Error("useTarefas deve ser utilizado dentro de TarefasProvider.");
  }
  return contexto;
}