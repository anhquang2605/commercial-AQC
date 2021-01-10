import {React, useEffect, useState} from 'react';
import ImageView from './ImageView';
import ItemDetail from './ItemDetail';
import OrderTypeRadio from './OrderTypesRadio/OrderTypeRadio';
import ORDERS from '../../model/Orders';
import './order-detail.scss';
const OrderDetail = (props) => {
    let idFromParams = props.match.params.id - 1;
    let theOrder = ORDERS[idFromParams];
    let getImgSrcFromType = (type) =>{
        return order.id + "-" + type + ".jpg";
    }
    const [order, setOrder] = useState(theOrder);
    const [curType, setCurType] = useState(order.types[0]);
    const [curImg, setCurImg] = useState(getImgSrcFromType(order.types[0]));
    //handler to send to order type radio so that it can update the current type for order detail component
    let upDateCurType = (daType) =>{
        setCurType(daType);
    }
    //watch for curtype change then update img src 
    useEffect(()=>{
        setCurImg(getImgSrcFromType(curType));
    }, [curType]);
    
    if (order == null){
        return "Loading....";
    }
    return (
        <div id="order_detail">
            <ImageView key={curImg} imgSrc={curImg} imgName={curType + " " + order.name.toLowerCase()} ></ImageView>
            <ItemDetail daOrder={order}></ItemDetail>
            <OrderTypeRadio upDateCurType={upDateCurType} types={order.types}></OrderTypeRadio>
            <div className="payment-proceed-btn-group">
                <button onClick={()=>{
                    props.addItem({
                        name: order.name,
                        quantity: 1,
                        id: order.id,
                        price: order.price,
                        type: curType,
                    })
                    props.reRendering();
                }} disabled={order.quantity <= 0}>Add to Cart</button>
                <button disabled={order.quantity <= 0}>
                    Buy Now
                </button>
            </div>
        </div>
    );
}

export default OrderDetail;
