// ==UserScript==
// @name         YandexBot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://yandex.ru/*
// @match        https://xn----7sbab5aqcbiddtdj1e1g.xn--p1ai/*
// @match         https://crushdrummers.ru/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

let yandexInput = document.getElementsByName("text")[0];
let btn = document.getElementsByClassName("button")[1];
let sites = {
    "xn----7sbab5aqcbiddtdj1e1g.xn--p1ai": ["Как звучит гобой","Кларнет","Фагот","Валторна","Саксофон"],
     "crushdrummers.ru": ["Барабанное шоу", "Шоу барабанщиков Crush", "Заказать барабанное шоу"]
}
let site = Object.keys(sites)[getIntRandom(0, Object.keys(sites).length)]; // Возвращаем случайный сайт
let words = sites[site]; // Получаем набор коючевых слов одного из сайтов
//let words = ["Как звучит гобой","Флейта","Кларнет","Фагот","Валторна","Саксофон"]; // Набор коючевых слов
let word = words[getIntRandom(0, words.length)]; // Получаем случайное слово из массива words


if(btn != undefined){ // Проверяем, что мы на главной странице
   let i=0;
    let timerId = setInterval(function(){
    yandexInput.value = yandexInput.value + word[i++]; // Пишем фразу по буквам в поисковую строку
    document.cookie = "site="+site; // Записали выбранный сайт в cookie браузера
        if(i==word.length){
            clearInterval(timerId);
            btn.click(); // Клик по кнопке поиска
        }
    }, 500);
}else if(location.hostname === "yandex.ru"){ // Если страница с поисковой выдачей
    let links = document.links;// Собираем коллекцию ссылок
    let goNext = true;
    let site = getCookie("site"); // Достаём ранее выбранный сайт из куки
    for(let i=0; i<links.length; i++){ // Перебираем ссылки
        let link = links[i];
        if(link.href.indexOf(site) != -1){ // Ищем ссылку с нужным сайтом
           link.target = "_self";
            setTimeout(function(){
                link.click(); // Кликаем по ссылке с нужным сайтом
            }, 2000);
            goNext = false; // запрещаем идти дальше по страницам поисковика
            break; // Останавливаем цикл
        }
    }
    if(goNext){ // Проверяем, можно ли идти далее по страницам поисковика
        let currentPage = document.querySelector(".pager__items>span").innerText;
        if(currentPage<10){
            let btnY = document.getElementById("btnY"); // Находим кнопку "Следующая"
            setTimeout(function(){
                btnY.click(); // Кликаем по кнопке следующая
            }, 2000);
        }else{
            location.href = "https://yandex.ru/";
        }
    }
 }else{ // Любой другой сайт
      setInterval(function(){
          if(getIntRandom(0,100)<50) location.href = "https://yandex.ru/"; // С некоторой вероятностью мы уйдём на сайт yandex
          let links = document.links; // Коллекция ссылок
          let randomIndex = getIntRandom(0, links.length);
          let link = links[randomIndex];
          if(link.href.indexOf(location.hostname) != -1){ // Если переход внутри сайта
              link.target = "_self";
              links[randomIndex].click();
          }else{ // Если переход на другой сайт, то мы ссылаем браузер на главную страницу нашего сайта
              location.href = location.origin;
          }
       },2000);
}

function getIntRandom(min, max){
    return Math.floor(Math.random()*(max-min)+min);
}
function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

