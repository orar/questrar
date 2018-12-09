import React from 'react';
import extractRequestIds from '../extractRequestIds';
import randomId from '../randomId'


const LoneChild = (props) => <div {...props} className="loneChild">Im a lone child on this page</div>


describe('[Function] extractRequestIds', () => {
  let props;
  let id;
  let children;
  let requestFactoryType;

  const createChildren = () => {
    children = Array(4).fill(1).map(key =>
      <LoneChild
        id={randomId()}
        rid={randomId()}
        requestFactoryType={requestFactoryType}
        key={`${key}`} />
    )
  };

  const createProps = () => {
    createChildren();

    props = { children, id }
  };

  beforeEach(() => {
    requestFactoryType = true;
    id = props => props.id;
    createProps();
  });

  it('Should throw if `id` prop is not a function', () => {
    id = 'useless_id';
    createProps();
    expects(() => extractRequestIds(props)).to.throw(/Expected id to be a function, instead of string/)
  });


  it('Should result empty list if `children` prop is null or empty', () => {
    props.children = null;
    expects(extractRequestIds(props)).to.be.empty();
  });

  it('Should extract a list of request id from children with `requestFactoryType` prop', () => {
    const ids = extractRequestIds(props);
    expects(ids).to.have.lengthOf(4)
  });

  xit('Should have an empty id list if `requestFactoryType` is set but children have no `id` prop', () => {
    const ids = extractRequestIds(props);
    expects(ids).to.have.lengthOf(4)
  });

  it('Should extract a list of request id from children using id prop function', () => {
    requestFactoryType = false
    id = props => props.rid;
    createProps();
    expects(extractRequestIds(props)).to.have.lengthOf(4)
  });

  it('Should not extract id from invalid react element', () => {
    props.children[2] = 'non-react element';
    props.children[3] = 'non-react element';
    expects(extractRequestIds(props)).to.have.lengthOf(2)
  })




});
