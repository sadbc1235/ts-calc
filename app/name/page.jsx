'use client'

import { AgGridReact } from 'ag-grid-react';
import "../../styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useMemo, useRef, useState } from 'react';
import Loading from '../../components/loading';
import { callPostApi } from '../constants';
import styles from '../../styles/name.module.css'


export default function name({params, searchParams}) {

    /**
     * 로딩 상태
     */
    const [isLoading, setIsLoading] = useState(false);
    /**
     * 공통
     */
    const getNameList = () => {
        setIsLoading(true);
        const url = window.location.origin+'/api/getNameList';
        callPostApi(
            url
            , {
                wordSearch: searchStr.split(' ').join('|')
                , nounSearch: searchStr.replaceAll(' ', '')
                , searchLg: searchLg
            }
            , (data) => {
                setWordData(data.wordList);
                setNounData(data.nounList);
                setDomainList(data.domainList);
                setDomainData([]);
                setIsLoading(false);
            }
        );
    }

    useEffect(() => {
        getNameList();
    }, [])

    const defaultColDef = useMemo(() => { 
        return {
            cellStyle: { fontWeight: 'bold' },
        };
    }, []);

    const onEnter = (e) => {
        if(e.keyCode == 13) {
            getNameList();
        }
    }
    const [searchStr, setSearchStr] = useState('');
    const [searchLg, setSearchLg] = useState('kor');

    /**
     * 표준 단어 관련
     */
    const onSelectionChanged = (e) => {
        if(!e.api.getSelectedRows()[0]?.domainClassificationName == '-' || !e.api.getSelectedRows()[0]?.domainClassificationName == ''){
            setDomainData(domainList.filter(item => item.domainClassificationName == e.api.getSelectedRows()[0].domainClassificationName));
        }
    };

    const [wordColumnDefs] = useState([
        { 
            headerName: '제정차수'
            , width: 120
            , field: 'enactmentCnt'
            , cellStyle: { textAlign: 'center' }
            , checkboxSelection: true 
            , headerCheckboxSelection: true
        }, { 
            headerName: '공통표준단어명'
            , width: 200
            , field: 'wordNameKor'
        }, { 
            headerName: '공통표준단어영문약어명'
            , width: 200
            , field: 'wordNameEngShort'
        }, { 
            headerName: '공통표준단어 영문명'
            , width: 300
            , field: 'wordNameEng'
        }, { 
            headerName: '공통표준단어 설명'
            , flex: 1
            , minWidth: 200
            , field: 'wordExplain'
        }
        // , { 
        //     headerName: '형식단어여부'
        //     , width: 150
        //     , field: 'formalYn'
        //     , cellStyle: { textAlign: 'center' }
        // }
        , { 
            headerName: '공통표준도메인분류명'
            , width: 200
            , field: 'domainClassificationName'
        }, { 
            headerName: '이음동의어 목록'
            , width: 150
            , field: 'sameMeanWords'
        }, { 
            headerName: '금칙어'
            , width: 200
            , field: 'prohibitionWords'
        }
    ]);
    const [wordData, setWordData] = useState([]);
    const wordGridRef = useRef();

    /**
     * 도메인 관련
     */
    const [domainColumnDefs] = useState([
        { 
            headerName: '제정차수'
            , width: 120
            , field: 'enactmentCnt'
            , cellStyle: { textAlign: 'center' }
            , checkboxSelection: true 
        }, { 
            headerName: '공통표준도메인분류명'
            , width: 200
            , field: 'domainClassificationName'
        }, { 
            headerName: '데이터 타입'
            , width: 150
            , field: 'dataType'
        }, { 
            headerName: '데이터 길이'
            , width: 150
            , field: 'dataLength'
        }, { 
            headerName: '소수점 길이'
            , width: 150
            , field: 'decimalPointLength'
        }, { 
            headerName: '허용값'
            , width: 200
            , field: 'allowValue'
        }, { 
            headerName: '저장형식'
            , width: 150
            , field: 'saveFormat'
        }
    ]);
    const [domainList, setDomainList] = useState([]);
    const [domainData, setDomainData] = useState([]);
    const domainGridRef = useRef();

    /**
     * 용어 관련
     */
    const [nounColumnDefs] = useState([
        { 
            headerName: '제정차수'
            , width: 120
            , field: 'enactmentCnt'
            , cellStyle: { textAlign: 'center' }
            , checkboxSelection: true 
            , headerCheckboxSelection: true
        }, { 
            headerName: '공통표준용어명'
            , width: 200
            , field: 'nounNameKor'
        }, { 
            headerName: '공통표준용어설명'
            , flex: 1
            , minWidth: 200
            , field: 'nounExplain'
        }, { 
            headerName: '공통표준용어영문약어명'
            , width: 200
            , field: 'nounNameEngShort'
        }, { 
            headerName: '공통표준도메인명'
            , width: 200
            , field: 'domainName'
        }, { 
            headerName: '데이터 타입'
            , width: 150
            , field: 'dataType'
        }, { 
            headerName: '데이터 길이'
            , width: 150
            , field: 'dataLength'
        }, { 
            headerName: '허용값'
            , width: 150
            , field: 'allowValue'
        }, { 
            headerName: '저장 형식'
            , width: 200
            , field: 'saveFormat'
        }, { 
            headerName: '용어 이음동의어 목록'
            , width: 200
            , field: 'sameMeanNouns'
        }
    ]);
    const [nounData, setNounData] = useState([]);
    const nounGridRef = useRef();

    /**
     * 생성된 컬럼
     */
    const [createData, setCreateData] = useState([]);
    const createGridRef = useRef();

    const fnClick = () => {
        console.log(gridRef.current.api.getSelectedRows());
    }
    
    
    return (
        <section className={styles.wrapper}>
            {isLoading && <Loading/>}
            <article>
                <div className={styles.searchBox}>
                    <label>
                        <select value={searchLg} onChange={(e) => setSearchLg(e.target.value)}>
                            <option value="kor">한국어</option>
                            <option value="eng">영어</option>
                        </select>
                        <input 
                            type='text' 
                            style={{width: 300, marginLeft: 10}} 
                            onKeyUp={onEnter} 
                            placeholder='단어별 띄어쓰기 해서 검색. 예) 예산 품의' 
                            onChange={(e) => setSearchStr(e.target.value)} 
                            value={searchStr} 
                        />
                    </label>
                    <input type='button' value={'검색'} style={{marginLeft: 10}} onClick={getNameList} />
                </div>
                <div style={{ height: 'calc(50% - 50px)', width: '100%', display: 'flex', borderBottom: '2px solid #000' }}>
                    <div
                        className="ag-theme-quartz"
                        style={{ height: 'calc(100% - 50px)', flex: 2 }}
                    >
                        <h1 style={{ height: 50, lineHeight: '50px', fontWeight: 'bold', paddingLeft: 20}}>공통표준 단어</h1>
                        <AgGridReact
                            ref={wordGridRef}
                            rowData={wordData}
                            defaultColDef={defaultColDef}
                            columnDefs={wordColumnDefs}
                            rowSelection={'multiple'}
                            style={{ height: '100%', width: '100%' }}
                            onSelectionChanged={onSelectionChanged}
                        />
                    </div>
                    <div
                        className="ag-theme-quartz"
                        style={{ height: 'calc(100% - 50px)', flex: 1 }}
                    >
                        <h1 style={{ height: 50, lineHeight: '50px', fontWeight: 'bold', paddingLeft: 20}}>공통표준 도메인 분류</h1>
                        <AgGridReact
                            ref={domainGridRef}
                            rowData={domainData}
                            defaultColDef={defaultColDef}
                            columnDefs={domainColumnDefs}
                            rowSelection={'single'}
                            style={{ height: '100%', width: '100%' }}
                        />
                    </div>
                </div>
                
                <div
                    className="ag-theme-quartz"
                    style={{ height: 'calc(50% - 50px)', width: '100%' }}
                >
                    <h1 style={{ height: 50, lineHeight: '50px', fontWeight: 'bold', paddingLeft: 20}}>공통표준 용어</h1>
                    <AgGridReact
                        ref={nounGridRef}
                        rowData={nounData}
                        defaultColDef={defaultColDef}
                        columnDefs={nounColumnDefs}
                        rowSelection={'multiple'}
                        style={{ height: '100%', width: '100%' }}
                    />
                </div>
            </article>
            {/* <article>
                <div
                    className="ag-theme-quartz"
                    style={{ width: '100%', height: 'calc(50% - 50px)' }}
                >
                    <h1 style={{ height: 50, lineHeight: '50px', fontWeight: 'bold', paddingLeft: 20}}>생성된 컬럼</h1>
                    <AgGridReact
                        ref={createGridRef}
                        rowData={createData}
                        defaultColDef={defaultColDef}
                        columnDefs={nounColumnDefs}
                        rowSelection={'multiple'}
                        style={{ height: '100%', width: '100%' }}
                    />
                </div>
                <div
                    style={{ width: '100%', height: '50%', marginTop: 50 }}
                >
                    <textarea style={{ width: '100%', height: '100%', resize: 'none', border: 'none' }}></textarea>
                </div>
            </article> */}
        </section>  
    );
}