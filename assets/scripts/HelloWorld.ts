import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('HelloWorld')
export class HelloWorld extends Component {

    start() {
        this.newFunction();
    }

    newFunction(){
        console.log("Hello World!");
        var wrongnameformat = "This is a wrong name format";
        wrongnameformat = "modify wrong name format";
    }
}
