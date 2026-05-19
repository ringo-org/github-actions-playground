import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;
const Message = "Hello World"; // const should be in uppercase
@ccclass('HelloWorld')
export class helloWorld extends Component { // class name should be in PascalCase

    exampleFunction() { //funciton name should be in camelCase
        var unusedVariable = Message; // unused variable should be removed
    }
    
}

