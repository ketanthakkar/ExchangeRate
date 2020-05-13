import React from 'react';
import axios from 'axios';

import './App.css';

class App extends React.Component {

    constructor() {
        super();
        
        this.state = {
          baseCurrency: 'USD',
          targetCurrency: 'EUR',
          baseAmount: 0,
          targetAmount: 0,
          rates: [],
          currencies: [],
        };
    }

    componentDidMount() {
        this.callAPI(this.state.baseCurrency);
    }

    changeBaseCurrency = (e) => {
        this.setState({ baseCurrency: e.target.value});
        this.callAPI(e.target.value);
    }

    changeTargetCurrency = (e) => {
        this.setState({
            targetCurrency: e.target.value,
            targetAmount: Number.parseFloat(this.state.baseAmount * this.state.rates[e.target.value]).toFixed(2)});
    }
    
    changeBaseAmount = (e) => {
        this.setState({
        baseAmount: e.target.value,
        targetAmount: Number.parseFloat(e.target.value * this.state.rates[this.state.targetCurrency]).toFixed(2)
        });
    }

    changeTargetAmount = (e) => {
        this.setState({
            targetAmount: e.target.value,
            baseAmount: Number.parseFloat(e.target.value / this.state.rates[this.state.targetCurrency]).toFixed(2)
        });
    }

    validate = (e) => {
        let val = e.target.value;
        e.target.value = (val.indexOf(".") >= 0) ? (val.substr(0, val.indexOf(".")) + val.substr(val.indexOf("."), 3)) : val;
    }
  
  //API call to get latest data
    callAPI = (base) => {
        const url = `https://api.exchangeratesapi.io/latest?base=${base}`;
        
        return axios.get(url)
        .then(data => { 
            this.setState({
                rates: data.data['rates'],
                currencies: Object.keys(data.data['rates']).sort(),
                targetAmount: Number.parseFloat(this.state.baseAmount * data.data['rates'][this.state.targetCurrency]).toFixed(2)
            })
            this.startTimer();
        });
    }

    startTimer = () => {
        this.refreshRate = setTimeout(() => {
            this.callAPI(this.state.baseCurrency);
        }, 10000);
    }

    componentWillUnmount() {
        clearTimeout(this.refreshRate);
    }
    
    render() {
        const {currencies, rates, baseCurrency, baseAmount, targetAmount, targetCurrency} = this.state;
  
        const selectCurrency = currencies.map(currency =>
            <option key={currency} value={currency}> {currency} </option>      
          );

        return (
            <section className="main-container">
                <div className="exchange-container">
                    <h2>Exchange</h2>
                    <div className="form-container">
                        <form>
                            <div className="currency-container">               
                                <select name="baseCurrency" value={baseCurrency} onChange={this.changeBaseCurrency}>
                                    {selectCurrency}
                                    <option>{baseCurrency}</option>
                                </select>
                                <input className="amount-text" 
                                        type='number' 
                                        placeholder="0.00" 
                                        value={baseAmount} 
                                        onInput={this.validate} 
                                        onChange={this.changeBaseAmount}>
                                </input>
                            </div>
                            <div className="rate-container">
                                <span className="rates">
                                    1 {baseCurrency} = {rates && rates[targetCurrency]} {targetCurrency}
                                </span>
                            </div>
                            <div className="currency-container target-container">
                                <select name="targetCurrency" value={targetCurrency} onChange={this.changeTargetCurrency}>
                                    {selectCurrency}
                                </select> 
                                <input className="amount-text"
                                       type='number'
                                       placeholder="0.00"
                                       value={targetAmount}
                                       onInput={this.validate}
                                       onChange={this.changeTargetAmount}>
                                </input>
                            </div>                    
                        </form>
                    </div>
                </div>
            </section>
        );
    }
}

export default App;