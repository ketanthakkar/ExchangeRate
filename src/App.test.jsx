import React from 'react';
import { shallow, mount } from 'enzyme';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import App from './App'

describe('App Snapshot', () => {
    it('renders', () => {
      const component = shallow(<App />);
      expect(component).toMatchSnapshot();
    });
});

describe('App', () => {
    it('renders without crashing', () => {
        const wrapper = shallow(<App />);

        expect(wrapper).toBeTruthy();
    });

    it('should select correct base currency on change', () => {
        const wrapper = mount(<App />)
        wrapper.find('[name="baseCurrency"]').simulate('change', {target: {value: 'EUR'}});
        expect(wrapper.find('[name="baseCurrency"]').props().value).toBe('EUR');
    });

    it('should select correct target currency on change', () => {
        const wrapper = mount(<App />)
        wrapper.find('[name="targetCurrency"]').simulate('change', {target: {value: 'EUR'}});
        expect(wrapper.find('[name="targetCurrency"]').props().value).toBe('EUR');
    });

    it('should update state with response data', () => {
        const url = 'https://api.exchangeratesapi.io/latest?base=base';
        const mock = new MockAdapter(axios);
        const data = { response: true };
        mock
          .onGet(url)
          .reply(200, data);
    
    
        const component = shallow(<App />);
        const instance = component.instance();
    
        //instance.callAPI
        instance.callAPI('USD').then(response => {
          expect(response).toEqual(data);
          done();
        });
  
    });
});
