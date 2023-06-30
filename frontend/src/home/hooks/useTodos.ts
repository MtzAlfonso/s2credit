import axios, { AxiosHeaders, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

import { environments } from '../../shared/constants';
import { ITodo } from '../interfaces';

function generateHeaders() {
  const token = localStorage.getItem('token');
  return new AxiosHeaders().set('Authorization', `Bearer ${token}`);
}

export const useTodos = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentTodo, setCurrentTodo] = useState<ITodo | null>(null);
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [externalTodos, setExternalTodos] = useState<ITodo[]>([]);
  const [ownTodos, setOwnTodos] = useState<ITodo[]>([]);
  const [isMerging, setIsMerging] = useState<boolean>(true);

  const jpTodosQuery = useQuery<AxiosResponse<ITodo[]>>(
    'jsonplaceholder-todos',
    () => {
      return axios.get(`${environments.API_URL}/todos`);
    }
  );

  const apiTodosQuery = useQuery<AxiosResponse<ITodo[]>>('api-todos', () => {
    const headers = generateHeaders();
    return axios.get(`${environments.BACKEND_URL}/todos`, { headers });
  });

  const updateTodoMutation = useMutation<AxiosResponse<ITodo>, Error, ITodo>(
    (todo) => {
      const headers = generateHeaders();
      return axios.patch(
        `${environments.BACKEND_URL}/todos/${todo.id}`,
        {
          id: +todo.id,
          userId: +todo.userId,
          title: todo.title,
          completed: todo.completed,
          deleted: todo.deleted,
          updated: todo.updated,
        },
        { headers }
      );
    }
  );

  const createTodoMutation = useMutation<AxiosResponse<ITodo>, Error, ITodo>(
    (todo) => {
      const headers = generateHeaders();
      return axios.post(
        `${environments.BACKEND_URL}/todos`,
        {
          id: +todo.id,
          userId: +todo.userId,
          title: todo.title,
          completed: todo.completed,
          deleted: false,
          updated: false,
        },
        { headers }
      );
    }
  );

  const restoreTodoMutation = useMutation<
    AxiosResponse<ITodo>,
    Error,
    {
      id: number;
      historyId: string;
    }
  >((todo) => {
    const headers = generateHeaders();
    return axios.post(
      `${environments.BACKEND_URL}/todos/restore/${todo.id}`,
      {
        historyId: todo.historyId,
      },
      { headers }
    );
  });

  const handleOpenModal = (todo: ITodo | null) => {
    setCurrentTodo(todo);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setCurrentTodo(null);
    setOpenModal(false);
  };

  const handleUpdateTodo = async (todo: ITodo) => {
    const { data } = await updateTodoMutation.mutateAsync({ ...todo });
    setTodos((prevTodos) => {
      return prevTodos.map((prevTodo) => {
        if (prevTodo.id === todo.id) {
          return { ...prevTodo, ...data };
        }
        return prevTodo;
      });
    });
  };

  const handleCreateTodo = async (todo: ITodo) => {
    const { data } = await createTodoMutation.mutateAsync({ ...todo });
    setTodos((prevTodos) => {
      return [...prevTodos, data];
    });
  };

  const handleRestoreTodo = async (todo: { id: number; historyId: string }) => {
    const { data } = await restoreTodoMutation.mutateAsync({ ...todo });
    setTodos((prevTodos) => {
      return prevTodos.map((prevTodo) => {
        if (prevTodo.id === todo.id) {
          return { ...prevTodo, ...data };
        }
        return prevTodo;
      });
    });
  };

  useEffect(() => {
    if (jpTodosQuery?.data?.data) {
      setExternalTodos(jpTodosQuery?.data.data);
    }
  }, [jpTodosQuery?.data?.data]);

  useEffect(() => {
    if (apiTodosQuery?.data?.data) {
      setOwnTodos(apiTodosQuery?.data.data);
    }
  }, [apiTodosQuery?.data?.data]);

  useEffect(() => {
    if (externalTodos.length > 0 && ownTodos.length === 0) {
      setTodos(externalTodos);
      setIsMerging(false);
    }

    if (externalTodos.length > 0 && ownTodos.length > 0) {
      setIsMerging(true);
      const mergedTodos = externalTodos.map((externalTodo) => {
        const ownTodo = ownTodos.find((ownTodo) => {
          return ownTodo.id === externalTodo.id;
        });
        if (ownTodo) return { ...externalTodo, ...ownTodo };
        return externalTodo;
      });
      const allTodos = [...mergedTodos, ...ownTodos]
        .sort((a, b) => a.id - b.id)
        .filter(
          (todo, index, self) =>
            index === self.findIndex((t) => t.id === todo.id)
        );
      setTodos(allTodos);
      setIsMerging(false);
    }
  }, [externalTodos, ownTodos]);

  return {
    currentTodo,
    todos,
    isLoading: isMerging,
    isError: jpTodosQuery.isError,
    openModal,
    isUpdateLoading: updateTodoMutation.isLoading,
    handleOpenModal,
    handleCloseModal,
    handleUpdateTodo,
    handleCreateTodo,
    handleRestoreTodo,
  };
};
