import { render, screen } from '@testing-library/react';

import { XB_Spinner } from '../XB_Spinner.component';

describe('XB_Spinner Component', () => {
  it('renders spinner correctly', () => {
    render(<XB_Spinner />);
    expect(screen.getByTestId('SPNR')).toBeInTheDocument();
  });

  it('does not render icon when iconName prop is not provided', () => {
    render(<XB_Spinner />);
    expect(screen.queryByTestId('spinner-icon')).toBeNull();
  });
});
