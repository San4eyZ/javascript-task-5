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
            // Для студента событие представляет из себя объект, содержащий список обработчиков,
            // частоту события и количество повторений(Изначально не ограничено).
            // Если на событие уже есть подписка, то добавляем обработчик, иначе подписываем
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
            // Если на событие уже записывались, то записываем в него, если нет, создаем запись
            // Студенты расположены по порядку записи. Могут повторяться.
            if (this[event]) {
                this[event].students.add(context);
            } else {
                this[event] = {
                    students: new Set([context]),
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
            delete context[event];
            for (let occasion of Object.keys(context)) {
                if (occasion !== 'focus' && occasion !== 'wisdom' &&
                    occasion.indexOf(`${event}.`) === 0) {
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
                // Если студент записан, не исчерпал лимит и наступило подходящее время,
                // то выполняем события из цепочки.
                if (student[event] && that[event].count < student[event].times &&
                that[event].count % student[event].frequency === 0) {
                    student[event].events.forEach(occasion => occasion.call(student));
                }
            };
            // Последовательно выполняем события до вершины пространства имен
            while (namespaces.length !== 0) {
                event = namespaces.join('.');
                if (this[event]) {
                    // Для всех записанных студентов в порядке очереди пытаемся выполнить событие
                    this[event].students.forEach(callEvent);
                    this[event].count++;
                }
                namespaces.pop();
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
