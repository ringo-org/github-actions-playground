import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HelloWorld')
export class HelloWorld extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    WrongNameConvention() {
        console.log("This method name does not follow the camelCase convention.");
    }
}

