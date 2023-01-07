function WithLogging(WrapComponent) {
  class XXX extends  React.component {
    constructor(props) {
      super(props);
      this.state = {count: 0};
    }

    render() {
      const {forwardRef, ...rest} = this.props;
      <WrapComponent ref={forwardRef} {...rest}/>
    }
  }

  return React.forwardRef((props, ref) => {
    return <XXX {...props} forwardRef={ref}/>
  })
}