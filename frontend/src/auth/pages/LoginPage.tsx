import { LoginForm } from '../components';

export const LoginPage = () => {
  return (
    <section
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <LoginForm />
    </section>
  );
};
