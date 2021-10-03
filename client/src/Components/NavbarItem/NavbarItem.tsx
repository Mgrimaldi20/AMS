import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import brandimg from '../../assets/brandimg.png'

import { Navbar, Nav, Container, Button, Modal } from 'react-bootstrap'
import axios, { AxiosResponse } from 'axios';
import { context } from '../../Context';
import { IUser } from '../../interfaces/iuser';
import { apihost } from '../../settings';

export default function NavbarItem()
{
    const [show, setShow] = useState(false)
    const handlehide = () => setShow(false)
    const handleshow = () => setShow(true)

    const logout = () =>
    {
        axios.get(`${apihost}/logout`, {withCredentials: true}).then((res: AxiosResponse) =>
        {
            if (res.data === "Success")
                window.location.href = "/"
        })
    }

    const userobj = useContext(context) as IUser

    return (
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
            <Container>
            <Navbar.Brand href="/"> <img alt="Brand logo" src={brandimg} width="30" height="30" className="d-inline-block align-top" />{' '} AMS </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                </Nav>
                {
                    userobj ?
                    (
                        <>
                            <Nav className="me-auto">
                                <Nav.Link href="/profile">Profile</Nav.Link>
                            </Nav>

                            {
                                userobj.isadmin ? 
                                (
                                    <Nav className="me-auto">
                                        <Nav.Link href="/admin">Admin</Nav.Link>
                                    </Nav>
                                ) : null
                            }

                            <Nav className="me-2">
                                <Navbar.Text>Signed in as: <b>{userobj.username}</b></Navbar.Text>
                            </Nav>
                            <Nav>
                                <Button onClick={handleshow}>Log out</Button>
                            </Nav>
                            <Modal show={show} onHide={handlehide}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Confirm Log Out</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>Are you sure you want to log out</Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handlehide}>Close</Button>
                                    <Button variant="primary" onClick={logout}>Log Out</Button>
                                </Modal.Footer>
                            </Modal>
                        </>
                    ) :
                        <Nav>
                            <Button href="/login">Log in</Button>
                        </Nav>
                }
            </Navbar.Collapse>
            </Container>
        </Navbar>  
    )
}