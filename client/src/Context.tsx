import React, { createContext, useEffect, useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import { apihost } from './settings';

export const context = createContext({})
export default function Context(props: any)
{
    const [userobj, setUserObject] = useState<any>();

    useEffect(() => 
    {
        axios.get(`${apihost}/getuser`, {withCredentials: true}).then((res: AxiosResponse) => 
        {
            if (res.data)
                setUserObject(res.data)
        })
    }, [])

    return (
        <context.Provider value={userobj}>{props.children}</context.Provider>
    )
}