'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (this[event]) {
                this[event].push([handler, context]);
            } else {
                this[event] = [[handler, context]];
            }

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            this[event] = this[event].filter(action => action[1] !== context);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            let namespaces = event.split('.');
            while (namespaces.length !== 0) {
                event = namespaces.join('.');
                if (this[event]) {
                    this[event].forEach(action => action[0].call(action[1]));
                }
                namespaces.pop();
            }

            return this;
        }
    };
}
