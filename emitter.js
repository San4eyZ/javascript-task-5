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
            // Если на событие уже есть подписка, то добавляем обработчик, иначе подписываем
            if (context[event]) {
                context[event].push({
                    event: handler,
                    times: Infinity,
                    frequency: 1
                });
            } else {
                context[event] = [{
                    event: handler,
                    times: Infinity,
                    frequency: 1
                }];
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
                if (student[event]) {
                    student[event].forEach(function (occasion) {
                        if (that[event].count < occasion.times &&
                        that[event].count % occasion.frequency === 0) {
                            occasion.event.call(student);
                        }
                    });
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
                context[event][context[event].length - 1].times = times;
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
                context[event][context[event].length - 1].frequency = frequency;
            }

            return this;
        }
    };
}
