'use client'

import styles from "../../styles/add.module.css"
import { useEffect, useRef, useState } from "react";
import { callAttachApi, callPostApi, fnGetCurrencyCode, fnGetDateNow } from "../constants";

export default function Add() {
    const [userList, setUserList] = useState([]);

    const [empSeq, setEmpSeq] = useState('');
    const [date, setDate] = useState(fnGetDateNow('-'));
    const [file, setFile] = useState({name: ''});
    const [imgName, setImgName] = useState('');
    const [amtList, setAmtList] = useState([{key: 1, amt: '100000'}]);
    const [ocrFail, setOcrFail] = useState(false);
    const [amtText, setAmtText] = useState('');

    const getUserList = () => {
        const url = window.location.origin+'/api/getUserList';
        callPostApi( url, {}, setUserList );
    }

    useEffect(() => {
        getUserList();
    }, []);

    const fileRef = useRef(null);
    const handleClick = () => {
        fileRef?.current?.click();
    };

    const handleChange = (e) => {
        if(!empSeq) {
            alert("사용자를 선택하세요.");
            return;
        } else {
            setFile(e.target.files[0]);
        }
    }

    const uploadAttach = () => {
        const url = window.location.origin+'/api/uploadAttach';
        let formdata = new FormData();
        formdata.append("empSeq", empSeq);
        formdata.append("files", file);
        callAttachApi(url, formdata, (data) => {
            console.log(data);
            if(data.state == 'success') {
                setImgName(data.imgUrl);
                getOcrText(data.imgUrl);
            } else {
                alert('오류가 발생하였습니다.');
                return;
            }
        });
    }

    const getOcrText = (imgName) => {
        const url = window.location.origin+'/api/getOcrText';
        const imgUrl = `http://115.86.255.100:3000${imgName}`;
        callPostApi( url, {url: imgUrl}, (data) => {
            if(!!data?.code) {
                alert('텍스트 추출 실패');
                setOcrFail(true)
                return;
            } else {
                setOcrFail(false);
                console.log(data)
            }
        });
    }

    const delAttach = () => {
        const url = window.location.origin+'/api/delAttach';
        callPostApi( url, {imgName: imgName}, (data) => {
            setImgName('');
            setFile({name: ''});
            setOcrFail(false);
            fileRef.current.value = '';
        });
    }

    useEffect(() => {
        file?.name != '' && uploadAttach();
    }, [file]);

    return (
        <section className={styles.container}>
            <article>
                <div>Name</div>
                <select defaultValue={empSeq} onChange={(e) => setEmpSeq(e.target.value)}>
                    <option value=''>선택</option>
                    {userList.map(user => (
                        <option key={user.empSeq} value={user.empSeq}> {user.empName} </option>
                    ))}
                </select>
            </article>
            <article>
                <div>Date</div>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
            </article>
            <article>
                <div>Bill</div>
            </article>
            <article>
                <input ref={fileRef} accept="image/*" type="file" onChange={handleChange} />
                {imgName != '' && <div className={styles.btnDel} onClick={delAttach}> ❌ </div>}
                {imgName == '' && 
                    <div onClick={handleClick}>
                        <svg viewBox="0 0 448 512">
                            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                        </svg>
                    </div>
                }
                {imgName != '' && <img src={`http://115.86.255.100:3000${imgName}`} />}
            </article>
            <article>
                <div>Amt</div>
                {!ocrFail ?
                <select>
                    {amtList.length != 0 ? amtList.map(amt => (
                        <option key={amt.key} value={amt.amt}> {amt.amt} </option>
                    )) : 
                        <option value=''> 영수증을 첨부해주세요. </option>
                    }
                </select> 
                :
                <input type="text" placeholder="금액을 입력하세요." value={amtText} onChange={(e) => setAmtText( fnGetCurrencyCode(e.target.value.replace(/[^\d.-]/g, '') || '' ))} />
                }
            </article>
            <article>
                <input type="button" value="Save" />
            </article>
        </section>
    );
}