import { RegEx } from '@core-constants';
import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';

import { XB_InputMasked } from '../XB_InputMasked.component';

const getValue = jest.fn();
describe('testing component atom->input', () => {
  const maskedValue = '●●●● ●●●● 9';
  const unmaskedValue = '1234 5678 9';
  const prevalue = '123456789';

  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('render default masked input with label and empty value', () => {
    const { asFragment, getByRole, getByLabelText } = render(
      <XB_InputMasked id="Inp1" label="Default Input" getValue={getValue} />
    );
    const input = getByRole('textbox') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toEqual('');
    expect(getByLabelText('Default Input')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('render default input without label', () => {
    const { container, asFragment } = render(
      <XB_InputMasked id="Inp1" value="" getValue={getValue} />
    );
    expect(container.getElementsByTagName('label').length).toEqual(0);
    expect(asFragment()).toMatchSnapshot();
  });

  it('render disabled input', () => {
    const { asFragment, getByRole } = render(
      <XB_InputMasked
        id="Inp3"
        label="Disabled Input"
        disabled={true}
        getValue={getValue}
      />
    );
    const input = getByRole('textbox') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toBeDisabled();
    expect(asFragment()).toMatchSnapshot();
  });

  it('render input with text type and custom classes', () => {
    const { container, asFragment, getByRole } = render(
      <XB_InputMasked
        id="InpText"
        label="Text Input"
        classes="custom-class"
        getValue={getValue}
      />
    );
    expect(getByRole('textbox').getAttribute('type')).toBe('text');
    expect(getByRole('textbox')).toBeInTheDocument();
    expect(container.getElementsByClassName('custom-class').length).toEqual(1);
    expect(asFragment()).toMatchSnapshot();
  });

  it('render input with suffix icon', () => {
    const { container, asFragment, getByRole } = render(
      <XB_InputMasked
        id="InpText"
        label="Text Input"
        suffixIcon="help"
        getValue={getValue}
      />
    );
    const input = getByRole('textbox') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(container.getElementsByClassName('s-icon').length).toEqual(1);
    expect(container.getElementsByTagName('svg').length).toEqual(1);
    expect(asFragment()).toMatchSnapshot();
  });

  it('render input with prevalue, default mask length 8, mask char is ●', () => {
    const { asFragment, getByRole } = render(
      <XB_InputMasked
        id="InpText"
        label="Text Input"
        suffixIcon="help"
        preValue={prevalue}
        getValue={getValue}
      />
    );
    const input = getByRole('textbox') as HTMLInputElement;
    expect(input.value).toEqual(maskedValue);
    expect(asFragment()).toMatchSnapshot();
  });

  it('render input with prevalue, default mask lenght 8, mask char is ● value length is 5', () => {
    // 0 means all mask
    const { asFragment, getByRole } = render(
      <XB_InputMasked
        maskLength={6}
        id="InpText"
        label="Text Input"
        suffixIcon="help"
        preValue="12345"
        getValue={getValue}
      />
    );
    const input = getByRole('textbox') as HTMLInputElement;
    expect(input.value).toEqual('●●●● ●');
    expect(asFragment()).toMatchSnapshot();
  });

  it('render input with prevalue, mask length 0, mask char is ●', () => {
    // 0 means all mask
    const { getByRole } = render(
      <XB_InputMasked
        maskLength={0}
        id="InpText"
        label="Text Input"
        suffixIcon="help"
        preValue={prevalue}
        getValue={getValue}
      />
    );
    const input = getByRole('textbox') as HTMLInputElement;
    expect(input.value).toEqual('●●●● ●●●● ●');
    //   expect(asFragment()).toMatchSnapshot();
  });

  it('render input without suffix icon', () => {
    const { container, asFragment } = render(
      <XB_InputMasked
        maskLength={0}
        id="InpText"
        label="Text Input"
        suffixIcon="help"
        preValue={prevalue}
        showSuffixIcon={false}
        getValue={getValue}
      />
    );
    expect(container.getElementsByTagName('svg').length).toEqual(1);
    expect(asFragment()).toMatchSnapshot();
  });

  it('render input with suffix icon change on click', () => {
    const { container, getByRole, asFragment } = render(
      <XB_InputMasked
        id="InpText"
        label="Text Input"
        suffixIcon="help"
        preValue={prevalue}
        showSuffixIcon={true}
        getValue={getValue}
      />
    );
    const input = getByRole('textbox') as HTMLInputElement;
    expect(input.value).toEqual(maskedValue);
    const iconsvg = container.getElementsByClassName('s-icon') as any;
    expect(iconsvg.length).toEqual(1);
    fireEvent.pointerDown(iconsvg[0]);
    expect(input.value).toEqual(unmaskedValue);
    fireEvent.pointerUp(iconsvg[0]);
    fireEvent.mouseLeave(iconsvg[0]);
    expect(input.value).toEqual(maskedValue);
    expect(asFragment()).toMatchSnapshot();
  });

  it('input value should change on type', async () => {
    const { getByRole } = render(
      <XB_InputMasked
        id="InpText"
        label="Text Input"
        suffixIcon="help"
        preValue={''}
        showSuffixIcon={true}
        getValue={getValue}
        mask="●"
        regex={RegEx.onlyDigit}
      />
    );
    const input = getByRole('textbox') as HTMLInputElement;
    expect(input.value).toEqual('');
    fireEvent.change(input, { target: { value: '1' } });
    await waitFor(() => expect(input.value).toEqual('●'), {
      timeout: 30000,
    });
    fireEvent.change(input, { target: { value: '60000' } });
    await waitFor(() => expect(input.value).toEqual('●●●● ●'), {
      timeout: 30000,
    });
    fireEvent.change(input, { target: { value: '600000000011' } });
    await waitFor(() => expect(input.value).toEqual('●●●● ●●●● 0011'), {
      timeout: 30000,
    });
  });

  it('input value should change on type', async () => {
    const { getByRole } = render(
      <XB_InputMasked
        id="InpText"
        label="Text Input"
        suffixIcon="help"
        preValue={''}
        showSuffixIcon={true}
        getValue={getValue}
        mask="●"
      />
    );
    const input = getByRole('textbox') as HTMLInputElement;
    expect(input.value).toEqual('');
    fireEvent.change(input, { target: { value: '600000000011' } });
    await waitFor(() => expect(input.value).toEqual('●●●● ●●●● 0011'), {
      timeout: 30000,
    });
    fireEvent.change(input, { target: { value: '6000000000' } });
    await waitFor(() => expect(input.value).toEqual('●●●● ●●●● 00'), {
      timeout: 30000,
    });
    fireEvent.change(input, { target: { value: '' } });
    await waitFor(() => expect(input.value).toEqual(''), {
      timeout: 30000,
    });
  });

  it('should not allow paste value on input', async () => {
    const { getByRole } = render(
      <XB_InputMasked
        id="InpText"
        label="Text Input"
        suffixIcon="help"
        preValue={''}
        showSuffixIcon={true}
        getValue={getValue}
        mask="●"
        disablePaste={true}
      />
    );
    const input = getByRole('textbox') as HTMLInputElement;
    fireEvent.paste(input, { target: { value: '600000000011' } });
    await waitFor(() => expect(input.value).toEqual('600000000011'), {
      timeout: 30000,
    });
  });

  it('should empty selection part on onblur event', async () => {
    const { getByRole } = render(
      <XB_InputMasked
        id="InpText"
        label="Text Input"
        suffixIcon="help"
        preValue={''}
        showSuffixIcon={true}
        getValue={getValue}
        mask="●"
      />
    );
    const input = getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '600000000011' } });
    await waitFor(() => expect(input.value).toEqual('●●●● ●●●● 0011'), {
      timeout: 30000,
    });
    input.setSelectionRange(10, 11);
    userEvent.type(input, `${specialChars.backspace}`);
    await waitFor(() => expect(input.value).toEqual('●●●● ●●●● 011'), {
      timeout: 30000,
    });
    input.blur();
  });
  it('should show value without space', async () => {
    const { getByRole } = render(
      <XB_InputMasked
        id="InpText"
        label="Text Input"
        suffixIcon="help"
        preValue={''}
        showSuffixIcon={true}
        getValue={getValue}
        mask="●"
        spaceInterval={0}
      />
    );
    const input = getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '600000000011' } });
    await waitFor(() => expect(input.value).toEqual('●●●●●●●●0011'), {
      timeout: 30000,
    });
  });
  it('should select and remove value', async () => {
    const { getByRole } = render(
      <XB_InputMasked
        id="InpText"
        label="Text Input"
        suffixIcon="help"
        preValue={'600000000011'}
        showSuffixIcon={true}
        getValue={getValue}
        mask="●"
        spaceInterval={0}
      />
    );
    const input = getByRole('textbox') as HTMLInputElement;
    input.setSelectionRange(10, 11);
    userEvent.type(input, `${specialChars.backspace}`);
    await waitFor(() => expect(input.value).toEqual('●●●●●●●●001'), {
      timeout: 30000,
    });
  });
  it('should select and change value', async () => {
    const { getByRole } = render(
      <XB_InputMasked
        id="InpText"
        label="Text Input"
        suffixIcon="help"
        preValue={'600000000011'}
        showSuffixIcon={true}
        getValue={getValue}
        mask="●"
        spaceInterval={0}
        regex={RegEx.onlyDigit}
      />
    );
    const input = getByRole('textbox') as HTMLInputElement;
    input.setSelectionRange(10, 11);
    userEvent.type(input, `${specialChars.backspace}1`);
    await waitFor(() => expect(input.value).toEqual('●●●●●●●●0011'), {
      timeout: 30000,
    });
    input.setSelectionRange(10, 11);
    userEvent.type(input, `${specialChars.backspace}$`);
    await waitFor(() => expect(input.value).toEqual('●●●●●●●●001'), {
      timeout: 30000,
    });
  });
});
