import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('HelloWorld')
export class HelloWorld extends Component {

    start() {
        this.newFunction();
    }

    newFunction(){
        console.log("Hello World!");
        var WRONGNAMEFORMAT = "This is a wrong name format";
        WRONGNAMEFORMAT = "modify wrong name format";
    }
}
