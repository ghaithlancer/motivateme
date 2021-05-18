/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from 'react'
import {Button,Card,Form,Container,Row,Col, Alert, Modal} from "react-bootstrap"
import firebase from '../firebase'
import {useAuth} from '../contexts/AuthContext'


const Comments = ({com, comID, postID}) => {

    const [comDel, setComDel] = useState(false)
    const [show, setShow] = useState(false)



    async function delCom(){
        await firebase.firestore().collection('posts').doc(postID).update(
            'comments', firebase.firestore.FieldValue.arrayRemove({'comment': com.comment, 'uname': com.uname, 'timestamp': com.timestamp})
        )
        setComDel(true)
        setShow(false)
    }


    const handleClose = () => {setShow(false)}
    const handleShow = () => {setShow(true)}

    return (
        <>
            {/* Delete comment modal popup */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to permanently delete this comment?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={delCom}>
                        Delete Comment
                    </Button>
                </Modal.Footer>
            </Modal>
            <Container  >
                {!comDel && 
                    <Row>
                        <Col>
                            <h3>{com.uname}</h3>
                            <h4>{com.comment}</h4>
                        </Col>
                        <Col>
                        <Button onClick={handleShow}>Delete Comment</Button>
                        </Col>
                    </Row>
                }
            </Container>
        </>
    )
}

export default Comments