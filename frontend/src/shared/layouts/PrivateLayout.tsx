import { Breadcrumb, Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';

import { Navbar } from '../components';
const { Footer, Content } = Layout;

export const PrivateLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Navbar />
      <Content className="site-layout" style={{ padding: '0 50px' }}>
        <Breadcrumb
          style={{ margin: '16px 0' }}
          items={new Array(3).fill(null).map((_, index) => ({
            title: `Nav ${index + 1}`,
          }))}
        />
        <div
          style={{ padding: 24, minHeight: 380, background: colorBgContainer }}
        >
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', fontWeight: 600 }}>
        Powered by React + Ant Design
      </Footer>
    </Layout>
  );
};
