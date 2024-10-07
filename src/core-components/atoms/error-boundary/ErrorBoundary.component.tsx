import { Component, ErrorInfo, ReactNode } from "react";
import * as React from "react";

import ShowImg from "@src/assets/images/errorboundary.png";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

const { REACT_APP_TYPE } = process.env;

export class ErrorBoundary extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public async componentDidCatch(error: Error, errorInfo: ErrorInfo) {}

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex align-middle items-center flex-col h-screen">
          <img src={ShowImg} />
          <h1 className="m-display-xl-bold mt-4 text-gray-900">
            Something went wrong!
          </h1>
          <p className="m-text-lg-regular mt-4 text-gray-600">
            Sometimes even the best mandis have a slow day. Login again after a
            quick chai, and you will be good to go.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
