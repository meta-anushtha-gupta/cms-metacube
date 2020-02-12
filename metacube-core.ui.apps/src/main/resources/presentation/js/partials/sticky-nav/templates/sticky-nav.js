/**
 * Template for sticky nav
 * Uses ES6 template literal to composite the markup for a sticky nav
 */
import { html } from 'utils';

export default (waypointSections = [], skipTo = '', initialActiveIndex = -1) => html`
    <div class="sticky-nav__container" data-waypoint-offset="">
        <div class="wrapper sticky-nav__wrapper">
            <ul class="sticky-nav__items-list">
                <li class="sticky-nav__item">
                    <button class="sticky-nav__item-skip-to">${skipTo}</button>
                </li>
                ${waypointSections.map((waypointSection, index) => `
                    <li class="sticky-nav__item${index === initialActiveIndex ? ' sticky-nav__item--active' : ''}${waypointSection.excludeSection === 'true' ? ' hide-large' : ''}${waypointSection.isLastVisibleItem === true ? ' sticky-nav__item--last-visible' : ''}">
                        <a class="sticky-nav__item-link" 
                        href="#${waypointSection.deepLink}" data-analytics-trigger="page-nav-${waypointSection.deepLink}"><span class="sticky-nav__item-link-label">${waypointSection.navigationLabel}</span></a>
                    </li>
                `).join('')}                
            </ul>
            <button class="sticky-nav__nav-toggle" aria-label="Open Menu"></button>
        </div>
    </div>
`.trim();
