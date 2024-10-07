import { render } from '@src/test-utils';

import { AU_Spinner } from '../AU_Spinner.component';

describe('Testing AU_Spinner component', () => {
  it('renders with correct styles', () => {
    const { baseElement } = render(
      <AU_Spinner size={'medium'} color={'primary'} />
    )[0];
    const element1Count =
      baseElement.getElementsByClassName('spinner-medium').length;
    const element2Count =
      baseElement.getElementsByClassName('primary-spinner').length;
    expect(element1Count).toEqual(1);
    expect(element2Count).toEqual(1);
  });
});
