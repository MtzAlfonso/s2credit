import { Button, Layout, Menu } from 'antd';
import { useContext } from 'react';

import { AuthContext } from '../../auth/contexts';

const { Header } = Layout;

export const Navbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        items={new Array(3).fill(null).map((_, index) => ({
          key: String(index + 1),
          label: `nav ${index + 1}`,
        }))}
      />
      <Button type="primary" danger onClick={() => logout()}>
        Log out
      </Button>
    </Header>
  );
};
