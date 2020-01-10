/** FrontEnd-API
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

//##########################################################################

/*! разграничение подошвы по типам
Есть одинаковые сверху тапочки, у которых разная подошва, 
надо объединить их в одну карточку товара, но с возможностью выбора подошвы.
Для решения задачи нужно создать размеры с указанием типа подошвы в постфиксе,
и обрабатывать этим скриптом
*/
function DiffSole()
{
	console.log("DiffSole");

	//поиск блока относящегося к размерам
	var aBlockSizes = document.getElementsByClassName("sizes-viewer-list text-static");

	if(aBlockSizes.length > 0)
	{
		///поиск всех дивов, нужен только первый (второй по счету)
		var oDivSizes = aBlockSizes[0].getElementsByTagName("div");
		oDivSizes = oDivSizes[1];

		//дивы с размерами
		var aSizes = aBlockSizes[0].getElementsByClassName("sizes-viewer-block");
		
		var iCountDown = 0;
		var iLastCom = 1;
		var sLastFoundStr = "";
		
		var oNewDiv = document.createElement('div');
		if(aSizes[0].textContent.indexOf("В") >= 0)
		{
			oNewDiv.innerHTML = "<span style='font-size: 16px; font-weight: bold;'><a href='/pages/podoshva#voilok' target='_blanck'>Подошва из войлока</a>:</span>";
			sLastFoundStr = "В";
			++iCountDown
		}
		else if(aSizes[0].textContent.indexOf("МП") >= 0)
		{
			oNewDiv.innerHTML = "<span style='font-size: 16px; font-weight: bold;'><a href='/pages/podoshva#eva' target='_blanck'>Подошва из МП</a>:</span>";
			sLastFoundStr = "МП";
			++iCountDown
		}
		
		oDivSizes.insertBefore(oNewDiv, aSizes[0]);
		
		
		for(var i=iLastCom; i<aSizes.length; ++i)
		{
			if(aSizes[i].textContent.indexOf(sLastFoundStr) < 0)
			{
				var sText = "";
				if(aSizes[i].textContent.indexOf("В") >= 0)
				{
					sText = "<span style='font-size: 16px; font-weight: bold;'><a href='/pages/podoshva#voilok' target='_blanck'>Подошва из войлока</a>:</span>";
					sLastFoundStr = "В";
				}
				else if(aSizes[i].textContent.indexOf("МП") >= 0)
				{
					sText = "<span style='font-size: 16px; font-weight: bold;'><a href='/pages/podoshva#eva' target='_blanck'>Подошва из МП</a>:</span>";
					sLastFoundStr = "МП";
				}
				
				//alert(sText);
				
				var oNewDiv2 = document.createElement('div');
				oNewDiv2.innerHTML = sText;
				oDivSizes.insertBefore(oNewDiv2, aSizes[i]);
				
				++iCountDown;
			}
		}
		
		return true;
	}

	return false;
}

//**************************************************************************

//! вставка блока со ссылками на детскую, женскую и мужскую обувь
function InsertCatGender()
{
	console.log("InsertCatGender");
	var aBreads = document.getElementsByClassName("breads");
	var aDivPageTitle = document.getElementsByClassName("page-title-row");
	var aWraper = document.getElementsByClassName("site-body-main");
	
	if(aBreads.length > 0 && aBreads[0].textContent.indexOf("Обувь войлочная") >= 0 && aDivPageTitle.length > 0 && aWraper.length > 1)
	{
		var oNewDiv = document.createElement('div');
		oNewDiv.className = "tags";
		var sText = "<a class='tag-item cs-br-1' href='https://магазин-валенок.рф/categories/detskaya-obuv'>Детская обувь</a>";
        sText += "<a class='tag-item cs-br-1' href='https://магазин-валенок.рф/categories/zhenskaya-obuv'>Женская обувь</a>";
		sText += "<a class='tag-item cs-br-1' href='https://магазин-валенок.рф/categories/muzhskaya-obuv'>Мужская обувь</a>";
		oNewDiv.innerHTML = sText;
		
		var oWraper = aWraper[1];
		var oDivPageTitle = aDivPageTitle[0];
		
		oWraper.insertBefore(oNewDiv, oDivPageTitle);
		
		return true;
	}
	return false
}

//**************************************************************************

