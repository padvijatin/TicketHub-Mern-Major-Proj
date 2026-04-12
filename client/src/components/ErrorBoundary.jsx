import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.handleReload = this.handleReload.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleReload() {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="py-[3rem]">
          <section className="mx-auto w-[min(72rem,calc(100%_-_3.2rem))] rounded-[2.4rem] border border-[rgba(248,68,100,0.14)] bg-[rgba(248,68,100,0.05)] px-[2rem] py-[2.4rem] text-center shadow-[var(--shadow-soft)]">
            <h1 className="text-[2.4rem] font-extrabold text-[var(--color-text-primary)]">
              Something went wrong
            </h1>
            <p className="mt-[0.8rem] text-[1.45rem] text-[var(--color-text-secondary)]">
              Please refresh the page. If the issue continues, try again in a moment.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-[1.6rem] inline-flex h-[4.6rem] items-center justify-center rounded-[1.4rem] bg-[var(--color-primary)] px-[2rem] text-[1.45rem] font-bold text-[var(--color-text-light)] transition-colors duration-200 hover:bg-[var(--color-primary-hover)]"
            >
              Refresh
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

