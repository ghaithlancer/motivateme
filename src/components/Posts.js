/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from 'react'
import {Button,Card,Form,Container,Row,Col, Alert, Modal} from "react-bootstrap"
import firebase from '../firebase'
import {useAuth} from '../contexts/AuthContext'
import Comments from './Comments'

const Posts = ({post, postID}) => {

    const commentRef = useRef()
    const [loading, setLoading] = useState(false)
    const {uname, userComment} = useAuth()
    const [comments, setComments] = useState([])
    const [deleted, setDeleted] = useState(false)
    const [show, setShow] = useState(false)

    async function delPost(){
        await firebase.firestore().collection('posts').doc(postID).delete()
        .then(() => {
            // console.log('deleted')
            setDeleted(true)
            setShow(false)
        })
    }

    

    async function handleSubmit(e){
        e.preventDefault()
        await userComment(commentRef.current.value, postID)
        commentRef.current.value = ''
        getComments()
    }

    async function getComments(){
        try{
            setLoading(true)
            setComments(null)
            await firebase.firestore().collection('posts').doc(postID).get()
            .then((query) => {
                setComments(query.data().comments)
            })
        } catch(err) {
            console.log(err)
        }
        setLoading(false)
    }

    useEffect(() => {
        getComments()
    }, [])

    
    const handleClose = () => {setShow(false)}
    const handleShow = () => {setShow(true)}

    return (
        <>
        {/* Delete post modal popup */}
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Warning!</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to permanently delete this post?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={delPost}>
                    Delete Post
                </Button>
            </Modal.Footer>
        </Modal>
        
        { !deleted &&
        <Container fluid className="shadow-lg p-3 mb-5 bg-white rounded" >
        <Row >
            <Col lg='2'>
                <img src={post.pp} alt='profile pic' style={{width: '70px', borderRadius: '10px',}}/>
                <h1>{post.uname}</h1>
            </Col>
            <Col>
                <h1>{post.post}</h1>
            </Col>
            <Col>
                <Button onClick={handleShow}>Delete Post</Button>
            </Col>
        </Row>
        <Row>
                <Col>
                    <Form onSubmit={handleSubmit}>
                            <Form.Group id="post" as={Row}>
                                <Form.Control type="text-area" ref={commentRef} required placeholder="Comment..." style={{height: '15vh'}}/>
                            </Form.Group>
                            <Button disabled={loading} className="w-100" type="submit">Post</Button>
                    </Form>
                </Col>
        </Row>
        <Row style={{marginTop: '100px'}}>
                <Col style={{marginTop: '15px', overflowY: 'scroll', maxHeight: '300px' }}>
                    {
                        comments ?
                        comments.sort((a,b) => b.timestamp.seconds - a.timestamp.seconds)
                        .map((comment, i) => {
                            return (
                                <Comments com={comment} comID={i} postID={postID} key={i}/>
                            )
                        })
                        : <h3>No comments</h3>
                    }
            </Col>
        </Row>
        </Container>
            }
            </>
    )
}

export default Posts