//! округление значения процента скидки, чтобы вместо 47,4987% было 47%
function DiscountRounding(sClass)
{
	console.log("DiscountRounding");
	var aRedDiscount = document.getElementsByClassName(sClass);
	
	if(aRedDiscount.length > 0)
	{
		for(var i=0, il=aRedDiscount.length; i<il; ++i)
		{
			var sPercent = aRedDiscount[i].innerHTML;
			var iStart = sPercent.indexOf(",");
			if(iStart >= 0)
			{
				sPercent = sPercent.substr(0, iStart) + "%";
				aRedDiscount[i].innerHTML = sPercent;
			}
		}
		
		return true;
	}
	
	return false;
}

//**************************************************************************

//! вставка текста под фото валенок с подошвой "Подошва может отличаться от представленной на фото"
function InsertText4DiffDown()
{
  console.log("InsertText4DiffDown");
	var aBreads = document.getElementsByClassName("breads");
	var oGallery = document.querySelector(".gallery-block");
	var oArticle = document.querySelector(".details-sku .details-param-value");
	
	if(
		oGallery && aBreads && 
		aBreads[0].textContent.indexOf("Обувь валяная") >= 0 && 
		(aBreads[0].textContent.indexOf("Женская") >= 0 || aBreads[0].textContent.indexOf("Детская") >= 0) && 
		oArticle && oArticle.innerHTML[2] == 2
		)
	{
		var oP = null;

		if(!(oP = document.getElementById("InsertText4DiffDown")))
		{
			oP = document.createElement('div');
			oP.id = "InsertText4DiffDown";
		}

		oP.innerHTML = "<p style='font-size: 16px; color: red; text-align: center;'>Подошва может отличаться от представленной на фото</p>";
		oGallery.append(oP);
	}
	
	return true;
}

//**************************************************************************

//! выделение пункта меню "ОПТ"
function SelectOPT()
{
	console.log("SelectOPT");
	var oOpts = document.querySelectorAll('span.menu-general-root-link-text');
	for(var i=0, il=oOpts.length; i<il; ++i)
	{
		if(oOpts[i].innerHTML == "ОПТ")
			oOpts[i].innerHTML = "<strong><big>"+oOpts[i].innerHTML+"</big></strong>";
	}

	return true
}

//**************************************************************************

//! выбор и клик по бесплатной доставке
function FreeShipping()
{
	console.log("FreeShipping");
	var iCountSuccess = 0;
  var aLabel = document.getElementsByClassName("shipping-item");
  if(aLabel.length > 0 && aLabel[0].innerHTML.indexOf("Бесплатная доставка") >= 0)
  {
		aLabel[0].style.backgroundColor = "rgba(255, 0, 0, 0.2)";
		++iCountSuccess;
      
		var aRadio = document.getElementsByClassName("custom-input-native shipping-item-custom-input");
		if(aRadio.length > 0)
		{
			aRadio[0].click();
			++iCountSuccess;
		}
	}
  
	if(iCountSuccess == 2)
		return true;

	return false;
}

//**************************************************************************

/*! упорядочивание способов доставки
Можно было бы по отдельности все упорядочить в админке, 
но дело в том, что используется 2 акка сервиса edost, к тому же поля edost
требуют ввода паспортных данных, а для отдельных способов доставки 
(например "почта России") этого не надо.
Для решения задачи надо сделать кастомизированный способ доставки "почта России",
где надо убрать паспортные данные, и скриптом убирать способ предоставляемой сервисом edost, 
оставив кастомизированный.
Все-равно оба способа (кастомизированный и от edost, идентичны и работают по инфе через edost)
*/
function FirstShipping()
{
	console.log("FirstShipping");
  var aLabel = document.getElementsByClassName("shipping-item");
  if(aLabel.length > 0 && aLabel[0].innerHTML.indexOf("Почта России (наземная посылка со страховкой)") >= 0)
  {
		aLabel[0].style.display = "none";
    aLabel[1].style.display = "none";
		isCompletedFirstShipping = true;
		var aRadio = document.getElementsByClassName("custom-input-native shipping-item-custom-input");
		if(aRadio.length > 2)
			aRadio[2].click();

		return true;
	}

	return false;
}

//##########################################################################

// установка обработчиков
api.addFn(DiffSole);
api.addFn(InsertCatGender);
api.addFn(DiscountRounding, "products-view-label-inner products-view-label-discount");
api.addFn(DiscountRounding, "price-discount-percent");
api.addFn(InsertText4DiffDown);
api.addFn(SelectOPT);
//api.addFn(FreeShipping);
api.addFn(FirstShipping);

// запуск обработчиков
api.run();
