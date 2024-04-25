'use client'

import styles from "../styles/add.module.css"
import { useEffect, useRef, useState } from "react";
import { callAttachApi, callPostApi, fnGetCurrencyCode, fnGetDateNow } from "../app/constants";
import Notice from "./notice";
import Loading from "./loading";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Add({initMap}) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [noticeMap, setNoticeMap] = useState({isActvie: false, type: '', msg: ''});
    const [userList, setUserList] = useState([]);
    const [amtList, setAmtList] = useState([]);
    const [ocrFail, setOcrFail] = useState(false);
    const [file, setFile] = useState({name: ''});

    const [empSeq, setEmpSeq] = useState('');
    const [date, setDate] = useState(fnGetDateNow('-'));
    const [imgName, setImgName] = useState({empSeq: '', imgName: ''});
    const [amtText, setAmtText] = useState('');

    const saveRes = () => {
        if(!empSeq) {
            fnCallNotice('warning', '사용자를 선택하세요.');
            return;
        }
        if(!imgName.imgName) {
            fnCallNotice('warning', '영수증을 첨부하세요.');
            return;
        }
        if(!amtText) {
            fnCallNotice('warning', '금액을 입력하세요.');
            return;
        }
        setIsLoading(true);
        const url = window.location.origin+'/api/saveRes';
        callPostApi( url
            , {
                empSeq: empSeq
                , spendDate: date.replaceAll('-', '')
                , amt: amtText.replaceAll(',', '')
                , imgName: imgName.imgName
            }, () => {
                setIsLoading(false);
                router.push(`/report/${empSeq}?date=${date.substring(0, 7)}`)
            }
        );
    }

    const fnCallNotice = (type, msg) => {
        setNoticeMap({isActvie: true, type: type, msg: msg});
        setTimeout(() => { setNoticeMap({isActvie: false, type: '', msg: msg}); }, 2000);
    }

    const getUserList = () => {
        const url = window.location.origin+'/api/getUserList';
        callPostApi( url, {}, (data) => {
            setUserList(data);
            setIsLoading(false);

            if(!!initMap?.empSeq) {
                setEmpSeq(initMap.empSeq);
                setDate(initMap.spendDate);
                setImgName({empSeq: initMap.empSeq, imgName: initMap.imgName});
                setOcrFail(true);
                setAmtText( fnGetCurrencyCode(initMap.amt) );
            }
        });
    }

    useEffect(() => {
        getUserList();
    }, []);

    const fileRef = useRef(null);
    const handleClick = () => {
        if(!empSeq) {
            fnCallNotice('warning', '사용자를 선택하세요.');
        } else {
            fileRef?.current?.click();
        }
    };

    const handleChange = (e) => {
        setIsLoading(true);
        setFile(e.target.files[0]);
    }

    function fnImgCompression(img){
        const maxSize = 500;

        let width = img.width;
        let height = img.height;
        if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
        }

        //canvas에 이미지 객체를 리사이징해서 담는 과정
        let canvas = document.createElement("canvas");
        canvas.width = width; //리사이징하여 그릴 가로 길이
        canvas.height = height; //리사이징하여 그릴 세로 길이
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      
        //canvas의 dataurl를 blob(file)화 하는 과정
        let dataURI = canvas.toDataURL("image/jpeg"); //png => jpg 등으로 변환 가능
        var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
            atob(dataURI.split(',')[1]) :
            unescape(dataURI.split(',')[1]);
        var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var max = bytes.length;
        var ia = new Uint8Array(max);
        for (var i = 0; i < max; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        const url = window.location.origin+'/api/uploadAttach';
        let formdata = new FormData();
        formdata.append("empSeq", empSeq);
        formdata.append("files", new Blob([ia], { type: 'image/jpeg'}));
        callAttachApi(url, formdata, (data) => {
            // console.log(data);
            if(data.state == 'success') {
                setImgName(data);
                getOcrText(data.imgUrl);
            } else {
                alert('오류가 발생하였습니다.');
                return;
            }
        });
      }

    const uploadAttach = () => {
        const reader = new FileReader();
        reader.onload = () => {
            let img = new Image();
            img.src = reader.result;
            img.onload = () => {
                fnImgCompression(img);    
            }
        }

        reader.readAsDataURL(file);
    }

    const getOcrText = (imgName) => {
        const url = window.location.origin+'/api/getOcrText';
        const imgUrl = imgName;
        callPostApi( url, {url: imgUrl}, (data) => {
            if(!!data?.code) {
                fnCallNotice('warning', '텍스트 추출을 실패하였습니다.');
                setOcrFail(true)
                return;
            } else {
                setOcrFail(false);

                const krReg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
                const enReg = /[a-z|A-Z]/;
                let amtList = [];
                data.images[0].fields
                .filter(item => item.inferText.includes(',') && !krReg.test(item.inferText) && !enReg.test(item.inferText))
                .forEach((el, idx) => {
                    !amtList.filter(item => item.amt == el.inferText).length && amtList.push({key: idx, amt: el.inferText});
                });
                amtList.sort((a, b) => (+(b.amt.replace(',', ''))) - (+(a.amt.replace(',', ''))));

                setAmtList(amtList);
                if(!amtList.length){
                    setOcrFail(true);
                    fnCallNotice('warning', '인식된 금액이 없습니다.');
                } else {
                    setAmtText(amtList[0].amt);
                }
            }
            setIsLoading(false);
        });
    }

    const delAttach = () => {
        setIsLoading(true);
        const url = window.location.origin+'/api/delAttach';
        callPostApi( url, {imgName: imgName}, (data) => {
            setImgName({empSeq: '', imgName: ''});
            setFile({name: ''});
            setOcrFail(false);
            setAmtList([]);
            fileRef.current.value = '';
            setIsLoading(false);
        });
    }

    useEffect(() => {
        file?.name != '' && uploadAttach();
    }, [file]);

    return (
        <>
        <Notice isActvie={noticeMap.isActvie} type={noticeMap.type} msg={noticeMap.msg} />
        {isLoading && <Loading/>}
        <section className={styles.container}>
            <article>
                <div>Name</div>
                <select value={empSeq} onChange={(e) => setEmpSeq(e.target.value)} disabled={!!initMap?.empSeq}>
                    <option value=''>선택</option>
                    {userList.map(user => (
                        <option key={user.empSeq} value={user.empSeq}> {user.empName} </option>
                    ))}
                </select>
            </article>
            <article>
                <div>Date</div>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}  disabled={!!initMap?.empSeq}/>
            </article>
            <article>
                <div>Bill</div>
            </article>
            <article>
                <input ref={fileRef} accept="image/*" type="file" onChange={handleChange} />
                {imgName.imgName != '' && !initMap?.empSeq && <div className={styles.btnDel} onClick={delAttach}> ❌ </div>}
                {imgName.imgName == '' && 
                    <div onClick={handleClick}>
                        <svg viewBox="0 0 448 512">
                            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                        </svg>
                    </div>
                }
                {imgName.imgName != '' && <iframe src={`${window.location.origin}/api/getImg?empSeq=${imgName.empSeq}&imgName=${imgName.imgName}`}></iframe>}
            </article>
            <article>
                <div>Amt</div>
                {!ocrFail ?
                <select defaultValue={amtText} onChange={(e) => setAmtText(e.target.value)}>
                    {amtList.length != 0 ? amtList.map(amt => (
                        <option key={amt.key} value={amt.amt}> {amt.amt} </option>
                    )) : 
                        <option value=''> 영수증을 첨부해주세요. </option>
                    }
                </select> 
                :
                <input type="text" placeholder="금액을 입력하세요." value={amtText} onChange={(e) => setAmtText( fnGetCurrencyCode(e.target.value.replace(/[^\d.-]/g, '') || '' ))}  disabled={!!initMap?.empSeq} />
                }
            </article>
            <article>
                { !initMap?.empSeq ?
                    <input type="button" value="Save" onClick={saveRes} disabled={isLoading} />
                    :
                    <Link href={`/report/${initMap.empSeq}?date=${initMap.spendDate.substring(0, 7)}`}>Back</Link>
                }
                
            </article>
        </section>
        </>
    );
}