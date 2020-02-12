export default () => {
    if (typeof window.WheelEvent === 'function') {
        return;
    }

    function WheelEvent() {
        const evType = 'wheel';
        const refProperty = '__pf_wheel_cb';
        const support = document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll'; // Webkit and IE support at least 'mousewheel';
        let count = 0;
        const wheelEventProps = {
            type: {
                value: evType,
                writable: false
            },
            preventDefault: { // Chrome complains when native methods are called with custom events
                value: () => {
                    Object.getPrototypeOf(this).preventDefault();
                }
            }
        };

        function handleLegacyEvent(legacyEvent, callback) {
            const event = Object.create(legacyEvent, wheelEventProps);
            event.deltaMode = legacyEvent.type === 'MozMousePixelScroll' ? 0 : 1;
            event.deltaX = 0;
            event.delatZ = 0;
            if (support === 'mousewheel') {
                event.deltaY = -(1 / 40) * legacyEvent.wheelDelta;
                if (legacyEvent.wheelDeltaX) {
                    event.deltaX = -(1 / 30) * legacyEvent.wheelDeltaX;
                }
            } else {
                event.deltaY = legacyEvent.detail;
            }
            if (typeof callback === 'function') {
                return callback(event);
            } else if (callback.handleEvent) {
                return callback.handleEvent.call(callback, event);
            }
            return null;
        }

        function createWheelListener(el, callback) {
            const handler = function handler(e) {
                return handleLegacyEvent(e, callback);
            };
            count += 1;
            const ref = `cb${count}`;
            if (Object.prototype.hasOwnProperty.call(el, 'refProperty')) {
                el[refProperty] = el[refProperty];
            } else {
                el[refProperty] = {};
            }
            el[refProperty][ref] = handler;
            callback[refProperty] = ref;
            return handler;
        }

        function getWheelListener(el, callback) {
            const ref = callback[refProperty];
            const handler = el[refProperty][ref];
            if (handler) {
                delete el[refProperty][ref];
                callback = handler;
            }
            return callback;
        }

        (function interceptEventTargetMethods(proto) {
            const addListener = proto.addEventListener;
            const removeListener = proto.removeEventListener;
            proto.addEventListener = function eventListener1(name, callback, useCapture) {
                if (name === evType) {
                    name = support;
                    callback = createWheelListener(this, callback);
                }
                return addListener.call(this, name, callback, useCapture);
            };
            proto.removeEventListener = function eventListener2(name, callback, useCapture) {
                if (name === evType) {
                    name = support;
                    callback = getWheelListener(this, callback);
                }
                return removeListener.call(this, name, callback, useCapture);
            };
        }(EventTarget.prototype));
    }

    WheelEvent.prototype = window.Event.prototype;

    window.WheelEvent = WheelEvent;
};
