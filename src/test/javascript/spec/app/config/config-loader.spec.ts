import axios from 'axios';
import sinon from 'sinon';

import { loadConfig } from 'app/config/config-loader';
import config from 'app/config/constants';

describe('Config loader', () => {
  describe('loadConfig', () => {
    it('CLOUD is is truthy', () => {
      const resolvedObject = { mode: 'CLOUD' };
      axios.get = sinon.stub().returns(Promise.resolve(resolvedObject));
      await loadConfig();
      // console.log('config', config);
      expect(config).toBeTruthy();
    });

    it('CLOUD is is falsy', () => {
      const resolvedObject = { mode: 'SELF_MANAGED' };
      axios.get = sinon.stub().returns(Promise.resolve(resolvedObject));
      await loadConfig();

      expect(config.CLOUD).toBeFalsy();
    });
  });
});
