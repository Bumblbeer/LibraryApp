import React, {useContext, useState, useEffect} from 'react'
import LibraryContext from "../../../contexts/LibraryContext";
import PopUp from "../../common/PopUp";
import s from './ManageBookForm.module.css'
import Button from "../../common/Button";
import {Input} from "../BookForm";
import moment from 'moment'
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import "react-datepicker/dist/react-datepicker.css";
import TransactionList from "../Transactions";


const ResultItem = ({text='user', setUsername=()=>{}}) => {
    return <div className={s.resultItem} onClick={()=>setUsername(text)}>
        {text}
    </div>
}

const ManageBookForm = ({id, onClose}) => {
    const lib = useContext(LibraryContext)
    const book = lib.getBook(id)
    const [status, setStatus] = useState(book?.status)
    const [username, setUsername] = useState(lib.getUser(lib.getTransaction(book?.transactionList[book?.transactionList.length-1])?.userId)?.username || '')
    const [date, setDate] = useState(new Date(2020, 1, 1))

    useEffect(()=>{
        debugger
        const dateString = lib.getTransaction(book?.transactionList[book?.transactionList.length-1])?.endDate || moment().add('month', 1).format('DD-MM-yyyy')
        const dates = dateString.split('-')
        const _date = new Date(parseInt(dates[2]), parseInt(dates[1])-1, parseInt(dates[0]))
        setDate(_date)
    }, [])

    const saveAction = () => {
        switch (status) {
            case 0: return async ()=>{
               await lib.suspendBook(id)
                onClose()
            }
            case 1: return async ()=>{
               await lib.publishBook(id)
                onClose()
            }
            case 2: return async ()=>{
                await lib.rentBook(id,  lib.searchUser(username).id, moment().format("DD-MM-YYYY"), `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`)
                onClose()
            }
            case 3: return async ()=>{
                await lib.utilizeBook(id)
                onClose()
            }

        }
    }

    const isUserFound = () => {
        return lib.users.some(u=>u.username === username)
    }

    const results = lib.searchUsers(username)?.map(
        user => <ResultItem text={user.username} setUsername={setUsername}/>
    )

    return <PopUp onClose={onClose}>
        <div className={s.wrapper}>
            <div className={s.info}>
                <div className={s.cover}><img src={book?.imageURL}/></div>
                <div className={s.texts}>
                    <div className={s.title}>{book?.title}</div>
                    <div className={s.authors}>{book?.authors.join(', ')}</div>
                </div>
            </div>
            <div className={s.transactionList}>
                <h3>Transactions history:</h3>
                {book?.transactionList.length == 0 && <p>There's no history for this book</p>}
                {book?.transactionList.map((t, id)=><Transaction id={t} isActive={id === book?.transactionList?.length - 1 && book?.status == 2}/>)}
            </div>
            <div className={s.buttons}>
                <Button filled={status === 1} title={'Available'} onClick={()=>setStatus(1)}/>
                <Button filled={status === 2} color={"#46acd4"} title={'Given to'} onClick={()=>setStatus(2)}/>
                <Button filled={status === 0} color={"#adadad"} title={'Incoming'} onClick={()=>setStatus(0)}/>
                <Button filled={status === 3} color={"#ff5e5e"}  title={'Utilized'} onClick={()=>setStatus(3)}/>
            </div>
            {status === 2 && <div className={s.options}>
                <div className={s.searchUsers}>
                <div><Input placeholder={'Search users'} value={username} onChange={e=>setUsername(e.target.value)}
                            style={isUserFound() ? {borderColor: "#7fb078"} : {}}/></div>
                <div className={s.results}>
                    {!isUserFound() && results}
                </div>
            </div>
                <div> Until:</div>
                <div className={s.picker}>
                    <DatePicker selected={date} onChange={d=>setDate(d)} dateFormat={"dd-MM-yyyy"} customInput={<ExampleCustomInput/>}/>
                </div>
            </div>
                }
            <div className={s.saveButton}><Button disabled={status === 2 && !isUserFound()} onClick={saveAction()} title={<span><i className={'fas fa-check'}/>Save</span>}/></div>
        </div>
    </PopUp>
}


const ExampleCustomInput = ({ value, onClick }) => (<Button onClick={onClick} title={value} color={'#46acd4'}/>)

const Transaction = ({id, isActive}) => {
    const lib = useContext(LibraryContext)
    return <div className={s.transaction} style={isActive ? {color: '#ffc20c'} : {}}>
        <b>User: </b> {lib.getUser(lib.getTransaction(id)?.userId)?.username || 'DELETED'} | <b>From: </b> {lib.getTransaction(id)?.startDate.split("-").join(".")} | <b>Until: </b> {lib.getTransaction(id)?.endDate.split("-").join(".")}
    </div>
}


export default ManageBookForm