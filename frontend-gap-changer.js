/** frontand-gap-changer.js
 * 
 * API для работы с front-end частью сайта, когда невозможно 
 * вмешаться в исходный код страницы со стороны сервера.
 * Встраивается в статичные блоки страницы, через админку.
 * 
 * Каждая функция обработчик должна возвращать 
 * - true если работа функции больше не требуется
 * - false если требуется повторный вызов функции
 * 
 * Тестировалось на интернет-магазине на движке Advantshop (7, 8 версий)
 * 
 * @author Buturlin Vitaliy (Byurrer), email: byurrer@mail.ru
 * @copyright 2020 Buturlin Vitaliy
 * @license MIT https://opensource.org/licenses/mit-license.php
 */

//##########################################################################

var fgc = fgc || {};

//! текущее количествосовершенных итераций
fgc.iCurrIteration = 0;

/*! массив функций-обработчиков
каждый элемент является объектом с ключами:
fn - функция
style - строка со стилями для поиска на странице, необязательно
completed - закончила ли функция свою работу, автоустановка false
*/
fgc.aFn = [];

//! период вызова таймера в млсек
fgc.iTimerPeriod = 1000;

//! максимальное количество итераций
fgc.iMaxIteration = 10;


//! добавление функции-обработчика в массив fgc.aFn
fgc.addFn = function(fnFunc, sStyle=null)
{
	fgc.aFn.push({fn: fnFunc, style: sStyle, completed: false});
}

//! запуск обработчиков
fgc.run = function()
{
	fgc.idTimer = setTimeout(fgc.callFn, fgc.iTimerPeriod);
}


//! вызов обработчиков
fgc.callFn = function()
{
	var iCountCompleted = 0;
	for(var i=0, il=fgc.aFn.length; i<il; ++i)
  {
		var aData = fgc.aFn[i];
		if(!aData.completed)
			aData.completed = aData.fn(aData.style);
		else
			++iCountCompleted;
	}
	
	// если было совершено 10 или более итарций или все функции закончили свою работу, тогда удаляем таймер, иначе взводим
	if(fgc.iCurrIteration >= fgc.iMaxIteration || iCountCompleted == fgc.aFn.length)
		clearTimeout(fgc.idTimer);
	else
		fgc.idTimer = setTimeout(fgc.callFn , fgc.iTimerPeriod);

	++fgc.iCurrIteration;
}
