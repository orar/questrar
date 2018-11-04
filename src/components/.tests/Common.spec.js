import React from 'react';
import { createChildren } from '../Common';
import { initialRequest } from '../../module/common';
import { shallow } from 'enzyme';
import { randomId } from '../../module/helper';

const LoneChild = (props) => <div {...props} className="loneChild">Im a lone child on this page</div>

describe('Common', function () {
  describe('[Function] (createChildren)', function () {
    let id;
    let requestState;
    let inject;
    let actions;
    let child = <LoneChild />;

    const createActions = () => {
      actions = {
        success: jest.fn(),
        pending: jest.fn(),
        failed: jest.fn(),
        remove: jest.fn(),
        dirty: jest.fn(),
        clean: jest.fn(),
      };
    };

    beforeEach(() => {
      id = randomId();
      inject = false;
      requestState = Object.assign({ id }, initialRequest);
      createActions();
    });


    it('Should simply return children if inject is set false', () => {
      const children = createChildren({ children: child, inject, requestState, actions });
      const shallowChild = shallow(children);
      expects(shallowChild.is('div.loneChild')).to.be.true()
      expects(shallowChild.prop('request')).to.be.undefined;
    });

    it('Should return injected children if inject is set true', () => {
      inject = true;
      const children = createChildren({ children: child, request: requestState, inject, actions });
      const shallowChild = shallow(children);
      expects(shallowChild.is('div.loneChild')).to.be.true();
      expects(shallowChild.prop('request')).to.be.eql({ data: requestState, actions });
    });

    it('Should inject custom props into children if inject is set as a function', () => {
      inject = r => ({ title: r.data.id, disabled: r.data.success, onClick: r.actions.success});
      const children = createChildren({ children: child, request: requestState, inject, actions });
      const shallowChild = shallow(children);
      expects(shallowChild.is('div.loneChild')).to.be.true();
      expects(shallowChild.is(`div[title="${requestState.id}"]`)).to.be.true();
      expects(shallowChild.is(`div[disabled=${requestState.success}]`)).to.be.true();
    })
  });
});
