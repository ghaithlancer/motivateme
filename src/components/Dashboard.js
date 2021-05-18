/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useRef} from 'react'
import {Button,Card,Form,Container,Row,Col, Alert} from "react-bootstrap"
import {useAuth} from '../contexts/AuthContext'
import {useHistory} from 'react-router-dom'
import firebase from '../firebase'

export default function Dashboard() {
    
    const [error, setError] = useState('')
    const {currentUser, logout, updateEmail, updatePassword, updatePP, updateFname, updateLname, updateUname} = useAuth()
    const history = useHistory()
    const [userData, setUserData] = useState(null)
    const [ava, setAva] = useState()
    const [pp, setPP] = useState()
    const [loading, setLoading] = useState(false);
    const [wait, setWait] = useState(false)
    const [unameErr, setUnameErr] = useState(false)
    const emailRef = useRef();
    const fnameRef = useRef();
    const unameRef = useRef();
    const lnameRef = useRef();
    const ppRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();


    firebase.storage().ref('images').child('avatar.png').getDownloadURL()
    .then((url) => {
        // console.log(url)
        setAva(url)
    })

    function handlePP(e){
        const file = e.target.files[0]
        updatePP(file)
    }

    function handleUnameChange(e){
        const uname = e.target.value
        firebase.firestore().collection('users').where('uname', '==', uname).get()
        .then((query) => {
            query.forEach((doc) => {
                if(doc.data().uname === uname){
                    setUnameErr(true)
                    console.log("sdflk")
                }else{
                    setUnameErr(false)
                    console.log("no err")
                }
            // console.log(doc.id, " => ", doc.data().uname)
            })
        })
    }
    
    function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords Do Not Match!')
        }

        const promises = [];
        setLoading(true);
        setError('');

        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }

        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value))
        }

        if (fnameRef.current.value !== currentUser.fname) {
            promises.push(updateFname(fnameRef.current.value))
        }

        if (lnameRef.current.value !== currentUser.lname) {
            promises.push(updateLname(lnameRef.current.value))
        }

        if (unameRef.current.value !== currentUser.uname) {
            promises.push(updateUname(unameRef.current.value))
        }

        Promise.all(promises).then(() => {
            history.push('/dashboard')
        }).catch(() => {
            setError('Failed to update.')
        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {

            const snapsht = firebase.firestore().collection('users').doc(currentUser.uid)

            snapsht.get().then((doc) => {
                if(doc.exists){
                    setUserData(doc.data())
                }else{
                    console.log("doc not found")
                }
            }).catch((err) =>{
                console.log("Error getting document:", err);
            })

        }, [])
    

    async function handleLogout(){
        setError('')

        try{
            await logout()
            history.pushState('/login')
        } catch {
            setError("Failed To Logout")
        }
    }


    return (
        <>
        <Container fluid className="shadow-lg p-3 mb-5 bg-white rounded" >
          <Row>
            <Col md="8">
                <Card style={{minHeight: '50vh'}}>
                    <Card.Body>
                        <h2 className="text-center mb-4">Profile</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="uname" as={Row}>
                                <Form.Label><strong>Username</strong></Form.Label>
                                <Form.Control type="text" ref={unameRef} defaultValue={userData && userData.uname} onChange={handleUnameChange}/>
                            </Form.Group>  
                            <Form.Group id="fname" as={Row}>
                                <Form.Label><strong>First Name</strong></Form.Label>
                                <Form.Control type="text" ref={fnameRef} defaultValue={userData && userData.fname}/>
                            </Form.Group>    
                            <Form.Group id="lname" as={Row}>
                                <Form.Label><strong>Last Name</strong></Form.Label>
                                <Form.Control type="text" ref={lnameRef} defaultValue={userData && userData.lname}/>
                            </Form.Group>
                            <Form.Group id="email" as={Row}>
                                <Form.Label><strong>Email</strong></Form.Label>
                                <Form.Control type="email" ref={emailRef} defaultValue={currentUser.email}/>
                            </Form.Group>
                            <Form.Group id="password" as={Row}>
                                <Form.Label><strong>Password</strong></Form.Label>
                                <Form.Control type="password" ref={passwordRef} placeholder="Leave empty to keep the same password"/>
                            </Form.Group>
                            <Form.Group id="password-confirm" as={Row}>
                                <Form.Label><strong>Confirm Password</strong></Form.Label>
                                <Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave empty to keep the same password"/>
                            </Form.Group>
                            <Button disabled={loading} className="w-100" type="submit">Update</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            <Col md="4">
              <Card>
                  <Card.Img variant='top' src={userData && userData.pp}  />
                <Card.Body>
                    <Card.Title className="text-center mb-4">{userData && userData.uname}</Card.Title>
                    <Card.Title className="text-center mb-4">{userData && userData.fname} {userData && userData.lname}</Card.Title>
                    <Card.Title className="text-center mb-4">{currentUser.email}</Card.Title>
                </Card.Body>
                <Form.File id="pp" ref={ppRef} label="Update Profile Picture" custom onChange={handlePP}/>
              </Card>
            </Col>
          </Row>
          <div className="w-100 text-center mt-2">
            <Button variant="link" onClick={handleLogout}>Logout</Button>
        </div>
        </Container>
      </>
    )
}
