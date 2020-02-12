'use strict'

use(function () {
    if(null == this.aString) {
        return this.aString;
    }

	return this.aString.split(this.theUpToCharacter)[0];
});
