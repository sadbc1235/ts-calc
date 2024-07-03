'use client'

import { AgGridReact } from 'ag-grid-react';
import "../../../styles/ag-grid.css";
import "../../../styles/ag-theme-quartz.css";
import styles from '../../../styles/tables.module.css'
import Loading from '../../../components/loading';
import { useEffect, useMemo, useRef, useState } from 'react';
import { callPostApi } from '../../constants';
import Notice from '../../../components/notice';


export default function check({params, searchParams}) {
    const [noticeMap, setNoticeMap] = useState({isActvie: false, type: '', msg: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [searchStr, setSearchStr] = useState('');

    const fnCallNotice = (type, msg) => {
        setNoticeMap({isActvie: true, type: type, msg: msg});
        setTimeout(() => { setNoticeMap({isActvie: false, type: '', msg: msg}); }, 2000);
    }

    const defaultColDef = useMemo(() => { 
        return {
            cellStyle: { fontWeight: 'bold' },
        };
    }, []);
    
    // 테이블 그리드 설정
    const [tableColumnDefs] = useState([
        { 
            headerName: '테이블 명'
            , width: 250
            , field: 'tableName'
        }, { 
            headerName: '테이블 설명'
            , width: 150
            , field: 'tableComment'
        }, { 
            headerName: '컬럼 명'
            , width: 250
            , field: 'columnName'
        }, { 
            headerName: '컬럼 타입'
            , width: 150
            , field: 'columnType'
        }, { 
            headerName: '컬럼 설명'
            , flex: 1
            , minWidth: 1000
            , field: 'columnComment'
        }
    ]);
    const [tableData, setTableData] = useState([]);
    const tableGridRef = useRef();

    const onCellDoubleClicked = (e) => {
        console.log(e)
        const checkIdx = modifyData.filter(item => item.tableName == e.data.tableName && item.columnName == e.data.columnName).length;
        if(!!checkIdx) {
            fnCallNotice('warning','해당컬럼은 이미 선택되었습니다.');
            return;
        } else {
            const data = [...modifyData, e.data];
            setModifyData(data);
        }
    };

    // 거수자 그리드 설정
    const [modifyColumnDefs] = useState([
        { 
            headerName: '테이블 명'
            , width: 250
            , field: 'tableName'
            , checkboxSelection: true 
            , headerCheckboxSelection: true
        }, { 
            headerName: '테이블 설명'
            , width: 150
            , field: 'tableComment'
        }, { 
            headerName: '컬럼 명'
            , width: 250
            , field: 'columnName'
        }, { 
            headerName: '컬럼 타입'
            , width: 150
            , field: 'columnType'
            , editable: true
        }, { 
            headerName: '컬럼 설명'
            , flex: 1
            , minWidth: 1000
            , field: 'columnComment'
            , editable: true
        }
    ]);
    const [modifyData, setModifyData] = useState([]);
    const modifyGridRef = useRef();

    const removeModifyRows = () => {
        const removeRows = modifyGridRef.current.api.getSelectedRows();
        if(!removeRows.length) {
            fnCallNotice('warning','삭제할 데이터를 선택하세요.');
            return;
        }
        let result = [...modifyData];

        removeRows.forEach(item => {
            result = result.filter(item2 => item2.tableName != item.tableName || item2.columnName != item.columnName);
        });

        setModifyData(result);
    }

    // 스키마 정보조회
    const getSchemaInfo = () => {
        setIsLoading(true);
        callPostApi(
            window.location.origin+'/api/getSchemaInfo'
            , { searchStr: searchStr }
            , (data) => {
                setTableData(data.colList);
                setModifyData([]);
                setIsLoading(false);
            }
        );
    }

    // 수정한 컬럼정보 반영
    const modifyColumnInfo = () => {
        modifyGridRef.current.api.clearFocusedCell();
        setIsLoading(true);
        callPostApi(
            window.location.origin+'/api/modifyColumnInfo'
            , { modifyList: modifyData }
            , (data) => {
                getSchemaInfo();
            }
        );
    }

    useEffect(() => {
        getSchemaInfo();
    }, []);

    const onEnter = (e) => {
        if(e.keyCode == 13) {
            getSchemaInfo();
        }
    }

    return (
        <section className={styles.wrapper}>
        <Notice isActvie={noticeMap.isActvie} type={noticeMap.type} msg={noticeMap.msg} />
        {isLoading && <Loading/>}
            <article>
                <h1>
                    컬럼정보
                    <input 
                        type='text' 
                        style={{width: 350, marginLeft: 10}} 
                        onKeyUp={onEnter} 
                        placeholder='컬럼명 이나 컬럼설명 입력(한글, ENG 모두 가능)' 
                        onChange={(e) => setSearchStr(e.target.value)} 
                        value={searchStr} 
                    />
                    <div></div>
                </h1>
                <div className="ag-theme-quartz">
                    <AgGridReact
                        ref={tableGridRef}
                        rowData={tableData}
                        defaultColDef={defaultColDef}
                        columnDefs={tableColumnDefs}
                        rowSelection={'single'}
                        style={{ height: '100%', width: '100%' }}
                        onCellDoubleClicked={onCellDoubleClicked}
                    />
                </div>
            </article>

            <article>
                <h1>
                    거수자 목록
                    <div>
                        <input type='button' value="저장" onClick={modifyColumnInfo} />&nbsp;
                        <input type='button' value="삭제" onClick={removeModifyRows} />
                    </div>
                </h1>
                <div className="ag-theme-quartz">
                    <AgGridReact
                        ref={modifyGridRef}
                        rowData={modifyData}
                        defaultColDef={defaultColDef}
                        columnDefs={modifyColumnDefs}
                        rowSelection={'multiple'}
                        style={{ height: '100%', width: '100%' }}
                    />
                </div>
            </article>
        </section>
    );
}