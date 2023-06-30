import { Button, Form, Input } from 'antd';
import { Formik } from 'formik';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { object, string } from 'yup';

import { AuthContext } from '../contexts';

const validationSchema = object().shape({
  username: string().required('Username is required'),
  password: string().required('Password is required'),
});

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  return (
    <section
      style={{
        backgroundColor: '#fff',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        padding: '2rem',
        width: '100%',
        maxWidth: '300px',
      }}
    >
      <Formik
        initialValues={{ username: 's2credit', password: 's2creditJosé' }}
        onSubmit={(values) => {
          login(values.username, values.password);
          navigate('/home');
        }}
        validationSchema={validationSchema}
        validateOnMount
      >
        {({ values, isValid, handleChange, handleBlur, handleSubmit }) => (
          <Form onSubmitCapture={handleSubmit} layout="vertical">
            <Form.Item label="Username">
              <Input
                placeholder="John Doe"
                name="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Item>

            <Form.Item label="Password">
              <Input
                type="password"
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Item>

            <Form.Item>
              <Button
                htmlType="submit"
                disabled={!isValid}
                block
                type="primary"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </section>
  );
};
