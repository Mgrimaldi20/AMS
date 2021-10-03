import React, { useContext } from 'react'
import { context } from '../../Context'
import { IUser } from '../../interfaces/iuser'
import styles from './Home.module.css'

export default function Home()
{
    const userobj = useContext(context) as IUser

    return (
        <div className={styles.homepage}>
            { 
                userobj ? 
                (
                    <>
                        <h1>Hello {userobj.username}</h1>
                        <h2>Welcome Back</h2>
                    </>
                ) : <h1>Please Log In to Continue</h1> 
            }
        </div>
    )
}