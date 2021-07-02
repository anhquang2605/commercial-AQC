import React, { Component } from 'react';
import './search-form.scss';
import {BiX} from 'react-icons/bi';
import {IoOptions} from 'react-icons/io5';
class SearchForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: this.props.name? this.props.name.replaceAll("_"," "): "",
            maxPrice: 0,
            minPrice: 0,
            types: '',
            avail: false,
            valid: false,
            validPrice: true,
        }
        this.onChangeMaxPrice = this.onChangeMaxPrice.bind(this);
        this.onChangeMinPrice = this.onChangeMinPrice.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.checkPriceRange = this.checkPriceRange.bind(this);
        this.handleInStockCheck = this.handleInStockCheck.bind(this);
    }
    onChangeName = (event) => {
        let val = event.target.value;

        this.setState(()=>({
            name: val
        }));
    }
    onChangeMaxPrice = (event) => {
        let val = parseInt(event.target.value);
        
        this.setState({
            maxPrice: val
        })
    }
    onChangeMinPrice = (event) => {
        let val = parseInt(event.target.value);
        this.setState({
            minPrice: val
        })
    }
    checkPriceRange = (event) => { 
        event.stopPropagation();
        let minPrice = parseInt(this.state.minPrice);
        let maxPrice = parseInt(this.state.maxPrice);
        if ( maxPrice === 0 ){
            this.setState({
                validPrice: true,
            })     
        } else {
            this.setState({
                validPrice: maxPrice > minPrice,
            })
        }
       
    }
    handleInStockCheck = (event) => {
        this.setState({
            avail: event.target.checked
        });
    }
    render() {
        return (
            <div id="search_form">
                <h4><IoOptions></IoOptions>Filter</h4>
                <span className="flex-item full-flex">
                    <label htmlFor="name">Name</label>
                    <span className="input container">
                    <input type="text" id="name" name="name" value={this.state.name} onChange={this.onChangeName}></input>
                    </span>
                </span>
                <span className="flex-item half-flex">
                <label htmlFor="maxPrice">Max Price</label>
                    <span className="input container">
                    {!this.state.validPrice && <span className="not-valid-price" >Price must be 0 or greater than the minimum price</span>}
                    <input className={this.state.validPrice? "" : "not-valid"}  type="number" id="max_price" name="maxPrice" value={this.state.maxPrice} onChange={this.onChangeMaxPrice} onKeyUp={this.checkPriceRange}></input>
                    {   !this.state.validPrice &&
                        <BiX></BiX>
                    }
                    </span>
                </span>
                <span className="flex-item half-flex">
                    <label htmlFor="minPrice">Min Price</label>
                    <span className="input container">
                        <input type="number" id="min_price" name="minPrice" value={this.state.minPrice} onChange={this.onChangeMinPrice} onKeyUp={this.checkPriceRange}></input>
                    </span>
    
                </span>
                <span className="flex-item full-flex">
                    <label className="instock-label" htmlFor="inStock">In stock?</label>
                    <input type="checkbox" value={this.state.avail} onChange={this.handleInStockCheck}></input>
                </span>   
                <button onClick={ (e) => {e.preventDefault(); this.props.onSubmitSearch(this.state.name, this.state.minPrice, this.state.maxPrice, this.state.avail)}} 
                    disabled={!this.state.validPrice}>Search</button>
                    {/*to add function reference instead of calling the function directly, 
                    otherwise the setState will be called infinitely within the render methods which might cause loop and max exceed error*/}
            </div>
        );
    }
}

export default SearchForm;
