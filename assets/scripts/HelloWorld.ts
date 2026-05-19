import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;
const Message = "Hello World"; // const should be in uppercase
@ccclass('HelloWorld')
export class helloWorld extends Component { // class name should be in PascalCase

    exampleFunction() {
        var unusedVariable = Message; // unused variable should be removed
    }
}

