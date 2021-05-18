/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from 'react'
import {Button,Card,Form,Container,Row,Col, Alert} from "react-bootstrap"
import {useAuth} from '../contexts/AuthContext'
import firebase from '../firebase'
import Posts from './Posts'


export default function Home() {
    const postRef = useRef()
    const {userPost} = useAuth()
    const [loading, setLoading] = useState(false)
    const timestamp = firebase.firestore.Timestamp.now()
    const [posts, setPosts] = useState([])


    function handleSubmit(e){
        e.preventDefault()
        setPosts('')
        userPost(postRef.current.value)
        postRef.current.value = ''
        console.log("success post!")
        getPosts()
    }

    async function getPosts(){
        try{
            setLoading(true)
            await firebase.firestore().collection('posts').get()
            .then((query) => {
                query.forEach((userDoc) =>{
                    setPosts(arr => [{userPost: userDoc.data(), postID: userDoc.id}, ...arr])
                })
            })
        } catch(err) {
            console.log(err)
        }
        setLoading(false)
    }

    useEffect(() => {
        getPosts()
    }, [])
    


    return (
        <Container fluid="md" style={{minHeight: '80vh'}}>
            <Row>
                <Col>
                    <Form onSubmit={handleSubmit}>
                            <Form.Group id="post" as={Row}>
                                <Form.Control type="text-area" ref={postRef} required placeholder="What's on your mind today?" style={{height: '15vh'}}/>
                            </Form.Group>
                            <Button disabled={loading} className="w-100" type="submit">Post</Button>
                    </Form>
                </Col>
            </Row>
            <Row style={{marginTop: '10px'}}>
                <Col>
                    {
                        posts ? 
                            posts.sort((a,b) => b.userPost.timestamp.seconds - a.userPost.timestamp.seconds) 
                            .map((post, i) => {
                                return(
                                    <Posts post={post.userPost} postID={post.postID} key={i} />
                                )
                            })
                        :
                         <h1>No comments</h1>
                    }
                </Col>
            </Row>
        </Container>
    )
}
