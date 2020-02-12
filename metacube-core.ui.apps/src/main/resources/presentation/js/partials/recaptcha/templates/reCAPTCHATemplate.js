/**
 * Template for reCAPTCHA
 * Uses ES6 template literal to composite the markup for a reCAPTCHA
 */
import { htmlNode } from 'utils';

export default ({ errorMessage = '' }) => htmlNode`
    <div class="recaptcha">
        <div data-recaptcha-container class="recaptcha__container"></div>
        <p data-error-message class="recaptcha__error">${errorMessage}</p>
    </div>
`;
