import React from 'react';

import {Container, Row,Col, Image} from 'react-bootstrap';



export default function getUserUI(name, profilePic, user){
    return (<Container>
        <Row><Col><Image src='https://www.himalmag.com/wp-content/uploads/2019/07/sample-profile-picture.png' 
        className='thumbnail float-left'
        style={{width:'48px', height:'48px'}}></Image></Col>
        <Col><span style={{fontSize:'0.5em'}}>{name}</span></Col></Row>
    </Container>)
};