import { EVENTS } from 'Constants';
import classNames from 'classnames';

class GridDebugger {
    constructor() {
        this.state = {
            on: false
        };

        this.boundKeyListener = this.keyListener.bind(this);

        this.elm = window.document.createElement('div');

        this.init();
    }

    setState(on) {
        this.state = {
            on
        };

        const className = classNames(
            'grid-debugger', {
                debug: this.state.on
            }
        );

        this.elm.className = className;
    }

    keyListener(e) {
        const evtobj = window.event ? event : e;

        if (evtobj.ctrlKey && evtobj.keyCode === 71 && evtobj.shiftKey) {
            this.setState(!this.state.on);
        }
    }

    init() {
        document.addEventListener(EVENTS.KEYDOWN, this.boundKeyListener);

        this.setState(this.state.on);

        window.document.body.appendChild(this.elm);
    }
}

export default GridDebugger;
