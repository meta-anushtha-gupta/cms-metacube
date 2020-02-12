// All polyfills follow the pattern of <Object>.<method>
// E.g: window.fetch, Array.from
import CustomEvent from './CustomEvent';
import Find from './Array.prototype.find';
import FindIndex from './Array.prototype.findIndex';
import Unique from './Array.prototype.unique';
import Flatten from './Array.prototype.flatten';
import Matches from './Element.prototype.matches';
import Promise from './Promise';
import Proxy from './Proxy';
import Remove from './Element.prototype.remove';
import WheelEvent from './WheelEvent';
import './fetch';

export default () => {
    CustomEvent();
    Find();
    FindIndex();
    Unique();
    Flatten();
    Matches();
    Promise();
    Proxy();
    Remove();
    WheelEvent();
};
