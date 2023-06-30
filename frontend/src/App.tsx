import { ConfigProvider } from 'antd';
import es from 'antd/locale/es_ES';
import { IconContext } from 'react-icons';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './auth/contexts';
import { AppRouter } from './router/AppRouter';
import { antdTheme } from './shared/constants';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ConfigProvider locale={es} theme={antdTheme}>
          <BrowserRouter>
            <IconContext.Provider value={{ className: 'react-icons' }}>
              <AppRouter />
            </IconContext.Provider>
          </BrowserRouter>
        </ConfigProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
