import { render } from "@src/test-utils";
import { fireEvent } from "@testing-library/react";

import { XB_Input } from "../IG_Input.component";

describe("testing component atom->input", () => {
  it("render default input with label and value", () => {
    const { asFragment, getByRole, getByLabelText } = render(
      <XB_Input id="Inp1" label="Default Input" value="test" />
    )[0];
    const input = getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toEqual("test");
    expect(getByLabelText("Default Input")).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it("render default input without label", () => {
    const { container, asFragment } = render(
      <XB_Input id="Inp1" value="test" />
    )[0];
    expect(container.getElementsByTagName("label").length).toEqual(0);
    expect(asFragment()).toMatchSnapshot();
  });

  it("render disabled input", () => {
    const { asFragment, getByRole } = render(
      <XB_Input id="Inp3" label="Disabled Input" disabled={true} />
    )[0];
    const input = getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toBeDisabled();
    expect(asFragment()).toMatchSnapshot();
  });

  it("render focused input", () => {
    const { container, asFragment, getByRole } = render(
      <XB_Input id="Inp3" label="Disabled Input" disabled={true} />
    )[0];
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.focus(input);
    expect(container.getElementsByClassName("input--focused").length).toEqual(
      1
    );
    fireEvent.blur(input);
    expect(container.getElementsByClassName("input--focused").length).toEqual(
      0
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("render input with text type and custom classes", () => {
    const { container, asFragment, getByRole } = render(
      <XB_Input id="InpText" label="Text Input" classes="custom-class" />
    )[0];
    expect(getByRole("textbox").getAttribute("type")).toBe("text");
    expect(getByRole("textbox")).toBeInTheDocument();
    expect(container.getElementsByClassName("custom-class").length).toEqual(1);
    expect(asFragment()).toMatchSnapshot();
  });

  it("render input with suffix icon", () => {
    const { container, asFragment, getByRole } = render(
      <XB_Input id="InpText" label="Text Input" suffixIcon="help" />
    )[0];
    const input = getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(container.getElementsByClassName("s-icon").length).toEqual(1);
    expect(container.getElementsByTagName("svg").length).toEqual(1);
    expect(asFragment()).toMatchSnapshot();
  });

  it("render input with prefix icon", () => {
    const { container, asFragment, getByRole } = render(
      <XB_Input id="InpText" label="Text Input" prefixIcon="mail" />
    )[0];
    const input = getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(container.getElementsByClassName("p-icon").length).toEqual(1);
    expect(container.getElementsByTagName("svg").length).toEqual(1);
    expect(asFragment()).toMatchSnapshot();
  });

  it("render input with card", () => {
    const { container, asFragment, getByRole } = render(
      <XB_Input
        id="InpText"
        label="Text Input"
        prefixCard={<img src="dummy-image" alt="dummy image" />}
      />
    )[0];
    const input = getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(container.getElementsByClassName("prefix").length).toEqual(1);
    expect(container.getElementsByClassName("input")[0].classList).toContain(
      "input--p-card"
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("render input with prefix content", () => {
    const { container, asFragment, getByRole } = render(
      <XB_Input
        id="InpText"
        label="Text Input"
        prefixChild={<span className="prefix-content">Test Content</span>}
      />
    )[0];
    const input = getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(container.getElementsByClassName("input")[0].classList).toContain(
      "input--p-child"
    );
    expect(container.getElementsByClassName("prefix").length).toEqual(1);
    expect(container.getElementsByClassName("prefix-content").length).toEqual(
      1
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("calls onInputChange when input value changes", () => {
    const mockInputChange = jest.fn();
    const { getByRole } = render(
      <XB_Input
        id="Inp4"
        label="Input with Callback"
        value="initialValue"
        onInputChange={mockInputChange}
      />
    )[0];
    const input = getByRole("textbox") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "new value" } });

    expect(mockInputChange).toHaveBeenCalledWith("new value");
  });

  it("input with suffix text and suffix icon", () => {
    const { container, getByRole } = render(
      <XB_Input
        id="Inp6"
        label="Suffix Text and Icon"
        suffixText="units"
        suffixIcon="search"
      />
    )[0];
    const input = getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(container.getElementsByClassName("suffix-text").length).toEqual(1);
    expect(container.getElementsByClassName("s-icon").length).toEqual(1);
    expect(container.getElementsByTagName("svg").length).toEqual(1);
  });

  it("renders input with prefix child and prefix card", () => {
    const { container, getByRole } = render(
      <XB_Input
        id="Inp7"
        label="Prefix Child and Card"
        prefixChild={<span className="prefix-content">Test Child Content</span>}
        prefixCard={<img src="dummy-image" alt="dummy image" />}
      />
    )[0];
    const input = getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(container.getElementsByClassName("input")[0].classList).toContain(
      "input--p-child"
    );
    expect(container.getElementsByClassName("prefix").length).toEqual(2);
    expect(container.getElementsByClassName("prefix-content").length).toEqual(
      1
    );
    expect(container.getElementsByTagName("img").length).toEqual(1);
  });

  it("calls onIconClick when suffix icon is clicked", () => {
    const mockIconClick = jest.fn();
    const { container } = render(
      <XB_Input
        id="Inp8"
        label="Icon Click Callback"
        suffixIcon="search"
        onIconClick={mockIconClick}
      />
    )[0];
    const suffixIcon = container.getElementsByClassName("s-icon")[0];

    fireEvent.pointerDown(suffixIcon);
    fireEvent.pointerUp(suffixIcon);

    expect(mockIconClick).toHaveBeenCalledTimes(2);
  });
});
