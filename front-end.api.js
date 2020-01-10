/** front-and.api.js
 * 
 * API для работы с front-end частью сайта, когда невозможно 
 * вмешаться в исходный код страницы со стороны сервера.
 * Встраивается в статичные блоки страницы, через админку.
 * Тестировалось на интернет-магазине на движке Advantshop (7, 8 версий)
 * 
 * @author Buturlin Vitaliy (Byurrer), email: byurrer@mail.ru
 * @copyright 2020 Buturlin Vitaliy
 * @license MIT https://opensource.org/licenses/mit-license.php
 */

//##########################################################################

var api = api || {};

//! текущее количествосовершенных итераций
api.iCurrIteration = 0;

/*! массив функций-обработчиков
каждый элемент является объектом с ключами:
fn - функция
style - строка со стилями для поиска на странице, необязательно
completed - закончила ли функция свою работу, автоустановка false
*/
api.aFn = [];

//! период вызова таймера в млсек
api.iTimerPeriod = 1000;

//! максимальное количество итераций
api.iMaxIteration = 10;


//! добавление функции-обработчика в массив api.aFn
api.addFn = function(fnFunc, sStyle=null)
{
	api.aFn.push({fn: fnFunc, style: sStyle, completed: false});
}

//! запуск обработчиков
api.run = function()
{
	api.idTimer = setTimeout(api.callFn, api.iTimerPeriod);
}


//! вызов обработчиков
api.callFn = function()
{
	var iCountCompleted = 0;
	for(var i=0, il=api.aFn.length; i<il; ++i)
  {
		var aData = api.aFn[i];
		if(!aData.completed)
			aData.completed = aData.fn(aData.style);
		else
			++iCountCompleted;
	}
	
	// если было совершено 10 или более итарций или все функции закончили свою работу, тогда удаляем таймер, иначе взводим
	if(api.iCurrIteration >= api.iMaxIteration || iCountCompleted == api.aFn.length)
		clearTimeout(api.idTimer);
	else
		api.idTimer = setTimeout(api.callFn , api.iTimerPeriod);

	++api.iCurrIteration;
}
