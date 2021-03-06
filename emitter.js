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
        events: {},

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (this.events[event]) {
                this.events[event].push({ handler, context });
            } else {
                this.events[event] = [{ handler, context }];
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
            let isWrongContext = action => action.context !== context;
            if (this.events[event]) {
                this.events[event] = this.events[event].filter(isWrongContext);
            }
            for (let occasion of Object.keys(this.events)) {
                if (!occasion.indexOf(`${event}.`)) {
                    this.events[occasion] = this.events[occasion].filter(isWrongContext);
                }
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            let namespaces = event.split('.');
            while (namespaces.length > 0) {
                event = namespaces.join('.');
                if (this.events[event]) {
                    this.events[event].forEach(action => action.handler.call(action.context));
                }
                namespaces.pop();
            }

            return this;
        }
    };
}
