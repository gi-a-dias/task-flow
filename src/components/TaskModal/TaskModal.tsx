import { X } from "lucide-react";
import { useTarefas } from "../../contexts/TarefasContext";
import type { Tarefa } from "../../types/Tarefa";
import { TaskForm } from "../TaskForm/TaskForm";
import "./TaskModal.css";

type NovaTarefa = Omit<Tarefa, "_id">;

type TaskModalProps = {
  aberto: boolean;
  tarefa?: Tarefa | null;
  aoFechar: () => void;
};

export function TaskModal({
  aberto,
  tarefa,
  aoFechar,
}: Readonly<TaskModalProps>) {
  const { adicionarTarefa, atualizarTarefa } = useTarefas();

  if (!aberto) {
    return null;
  }

  async function salvarTarefa(dados: NovaTarefa) {
    if (tarefa?._id) {
      await atualizarTarefa(tarefa._id, dados);
    } else {
      await adicionarTarefa(dados);
    }

    aoFechar();
  }

  return (
    <div className="task-modal">
      <div
        className="task-modal__content"
        role="dialog"
        aria-modal="true"
        aria-label={tarefa ? "Editar tarefa" : "Nova tarefa"}
      >
        <button
          className="task-modal__close"
          type="button"
          aria-label="Fechar"
          onClick={aoFechar}
        >
          <X size={20} />
        </button>

        <TaskForm
          tarefaInicial={tarefa}
          aoSalvar={salvarTarefa}
          aoCancelar={aoFechar}
        />
      </div>
    </div>
  );
}