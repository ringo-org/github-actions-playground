import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('HelloWorld')
export class HelloWorld extends Component {

    start() {
        console.log('Hello World! This is Cocos Creator');
        console.log('bonjour monde! C\'est Cocos Creator');
        console.log('こんにちは世界！これはCocos Creatorです');
        console.log('gacias mundo! Esto es Cocos Creator');

        console.log('Xin chào! Đây là Cocos Creator');

        console.log('Bạn thân ơi vui quá là vui');
        console.log('bao uoc ma minh van di tim');
        
        console.log('hu tieu mi, banh mi, com tam, pho');
    }
}

