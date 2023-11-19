const oracledb = require('oracledb');

let connection;

const dbConfig = {
    user: 'dbuser192352',
    password: 'robot',
    connectString: 'azza.gwangju.ac.kr:1521/orcl',
    poolMax: 100,
    poolMin: 5,
    poolIncrement: 1,
    queueTimeout: 60,
};

async function Init(){
    try{
        connection = await oracledb.getConnection(dbConfig);
        console.log('<------- 오라클 데이터베이스 연결 성공 ------->');
    }
    catch(err){
        console.log(err);
        return;
    }
    
    var sql;

    sql = "select * from books";

    const result = connection.execute(sql);
    connection.close();
    
}
function ReturnedPool(conn){
    conn.release(function(err){
        if(err){
            throw err;
        }
    });
}

module.exports = {
    Init: Init
}