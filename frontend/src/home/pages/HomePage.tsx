import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Skeleton,
  Typography,
} from 'antd';
import { Formik } from 'formik';
import { boolean, number, object, string } from 'yup';

import { TodoItem } from '../components';
import { useTodos } from '../hooks';

const { Title } = Typography;

export const HomePage = () => {
  const {
    todos,
    isLoading,
    openModal,
    currentTodo,
    isUpdateLoading,
    handleCloseModal,
    handleOpenModal,
    handleUpdateTodo,
    handleCreateTodo,
    handleRestoreTodo,
  } = useTodos();

  if (isLoading)
    return (
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <Title>ToDo List</Title>
        <section
          style={{
            display: 'grid',
            gridGap: '2rem',
          }}
        >
          {[...Array(10)].map((_, index) => (
            <Skeleton active key={index} />
          ))}
        </section>
      </section>
    );

  return (
    <>
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <section
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title>ToDo List</Title>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal(null)}
            disabled={isUpdateLoading}
          >
            Add
          </Button>
        </section>

        <section
          style={{
            display: 'grid',
            gridGap: '2rem',
          }}
        >
          {todos
            ?.filter((todo) => !todo.deleted)
            ?.reverse()
            ?.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                disabled={isUpdateLoading}
                onUpdateTodo={handleUpdateTodo}
                onOpenModal={() => handleOpenModal(todo)}
                onRestoreTodo={handleRestoreTodo}
              />
            ))}
        </section>
      </section>

      <Modal
        title={currentTodo ? 'Edit todo' : 'Add todo'}
        destroyOnClose
        open={openModal}
        centered
        closable
        onCancel={handleCloseModal}
        footer={null}
      >
        <Formik
          initialValues={{
            userId: currentTodo?.userId || 1,
            title: currentTodo?.title || '',
            completed: currentTodo?.completed || false,
          }}
          onSubmit={(values) => {
            if (currentTodo) {
              handleUpdateTodo({
                id: currentTodo.id,
                userId: values.userId,
                title: values.title,
                completed: values.completed,
                updated: true,
                deleted: false,
                currentHistoryId: '',
                History: [],
              });
            } else {
              handleCreateTodo({
                id: todos?.length + 1,
                userId: values.userId,
                title: values.title,
                completed: values.completed,
                deleted: false,
                updated: false,
                currentHistoryId: '',
                History: [],
              });
            }
            handleCloseModal();
          }}
          validationSchema={object().shape({
            userId: number().required('User ID is required'),
            title: string().required('Title is required'),
            completed: boolean().required('Completed is required'),
          })}
          validateOnMount
        >
          {({ values, isValid, handleChange, handleSubmit }) => (
            <Form onSubmitCapture={handleSubmit} layout="vertical">
              <Form.Item label="User ID">
                <Input
                  type="number"
                  name="userId"
                  value={values.userId}
                  onChange={handleChange}
                  placeholder="1"
                />
              </Form.Item>

              <Form.Item label="Title">
                <Input
                  type="text"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  placeholder="This is a todo..."
                />
              </Form.Item>

              <Form.Item label="Completed">
                <Checkbox
                  name="completed"
                  checked={values.completed}
                  onChange={handleChange}
                />
              </Form.Item>

              <Form.Item>
                <section
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '1rem',
                  }}
                >
                  <Button type="primary" danger onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit" disabled={!isValid}>
                    Save
                  </Button>
                </section>
              </Form.Item>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};
