import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from '../src';

/* eslint-disable no-underscore-dangle */

describe('deferred tags', () => {
  let headElement;

  const container = document.createElement('div');

  beforeEach(() => {
    headElement = headElement || document.head || document.querySelector('head');

    // resets DOM after each run
    headElement.innerHTML = '';
    window.__spy__ = jest.fn();
  });

  afterEach(() => {
    delete window.__spy__;
    ReactDOM.unmountComponentAtNode(container);
  });

  describe('API', () => {
    beforeEach(() => {
      window.__spy__ = jest.fn();
    });

    afterEach(() => {
      delete window.__spy__;
    });

    it('executes synchronously when defer={true} and async otherwise', done => {
      ReactDOM.render(
        <div>
          <Helmet
            defer={false}
            script={[
              {
                innerHTML: `window.__spy__(1)`,
              },
            ]}
          />
          <Helmet
            script={[
              {
                innerHTML: `window.__spy__(2)`,
              },
            ]}
          />
        </div>,
        container
      );

      expect(window.__spy__.callCount).to.equal(1);

      requestAnimationFrame(() => {
        expect(window.__spy__.callCount).to.equal(2);
        expect(window.__spy__.args).to.deep.equal([[1], [2]]);
        done();
      });
    });
  });

  describe('Declarative API', () => {
    it('executes synchronously when defer={true} and async otherwise', done => {
      ReactDOM.render(
        <div>
          <Helmet defer={false}>
            <script>window.__spy__(1)</script>
          </Helmet>
          <Helmet>
            <script>window.__spy__(2)</script>
          </Helmet>
        </div>,
        container
      );

      expect(window.__spy__.callCount).to.equal(1);

      requestAnimationFrame(() => {
        expect(window.__spy__.callCount).to.equal(2);
        expect(window.__spy__.args).to.deep.equal([[1], [2]]);
        done();
      });
    });
  });
});
