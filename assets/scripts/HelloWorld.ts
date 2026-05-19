import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;
@ccclass('HelloWorld')
export class HelloWorld extends Component {

    ExampleFunction() { //funciton name should be in camelCase
        var Message = "Hello World"; //var should be in camelCase
        console.log(Message); // console log should be remove
        
    }
}

