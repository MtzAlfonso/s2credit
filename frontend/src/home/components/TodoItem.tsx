import {
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Badge, Button, Checkbox, message, Modal } from 'antd';
import { format } from 'date-fns';
import { FC, PropsWithChildren, useState } from 'react';

import { ITodo } from '../interfaces';

interface TodoItemProps {
  todo: ITodo;
  disabled?: boolean;
  onUpdateTodo: (todo: ITodo) => void;
  onOpenModal: () => void;
  onRestoreTodo: (todo: { id: number; historyId: string }) => void;
}

export const TodoItem: FC<PropsWithChildren<TodoItemProps>> = ({
  todo,
  disabled = false,
  onUpdateTodo,
  onOpenModal,
  onRestoreTodo,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <>
      <Badge.Ribbon
        text={todo.completed ? 'Completed' : 'Pending'}
        color={todo.completed ? 'green' : 'blue'}
      >
        <article
          style={{
            alignItems: 'center',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            gridGap: '1rem',
            justifyContent: 'space-between',
            opacity: todo.completed ? 0.3 : 1,
            padding: '3rem 2rem',
          }}
        >
          <section
            style={{
              display: 'flex',
              gap: '1rem',
              width: '100%',
              flexDirection: 'column',
            }}
          >
            <section
              style={{
                display: 'flex',
                gap: '0.5rem',
              }}
            >
              <Checkbox
                checked={todo.completed}
                onChange={() =>
                  onUpdateTodo({ ...todo, completed: !todo.completed })
                }
                disabled={disabled}
              />
              <div>{todo.id}. </div>
              <div>{todo.title}</div>
            </section>

            <section>
              <div>
                {todo?.History?.map((history) => (
                  <div
                    key={history.historyId}
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                    }}
                  >
                    <Button
                      type="link"
                      size="small"
                      icon={<ReloadOutlined />}
                      disabled={
                        disabled || history.historyId === todo.currentHistoryId
                      }
                      onClick={() => {
                        onRestoreTodo({
                          id: todo.id,
                          historyId: history.historyId,
                        });
                      }}
                    >
                      Restore this state
                    </Button>
                    <span>
                      {format(
                        new Date(history.updatedAt),
                        "dd/MM/yyyy HH:mm 'hrs'"
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </section>

          <section
            style={{
              display: 'flex',
              gap: '0.5rem',
            }}
          >
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={onOpenModal}
            />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => setDeleteModalOpen(true)}
            />
          </section>
        </article>
      </Badge.Ribbon>

      <Modal
        title="Sure to delete?"
        open={deleteModalOpen}
        centered
        onCancel={() => setDeleteModalOpen(false)}
        onOk={() => {
          onUpdateTodo({ ...todo, deleted: true });
          setDeleteModalOpen(false);
          message.success('Todo deleted successfully');
        }}
      >
        <p>Are you sure to delete this todo?</p>
      </Modal>
    </>
  );
};
