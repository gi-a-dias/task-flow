import { useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../../components/Layout/Layout";
import { TaskList } from "../../components/TaskList/TaskList";
import { useTarefas } from "../../contexts/TarefasContext";
import type { Tarefa } from "../../types/Tarefa";
import "./Tasks.css";

export type VisaoTarefas = "tarefas" | "hoje" | "proximas" | "concluidas";

type ConfigVisao = {
  eyebrow: string;
  titulo: string;
  descricao: string;
  incluir: (tarefa: Tarefa, hoje: string) => boolean;
};

const VISOES: Record<VisaoTarefas, ConfigVisao> = {
  tarefas: {
    eyebrow: "VISÃO GERAL",
    titulo: "Todas as tarefas",
    descricao: "Tarefas ainda não concluídas, independentemente da data.",
    incluir: (t) => !t.concluida,
  },
  hoje: {
    eyebrow: "HOJE",
    titulo: "Hoje",
    descricao: "Tarefas pendentes previstas para hoje.",
    incluir: (t, hoje) => !t.concluida && t.data === hoje,
  },
  proximas: {
    eyebrow: "PRÓXIMAS",
    titulo: "Próximas",
    descricao: "Tarefas pendentes com data posterior a hoje.",
    incluir: (t, hoje) => !t.concluida && t.data > hoje,
  },
  concluidas: {
    eyebrow: "CONCLUÍDAS",
    titulo: "Concluídas",
    descricao: "Tarefas que já foram finalizadas.",
    incluir: (t) => t.concluida,
  },
};

type TasksProps = {
  visao: VisaoTarefas;
};
function obterDataAtual() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export function Tasks({ visao }: Readonly<TasksProps>) {
  const { abrirTaskModal, editarTarefa } = useOutletContext<LayoutContext>();
  const { tarefas, carregando, erro, removerTarefa, alternarConclusao } =
    useTarefas();

  const config = VISOES[visao];
  const hoje = obterDataAtual();
  const tarefasDaVisao = tarefas.filter((tarefa) => config.incluir(tarefa, hoje));

  return (
    <section className="tasks-page">
      <div className="tasks-page__heading">
        <div>
          <p className="page-eyebrow">{config.eyebrow}</p>
          <h1>{config.titulo}</h1>
          <p>{config.descricao}</p>
        </div>

        <button type="button" onClick={abrirTaskModal}>
          Nova tarefa
        </button>
      </div>

      {erro && <p className="tasks-page__error">{erro}</p>}

      {carregando ? (
        <p>Carregando tarefas...</p>
      ) : (
        <TaskList
          tarefas={tarefasDaVisao}
          aoExcluir={removerTarefa}
          aoEditar={editarTarefa}
          aoAlternar={alternarConclusao}
        />
      )}
    </section>
  );
}