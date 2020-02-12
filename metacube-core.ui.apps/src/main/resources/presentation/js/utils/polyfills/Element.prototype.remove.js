export default () => {
    // from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
    [Element.prototype, CharacterData.prototype, DocumentType.prototype].forEach((item) => {
        if (Object.prototype.hasOwnProperty.call(item, 'remove')) {
            return;
        }
        Object.defineProperty(item, 'remove', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function remove() {
                this.parentNode.removeChild(this);
            }
        });
    });
};
