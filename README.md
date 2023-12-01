# Игра «Жизнь»

Тествое задание

Деплой: [game-of-life-faciledictu.surge.sh](https://game-of-life-faciledictu.surge.sh)

## Особенности реализации

* Vanilla JS + CSS3 + HTML5, без использования сборщиков и библиотек

* Архитектура построена по приципу MVC, состояние приложения реализовано с использованием обертки Proxy. Это делает возможной для подписку View на обновления состояния и избежать прямого вызова рендер-функции в Controller.

* Реализована возможность запускать несколько независимых экземпляров приложения на одной странице (в том числе благодая использованию селекторов на основе классов, а не id).

* Алгоритм вычисления соседних ячеек эмулирует поверхность тора.

* Поле имеет настраиваемые размеры. Масштаб поля может быть также отрегулирован.

* Первое поколение может быть сгенерировано случайно или вручнуб (с помощью мыши).

* В интерфейсе отображается время генерации каждого поколения (время отрисовки не включается)

* Проведена только минимально необходимая оптимизация:
  * при генерации нового поколения область просчета сужается до прямоугольника, содержащего живые ячейки;
  * использован цикл for вместо функций высшего порядка;
  * функция генерации нового поколения вынесена из основного потока приложения в фоновый с помощью Web Workers.
  * при рендере происходит отрисовка только живых ячеек.