'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
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
            // Для студента событие представляет из себя объект, содержащий список обработчиков,
            // частоту события и количество повторений(Изначально не ограничено).
            if (context[event]) {
                context[event].events.push(handler);
            } else {
                context[event] = {
                    events: [handler],
                    times: Infinity,
                    frequency: 1
                };
            }
            // Для преподавателя событие - объект содержащий список записавшихся студентов и
            // количество прошедших раз.
            if (this[event]) {
                this[event].students.push(context);
            } else {
                this[event] = {
                    students: [context],
                    count: 0
                };
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
            for (let occasion of Object.keys(context)) {
                if (occasion !== 'focus' && occasion !== 'wisdom' &&
                    occasion.indexOf(event) === 0) {
                    delete context[occasion];
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
            let that = this;
            let callEvent = function (student) {
                if (student[event] && student[event].times !== 0 &&
                that[event].count % student[event].frequency === 0) {
                    student[event].events[0].call(student);
                    student[event].events.unshift();
                    student[event].times--;
                }
            };
            while (namespaces.length !== 0) {
                event = namespaces.join('.');
                if (this[event]) {
                    this[event].students.forEach(callEvent);
                    this[event].count++;
                }
                namespaces.splice(-1, 1);
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            this.on(event, context, handler);
            if (times > 0) {
                context[event].times = times;
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            this.on(event, context, handler);
            if (frequency > 1) {
                context[event].frequency = frequency;
            }

            return this;
        }
    };
}
