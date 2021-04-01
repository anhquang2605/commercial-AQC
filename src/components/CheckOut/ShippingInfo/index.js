import React, {useState, useEffect, useRef} from 'react';
import './shipping-info.scss';
import Collapsable from "../../Plugins/Collaspable";
import Modal from "../../Plugins/Modal";
import firebase from '../../Firebase/firebase.js';
const db = firebase.firestore();
const ShippingInfo = (props) => {
    //Refs
    const modalRef = useRef();
    //States
    const [shippingList, setShippingList] = useState([]);
    const [currentShipping, setCurrentShipping] = useState(props.curShipping)
    const [allStates, setAllStates] = useState();
    const [shippingFormValues, setShippingFormValues] = useState({
        name:"",
        zip: "",
        city: "",
        resiState: "",
        address: "",
        id: "",
    });
    //Methods
    //data getter from firestore
    let fetchDataFromFireStore = (id) => {
        db.collection("shippings").get().then((dat)=>{
            var collections = dat.docs;
            var list = [];
            var promise = new Promise((resolve)=>{
                collections.forEach((doc)=>{
                    list.push(doc.data())
                });
                resolve();
             });
            promise.then(()=>{
                setShippingList(list);
                if (!id){
                    setCurrentShipping(list[0]);
                } else {
                    setCurrentShipping(list[id]);
                    props.setShippingForApp(list[id]);
                }
            });
        })
    }
    //Forms handlers
        //Handling Forms inputs
    let handleNameChange = (e) => {
        setShippingFormValues(prevState => ({
            ...prevState,
            name: e.target.value
        }))
    }
    let handleZipChange = (e) => {
        setShippingFormValues(prevState => ({
            ...prevState,
            zip: e.target.value
        }))
    }    
    let handleStateChange = (e) => {
        setShippingFormValues(prevState => ({
            ...prevState,
            resiState: e.target.value
        }))
    }
    let handleCityChange = (e) => {
        setShippingFormValues(prevState => ({
            ...prevState,
            city: e.target.value
        }))
    }
    let handleAddressChange = (e) => {
        setShippingFormValues(prevState => ({
            ...prevState,
            address: e.target.value
        }))
    }
    let updateCurrentShipping = (e) =>{
        let id = e.target.value;
        setCurrentShipping(shippingList[id]);
    }
        //Submitting form values
    let setShippingAddress = () => {
        if(shippingFormValues.length === 0 || shippingFormValues === undefined){
            return;
        } else {
            var newShipAddress = {...shippingFormValues};
            var lengthOfList = (shippingList.length).toString();
            newShipAddress.id = lengthOfList;
            db.collection("shippings").doc(lengthOfList).set(newShipAddress).then(()=>{
                fetchDataFromFireStore(newShipAddress.id);
            });
        }
    } 
    //When current shipping changed, update shipping info to Check Out component
    useEffect(()=>{
        if(currentShipping !== undefined){
            props.setShippingForApp(currentShipping);
        }
    },[currentShipping])
    //Getting shipping datas from fire store and states data from json file from public directory
    useEffect(() => {
        if (props.curShipping === undefined){
            fetchDataFromFireStore(0);
            fetch("USstates.json").then((dat)=>dat.json()).then(data=>{
                setAllStates(data);
            });
        } else {     
            fetchDataFromFireStore(props.curShipping.id);
            fetch("USstates.json").then((dat)=>dat.json()).then(data=>{
                setAllStates(data);
            });
        }

    }, []);

    return (
        <div id="shipping-info">
                <h4 className="check-out-title">Shipping</h4>
                <Collapsable
                    itemName="shipping"
                   //Top part of the collapsable plugin
                    chosenChildren= {currentShipping && 
                        <div className="shipping-chosen">
                            <span className="chosen-shipping-name">{currentShipping.name}</span>
                            <span className="chosen-shipping-address-line">{currentShipping.address}</span>
                            <span className="chosen-shipping-city-state">{currentShipping.city}, {currentShipping.resiState} {currentShipping.zip} </span>
                        </div>
                    }
                    //Bottom part of the collapsable plugin where change field and form present
                    changeChildren={
                        (
                        <div>
                            <div className="shipping-options">
                                <table >
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Name</th>
                                            <th>Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {shippingList && currentShipping && shippingList.map((ship)=>{
                                        return(
                                       <tr key={ship.id}>
                                           <td><input onClick={updateCurrentShipping} type="radio" name="shipping" checked={currentShipping.id === ship.id} value={ship.id}></input></td>
                                           <td className="ship-name">{ship.name}</td>
                                           <td className="ship-address">{ship.address}</td>
                                       </tr>     
                                        );
                                    })}
                                    </tbody>
                                </table>
                                <button onClick={()=>{modalRef.current.showModal()}}>+ Add new Address</button>
                            </div>
                            <Modal ref={modalRef} extraFuncToCloseMethod name="add_shipping">{/*Provdie name to make unique ID for the modal*/}
                                <div className="shipping-adding">
                                    <span className="add-shipping-name">
                                        <label className="label">For (Name):</label>
                                        <input value={shippingFormValues.name} onChange={handleNameChange} type="text" placeholder="Enter Name Here"></input>
                                    </span>
                                    <span className="add-shipping-address">
                                        <label className="label">Address</label>
                                        <input value={shippingFormValues.address} onChange={handleAddressChange}  type="text" placeholder="Enter Address"></input>
                                    </span>
                                    <span className="add-shipping-state">
                                        <label className="label">State</label>
                                        <select value={shippingFormValues.resiState} onChange={handleStateChange}>
                                            {allStates && allStates.map((daState)=>{
                                                return(
                                                    <option key={daState.abbreviation} value={daState.abbreviation}>{daState.name}</option>
                                                );
                                            })}
                                        </select>
                                    </span>
                                    <span className="add-shipping-city">
                                        <label className="label">City</label>
                                        <input value={shippingFormValues.city} onChange={handleCityChange} type="text" placeholder="Enter City"></input>
                                    </span>
                                    <span className="add-shipping-zip">
                                        <label className="label">Zip</label>
                                        <input value={shippingFormValues.zip} onChange={handleZipChange} type="text" placeholder="Enter zip code"></input>
                                    </span>
                                </div>
                                <button onClick={setShippingAddress}>Add the Address</button>
                            </Modal>
                        </div>
                        )
                    }
                >

                </Collapsable>
        </div>
    );
}

export default ShippingInfo;
