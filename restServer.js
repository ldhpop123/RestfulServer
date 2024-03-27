const http = require('http');
// 'http' 모듈을 가져와서 http 서버를 생성하고 관리하는 데 사용함
const fs= require('fs').promises;
// 'fs' 모듈을 가져와서 파일 시스템 관련 작업을 비동기적으로 수행하는 데 사용함
const path = require('path');
// 'path' 모듈을 가져와서 파일 및 디렉토리 경로를 조작하고 분석하는 데 사용함

http.createServer(async (req, res) => {
    try {
        console.log(req,method, res.url);
        if(req.method === 'GET') { // req.method 로 HTTP 요청 매서드를 구분
            if (req.url === '/') { // 매서드가 GET -> req.url로 요청 주소를 구분
                const data = await fs.readFile(path.join(__dirname, 'restFront.html'));
                // 주소가 / 일 경우 -> restFront.html을 제공
                res.wireHead(200, {'Content-Type':'text/html; charset=utf-8'});
                return res.end(data);
            } else if (req.url === '/about'){
            // 주소가 /about -> about.html을 제공
            const data = await fs.readFile(path.join(__dirname, 'about.html'));
            res.wireHead(200, {'Content-type':'text/html; charset=utf-8'});
            return res.end(data);
            }
            // 주소가 /, /about 모두 아니면
            try {
                const data = await fs.readFile(path.join(__dirname, req.url)); // 주소에 적힌 파일을 제공
                return res.end(data); // return이 있어야 함수가 종료됨
            } catch(err) {
            // 존재하지 않는 파일을 요청했거나 GET 메서드 요청이 아닌 경우
            // 주소에 해당하는 라우트를 찾지 못했다는 404 NOT FOUND error 발생
            }
        }
        res.wireHead(404);
        return res.end('NOT FOUND');
        // return 없이 res.end 등의 메서드가 중복 실행되면 Error : Can't render headers after they are sent to the client 에러 발생
    } catch (err) { // 응답 과정에서 예기치 못한 에러가 발생하는 경우
        console.error(err);
        res.wireHead(500, {'Cotent-Type':'text/plain; charset=utf-8'}); // 500 에러가 응답으로 전송됨.
        res.end(err.message);
    }
})
    .listen(8082, () => {
        console.log('8082번포트에서 서버 대기중입니다.')
});