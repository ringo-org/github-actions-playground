import { _decorator, Component } from 'cc';
import languageDetect from 'languagedetect';
const { ccclass } = _decorator;

@ccclass('HelloWorld')
export class HelloWorld extends Component {

    start() {
        console.log('Đây là một câu tiếng Việt hoàn chỉnh để kiểm tra hệ thống');
        console.log('xin chao');
        console.log('tieng viet khong dau');
        console.log('Xin Chào');
        console.log('Anh Tai da noi vay thi ok di');


    }

}

