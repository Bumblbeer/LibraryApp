import React, {useState} from 'react'
import s from './Form.module.css'
import Button from "../common/Button";
import {Input} from "./BookForm";


const UserForm = ({onSubmit=()=>{}, initialState}) => {
  const [data, setData] = useState(initialState || {name: '', transactionList: []})

  const [isWaiting, setWaiting] = useState(false)

  const disabled = () => data.name === ''

  const setField = (fieldName, value) => {
    setData(prevState => ({...prevState, [fieldName]: value}))
  }
  const submit = async () => {
    setWaiting(true)
    await onSubmit(data)
    setWaiting(false)
  }

  return <div className={s.wrapper}>
    <div className={s.formTitle}>{initialState ? "Edit user: "+initialState.title : "Add a new user"}</div>
    <Input onChange={(e)=>setField('name', e.target.value)} value={data.name} placeholder={'Username'} autoFocus={true}/>
    <div className={s.buttonArea}><Button title={isWaiting ? 'Wait' :'Save'} onClick={submit} disabled={disabled() || isWaiting}/></div>
  </div>
}

export default UserForm
