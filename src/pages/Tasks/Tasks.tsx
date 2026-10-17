import { useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../../components/Layout/Layout";
import { TaskList } from "../../components/TaskList/TaskList";
import { useTarefas } from "../../contexts/TarefasContext";
import type { Tarefa } from "../../types/Tarefa";
import "./Tasks.css";

export type VisaoTarefas = "tarefas" | "hoje" | "proximas" | "concluidas";

type TasksProps = {
  visao: VisaoTarefas;
};

const conteudoPorVisao: Record<
  VisaoTarefas,
  { titulo: string; descricao: string; identificador: string }
> = {
  tarefas: {
    titulo: "Todas as tarefas",
    descricao: "Visualização completa das tarefas cadastradas.",
    identificador: "VISÃO GERAL",
  },
  hoje: {
    titulo: "Hoje",
    descricao: "Concentre-se no que precisa avançar agora.",
    identificador: "FOCO DO DIA",
  },
  proximas: {
    titulo: "Próximas",
    descricao: "Tarefas previstas para os próximos dias.",
    identificador: "PLANEJAMENTO",
  },
  concluidas: {
    titulo: "Concluídas",
    descricao: "Tarefas que já foram finalizadas.",
    identificador: "FINALIZADAS",
  },
};

function obterDataAtual() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function correspondeAVisao(tarefa: Tarefa, visao: VisaoTarefas, hoje: string) {
  switch (visao) {
    case "hoje":
      return !tarefa.concluida && tarefa.data === hoje;
    case "proximas":
      return !tarefa.concluida && tarefa.data > hoje;
    case "concluidas":
      return tarefa.concluida;
    case "tarefas":
      return !tarefa.concluida;
  }
}

export function Tasks({ visao }: Readonly<TasksProps>) {
  const { abrirTaskModal, editarTarefa } =
    useOutletContext<LayoutContext>();
  const {
    tarefas,
    carregando,
    erro,
    removerTarefa,
    alternarConclusao,
  } = useTarefas();
  const { titulo, descricao, identificador } = conteudoPorVisao[visao];
  const hoje = obterDataAtual();
  const tarefasVisiveis = tarefas.filter((tarefa) =>
    correspondeAVisao(tarefa, visao, hoje),
  );

  return (
    <section className="tasks-page">
      <div className="tasks-page__heading">
        <div>
          <p className="page-eyebrow">{identificador}</p>
          <h1>{titulo}</h1>
          <p>{descricao}</p>
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
          tarefas={tarefasVisiveis}
          aoExcluir={removerTarefa}
          aoEditar={editarTarefa}
          aoAlternarConclusao={alternarConclusao}
        />
      )}
    </section>
  );
}
