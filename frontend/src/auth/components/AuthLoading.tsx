import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export const AuthLoading = () => {
  return (
    <section
      style={{
        alignItems: 'center',
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
      }}
    >
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
    </section>
  );
};
