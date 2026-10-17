import { X } from "lucide-react";
import { useTarefas } from "../../contexts/TarefasContext";
import type { Tarefa } from "../../types/Tarefa";
import { TaskForm } from "../TaskForm/TaskForm";
import "./TaskModal.css";
type NovaTarefa = Omit<Tarefa, "_id">;
type TaskModalProps = {
  aberto: boolean;
  tarefa: Tarefa | null;
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
  async function salvarTarefa(novaTarefa: NovaTarefa) {
    if (tarefa) {
      await atualizarTarefa({ ...tarefa, ...novaTarefa });
    } else {
      await adicionarTarefa(novaTarefa);
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
          key={tarefa?._id ?? "nova"}
          tarefa={tarefa}
          aoSalvar={salvarTarefa}
          aoCancelar={aoFechar}
        />
      </div>
    </div>
  );
}
