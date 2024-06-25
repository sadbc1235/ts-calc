'use client'

import { AgGridReact } from 'ag-grid-react';
import "../../../styles/ag-grid.css";
import "../../../styles/ag-theme-quartz.css";
import styles from '../../../styles/tables.module.css'
import Loading from '../../../components/loading';
import { useEffect, useMemo, useRef, useState } from 'react';
import { callPostApi } from '../../constants';
import Notice from '../../../components/notice';


export default function tables({params, searchParams}) {
    const [noticeMap, setNoticeMap] = useState({isActvie: false, type: '', msg: ''});
    const [isLoading, setIsLoading] = useState(false);

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
            , flex: 1
            , minWidth: 200
            , field: 'tableName'
            // , checkboxSelection: true 
            // , headerCheckboxSelection: true
            }, { 
            headerName: '테이블 설명'
            , flex: 1
            , minWidth: 200
            , field: 'tableComment'
        }
    ]);
    const [tableData, setTableData] = useState([]);
    const tableGridRef = useRef();

    const onSelectionChanged = (e) => {
        setColData(colList.filter(item => item.tableName == e.api.getSelectedRows()[0].tableName));
    };

    // 컬럼 그리드 설정
    const [colColumnDefs] = useState([
        { 
            headerName: '컬럼 명'
            , flex: 1
            , minWidth: 200
            , field: 'columnName'
            , checkboxSelection: true 
            , headerCheckboxSelection: true
        }, { 
            headerName: '컬럼 설명'
            , flex: 1
            , minWidth: 200
            , field: 'columnComment'
        }
    ]);
    const [colData, setColData] = useState([]);
    const [colList, setColList] = useState([]);
    const colGridRef = useRef();

    // 스키마 정보조회
    const getSchemaInfo = () => {
        setIsLoading(true);
        callPostApi(
            window.location.origin+'/api/getSchemaInfo'
            , {}
            , (data) => {
                setTableData(data.tableList);
                setColList(data.colList);
                setColData([]);
                setIsLoading(false);
            }
        );
    }
    useEffect(() => {
        getSchemaInfo();
    }, []);

    // 스크립트 생성
    const [script, setScript] = useState('');
    const fnMakeScript = (type) => {
        const tableRows = tableGridRef.current.api.getSelectedRows();
        const colRows = colGridRef.current.api.getSelectedRows();
        if(!tableRows.length) {
            fnCallNotice('warning', '테이블 을 선택하세요.');
            return;
        }
        if(!colRows.length) {
            fnCallNotice('warning', '컬럼 을 선택하세요.');
            return;
        }

        if(type == 'SELECT') {
            fnMakeSelect(tableRows, colRows);
        } else if(type == 'INSERT') {
            fnMakeInsert(tableRows, colRows);
        } else if(type == 'UPDATE') {
            fnMakeUpdate(tableRows, colRows);
        }
        
    }
    // SELECT 스크립트 생성
    const fnMakeSelect = (tableRows, colRows) => {
        let script = '';
        script += 'SELECT\n';
        colRows.forEach((item, idx) => {
            let alias = '';
            const aliasArr = item.columnName.toLowerCase().split('_');
            aliasArr.forEach((item, idx) => {
               alias += (idx == 0 ? item : item.charAt(0).toUpperCase() + item.slice(1)); 
            });

            script += (idx == 0 ? '   ' : '   , ')+ item.columnName + '    AS ' + alias +'\n';
        });
        script += 'FROM   ' + tableRows[0].tableName;

        setScript(script);
    }
    // INSERT 스크립트 생성
    const fnMakeInsert = (tableRows, colRows) => {
        let script = '';
        script += 'INSERT INTO ' + tableRows[0].tableName + ' (\n';
        colRows.forEach((item, idx) => {
            script += (idx == 0 ? '   ' : '   , ')+ item.columnName +'\n';
        });
        script += ') VALUES (\n';
        colRows.forEach((item, idx) => {
            let alias = '';
            const aliasArr = item.columnName.toLowerCase().split('_');
            aliasArr.forEach((item, idx) => {
               alias += (idx == 0 ? item : item.charAt(0).toUpperCase() + item.slice(1)); 
            });

            script += (idx == 0 ? '   #{' : '   , #{')+ alias +'}\n';
        });
        script += ')';

        setScript(script);
    }
    // UPDATE 스크립트 생성
    const fnMakeUpdate = (tableRows, colRows) => {
        let script = '';
        script += 'UPDATE ' + tableRows[0].tableName + '\nSET\n';
        colRows.forEach((item, idx) => {
            let alias = '';
            const aliasArr = item.columnName.toLowerCase().split('_');
            aliasArr.forEach((item, idx) => {
               alias += (idx == 0 ? item : item.charAt(0).toUpperCase() + item.slice(1)); 
            });

            script += (idx == 0 ? '   ' : '   , ')+ item.columnName + '    = #{' + alias +'}\n';
        });
        script += 'WHERE';

        setScript(script);
    }

    return (
        <section className={styles.wrapper}>
        <Notice isActvie={noticeMap.isActvie} type={noticeMap.type} msg={noticeMap.msg} />
        {isLoading && <Loading/>}
            <article>
                <h1>테이블</h1>
                <div className="ag-theme-quartz">
                    <AgGridReact
                        ref={tableGridRef}
                        rowData={tableData}
                        defaultColDef={defaultColDef}
                        columnDefs={tableColumnDefs}
                        rowSelection={'single'}
                        style={{ height: '100%', width: '100%' }}
                        onSelectionChanged={onSelectionChanged}
                    />
                </div>
            </article>

            <article>
                <h1>컬럼</h1>
                <div className="ag-theme-quartz">
                    <AgGridReact
                        ref={colGridRef}
                        rowData={colData}
                        defaultColDef={defaultColDef}
                        columnDefs={colColumnDefs}
                        rowSelection={'multiple'}
                        style={{ height: '100%', width: '100%' }}
                    />
                </div>
            </article>

            <article>
                <h1>
                    스크립트
                    <div>
                        <input type='button' value="SELECT" onClick={() => { fnMakeScript('SELECT') }} />
                        <input type='button' value="INSERT" onClick={() => { fnMakeScript('INSERT') }} />
                        <input type='button' value="UPDATE" onClick={() => { fnMakeScript('UPDATE') }} />
                    </div>
                </h1>
                <div>
                    <textarea value={script} onChange={(e) => setScript(e.target.value)}>
                    </textarea>
                </div>
            </article>
        </section>
    );
}