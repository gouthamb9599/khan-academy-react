import React from 'react';
import '../styles/model.css';

const Modal = (props) => {
    const showHideStyle = {
        display: props.show ? "block" : "none"
    }
    return (
        <div style={showHideStyle} className='modal' >
            <section className="modal-main">
                {props.children}
                <button onClick={props.handleClose}>close</button>
            </section>
        </div>
    );
};

export default Modal;
