import { _decorator, Component } from 'cc';
import languageDetect from 'languagedetect';
const { ccclass } = _decorator;

@ccclass('HelloWorld')
export class HelloWorld extends Component {

    start() {
        var text = 'Xin chào thế giới';
         text = 'Hello World';
         text = 'day la tieng viet khong dau';
    }
}

