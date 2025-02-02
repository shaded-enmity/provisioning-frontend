/* eslint-disable react/prop-types */

import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { WizardProvider } from '../Components/Common/WizardContext';

const AllProviders = ({ children, provider }) => {
  const queryClient = new QueryClient();

  return (
    <WizardProvider provider={provider}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WizardProvider>
  );
};

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: (props) => <AllProviders provider={options.provider || 'aws'} {...props} />, ...options });

export * from '@testing-library/react';

export { customRender as render };
