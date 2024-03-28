// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

// Меню Бургер
const burger = document?.querySelector("[data-burger]");
const nav = document?.querySelector("[data-nav]");
const navItems = nav?.querySelectorAll("a");
const body = document.body;
const header = document?.querySelector(".header");
const headerHeight = header.offsetHeight;

console.log(headerHeight);
document
  .querySelector(":root")
  .style.setProperty("--header-height", `${headerHeight}px`);

burger?.addEventListener("click", () => {
  body.classList.toggle("stop-scroll");
  burger?.classList.toggle("burger--active");
  nav?.classList.toggle("nav--visible");
});

navItems.forEach((el) => {
  el.addEventListener("click", () => {
    body.classList.remove("stop-scroll");
    burger?.classList.remove("burger--active");
    nav?.classList.remove("nav--visible");
  });
});

// Лечим чтобы не было глюка с появлением меню nav при перезагрузки страницы
window.onload = function () {
  //nav?.style.transition = "transform 0.6s ease-in-out";
  nav?.classList.toggle("transition");
  console.log(nav.style);
};

//=====================================Показать еще карточки show more=======
const showMore = document.querySelector(".show-more");
let shop = document.querySelector("#shop"); // поиск по id родителя
const productsLength = shop.querySelectorAll(".item-grid").length; // поиск по id родителя

let items = 6;

showMore.addEventListener("click", () => {
  items += 3;
  const array = Array.from(document.querySelector(".card-shop__grid").children);
  const visItems = array.slice(0, items);

  visItems.forEach((el) => el.classList.add("is-visible"));

  if (visItems.length === productsLength) {
    showMore.style.display = "none";
  }
});

//====================Cart Корзина добавляем удаляем элементы и суммируем цену=============
const productsBtn = document.querySelectorAll(".item-grid__btn");
const cartProductsList = document.querySelector(".cart-content__list");
const cart = document.querySelector(".cart");
const cartQuantity = document.querySelector(".cart__quantity");
const fullPrice = document.querySelector(".fullprice");
let price = 0;

// раздача уникального id
const randomId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
// убирает из цены пробелы и лишние знаки. получаем число безпробелов и знаков
const priceWithoutSpaces = (str) => {
  return str
    .replace(/\s/g, "")
    .replace(/[^.\d]+/g, "")
    .replace(/^([^\.]*\.)|\./g, "$1");
};
// вставляет обратно пробелы и знаки в число
const normalPrice = (str) => {
  return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
};

// считаем сумму
const plusFullPrice = (currentPrice) => {
  currentPrice = parseFloat(currentPrice);
  price = parseFloat(price) + parseFloat(currentPrice);
  price = parseFloat(price).toFixed(2); // после запятой 2 знака.убираем глюк js кода много цифр после запятой
  return price;
  //return (price += currentPrice);
};

const minusFullPrice = (currentPrice) => {
  currentPrice = parseFloat(currentPrice);
  price = parseFloat(price) - parseFloat(currentPrice);
  price = parseFloat(price).toFixed(2); // после запятой 2 знака.убираем глюк js кода много цифр после запятой
  return price;
  // return (price -= parseFloat(currentPrice));
};

// вывести полную цену
const printFullPrice = () => {
  fullPrice.textContent = `$ ${normalPrice(price)} USD`;
};

// просуммировать и вывести quantity
const printQuantity = () => {
  length = cartProductsList.querySelector(".simplebar-content").children.length;
  cartQuantity.textContent = length;
  length > 0 ? cart.classList.add("active") : cart.classList.remove("active");
};

const generateCartProduct = (img, title, price, id) => {
  return `
  <li class="cart-content__item">
			<article class="cart-content__product card-product" data-id="${id}">
				<img class="card-product__img" src="${img}" alt="Картинка ${title} в карточке товара">
				<div class="card-product__text">
					<h3 class="card-product__title">
						${title}
					</h3>
					<span class="card-product__price">
          $ ${normalPrice(price)} USD
					</span>
				</div>
				<button class="card-product__delete" aria-label="Кнопка удалить товар из корзины"></button>
			</article>
	</li>
  `;
};

//===== функция удаления из корзины
const deleteProducts = (productParent) => {
  // получить id
  let id = productParent.querySelector(".card-product").dataset.id;

  document
    .querySelector(`.item-grid[data-id="${id}"]`)
    .querySelector(".item-grid__btn").disabled = false; // disabled false

  let currentPrice = parseFloat(
    priceWithoutSpaces(
      productParent.querySelector(".card-product__price").textContent
    )
  );
  minusFullPrice(currentPrice); // minus price
  printFullPrice(); // print fullprice
  productParent.remove(); // remove productParent

  printQuantity(); // count and print quantity
};
//=============================

productsBtn.forEach((el) => {
  el.closest(".item-grid").setAttribute("data-id", randomId()); // задаем уникальный id каждой карточке товара
  el.addEventListener("click", (e) => {
    let self = e.currentTarget;
    let parent = self.closest(".item-grid");
    let id = parent.dataset.id;
    let img = parent.querySelector(".item-grid__img").getAttribute("src");
    let title = parent.querySelector(".item-grid__name-food").textContent;
    // let priceString = parent.querySelector(".price-item__current").textContent; // получаем цену как есть
    let priceNum = parent.querySelector(".price-item__current").textContent; // получаем из цены число без пробелов и символов
    let priceNumber = parseFloat(priceWithoutSpaces(priceNum)).toFixed(2); // получаем из цены дробное(parseInt- целое) число-строку без пробелов и символов. toFixed(2)-2знака после запятой
    //===============================================

    // считаем сумму
    plusFullPrice(priceNumber);
    //console.log(priceNumber);

    // вывести полную цену
    printFullPrice();

    // добавить в карзину cart
    cartProductsList
      .querySelector(".simplebar-content")
      .insertAdjacentHTML(
        "afterbegin",
        generateCartProduct(img, title, priceNumber, id)
      );

    // просуммировать и вывести quantity количество у Cart
    printQuantity();

    // disabled btn
    self.disabled = true;
  });
});
// удаляем товары при клике на корзину
cartProductsList.addEventListener("click", (e) => {
  if (e.target.classList.contains("card-product__delete")) {
    deleteProducts(e.target.closest(".cart-content__item"));
  }
});
//===================плавная прокрутка==================================

//======================рабочаа плавная прокрутка=============================
const anchors = document.querySelectorAll("a.nav__link");

for (let anchor of anchors) {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const blockID = anchor.getAttribute("href");

    document.querySelector(blockID).scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}
//=====================================================

//=====================================================

//=====================================================
