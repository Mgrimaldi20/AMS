import React, { useState } from 'react'
import styles from './Login.module.css'
import { GithubLoginButton, GoogleLoginButton, TwitterLoginButton } from "react-social-login-buttons";
import { apihost } from '../../settings';
import { Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

export default function Login()
{
    const logingoogle = () =>
    {
        window.open(`${apihost}/auth/google`, "_self")
    }

    const logingithub = () =>
    {
        window.open(`${apihost}/auth/github`, "_self")
    }

    const logintwitter = () =>
    {
        window.open(`${apihost}/auth/twitter`, "_self")
    }

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const loginlocal = () =>
    {
        axios.post(`${apihost}/login`, {
            email: email,
            password: password
        },
        {
            withCredentials: true
        }).then(res =>
            {
                console.log(res.data)
            })
    }

    return (
        <div className={`${styles.loginpage} mt-2`}>
            <h1>Login</h1>
            <div className={`${styles.loginform} mt-2`}>
                <div className="mb-2">
                    <GoogleLoginButton align="center" onClick={() => { logingoogle() }} />
                </div>
                <div className="mb-2">
                    <GithubLoginButton align="center" onClick={() => { logingithub() }} />
                </div>
                <div className="mb-5">
                    <TwitterLoginButton align="center" onClick={() => { logintwitter() }} />
                </div>

                <div className={styles.strike}>
                    <span>or</span>
                </div>

                <div className="mt-5">
                    <Form>
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                        </Form.Group>

                        <div className="col text-center">
                        <Button variant="primary" className="mb-2" onClick={loginlocal}>Continue</Button>
                        </div>
                    </Form>
                </div>
                <div className="text-center">
                    <p>Don't have an account? <Link to="/register" style={{textDecoration: "none"}}>Sign up</Link></p>
                </div>
            </div>
        </div>
    )
}