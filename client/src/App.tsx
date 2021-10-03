import React, { useContext } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { context } from './Context';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import NavbarItem from './Components/NavbarItem/NavbarItem';
import Admin from './Components/Admin/Admin';
import Profile from './Components/Profile/Profile';
import Register from './Components/Register/Register';
import { IUser } from './interfaces/iuser';

function App() 
{   
    const userobj = useContext(context) as IUser

    return (
        <BrowserRouter>
            <NavbarItem />
            <Switch>
                <Route path="/" exact component={Home} />
                {
                    userobj ?
                    (
                        <>
                            { userobj.isadmin ? (<Route path="/admin" exact component={Admin} />) : null }
                            <Route path="/profile" exact component={Profile} />
                        </>
                    ) : 
                    (
                        <>
                            <Route path="/login" exact component={Login} />
                            <Route path="/register" exact component={Register} />
                        </>
                    )
                }
            </Switch>
        </BrowserRouter>
    )
}

export default App
