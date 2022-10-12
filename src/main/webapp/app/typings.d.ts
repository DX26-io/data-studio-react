declare module '*.json' {
  const value: any;
  export default value;
}

declare namespace React {
  type StatelessComponent<P> = React.FunctionComponent<P>;
}
