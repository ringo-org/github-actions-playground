import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('HelloWorld')
export class HelloWorld extends Component {

    start() {
        this.newFunction();
    }

    newFunction(){
        console.log("this is a log");
    }
}
