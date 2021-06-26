'use strict';

//section 1
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1')
const links = document.querySelector('.nav__links')
const nav = document.querySelector('.nav')

const operContainer = document.querySelector('.operations__tab-container') //div for the 3 buttons
const operTab = document.querySelectorAll('.operations__tab') //button
const operContent = document.querySelectorAll('.operations__content')



///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((el) => {
  el.addEventListener('click', openModal);
})


btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Cookie feuture
const closeCookie = function () {
  const message = document.createElement('div')
  message.classList.add('cookie-message')
  message.innerHTML = 'We use Cookies for improveed functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>'
  const header = document.querySelector('header')
  header.append(message)

  document.querySelector('.btn--close-cookie').addEventListener('click', function () {
    message.remove()
  })

  // style 
  message.style.backgroundColor = '#37383d'
  message.style.width = '100%'

  message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px'

}
closeCookie()

//Menu Fade Animation
const handleHover = function (e) {
  // console.log(this, e.currentTarget);

  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').
      querySelectorAll('.nav__link')

    //logo
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}
// Passing an "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///Scroll feature

btnScroll.addEventListener('click', function (e) {
  //modern way
  section1.scrollIntoView({ behavior: "smooth" })

  // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  // console.log('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);

  //old school Scrolling
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth'
  // })


})


//Navigation  --event delegation --- 
links.addEventListener('click', function (e) {
  e.preventDefault()
  //Match strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href')
    document.querySelector(`${id}`).scrollIntoView({ behavior: "smooth" })
  }

});


////////////////////////////
////Operation Tabbed Component
operContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab')
  // console.log(clicked);

  //Gaurd Clause
  if (!clicked) return;

  //Remove active classes
  operTab.forEach(tab => tab.classList.remove('operations__tab--active'));
  operContent.forEach(cont => cont.classList.remove('operations__content--active'));

  //Active tab
  clicked.classList.add('operations__tab--active')

  //Active Content area
  // console.log(clicked.dataset.tab);

  //The dataset property allows us to access this object('data-tab') and read values from it.
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')

})





///////////////////
//Sticky Navigation: Intersection Observer API
const header = document.querySelector('.header')
const navHeight = nav.getBoundingClientRect().height //get rootMargin height dynamically

const observer = new IntersectionObserver(function (entries) {
  const [entry] = entries
  if (!entry.isIntersecting) nav.classList.toggle('sticky')

}, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
})
observer.observe(header)


//////////////
//Revealing sections on scroll

const allSections = document.querySelectorAll('.section')

const sectionObserv = new IntersectionObserver(function (entries, observer) {
  const [entry] = entries
  if (!entry.isIntersecting) return;

  if (entry.isIntersecting) {

    entry.target.classList.remove('section--hidden')
    observer.unobserve(entry.target)

  }
}, { root: null, threshold: 0.15, })

allSections.forEach(section => {
  section.classList.add('section--hidden')
  sectionObserv.observe(section)
});


//Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]')

const imgObserver = new IntersectionObserver(function (loadImg, observer) {
  const [entry] = loadImg
  if (!entry.target) return

  //Replace src attribute with data-src
  entry.target.src = entry.target.dataset.src


  ///
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img')
  })


  observer.unobserve(entry.target)


}, {
  root: null, threshold: 0, rootMargin: `200px` //For slower network connections, the 200px gives a head start on the loading, on a faster connection you wont see the blur but on slower connections you might./
})
imgTargets.forEach(img => imgObserver.observe(img));



/////////////////////
//Sliders 

const sliders = function () {


  const slides = document.querySelectorAll('.slide')
  const btnLeft = document.querySelector('.slider__btn--left')
  const btnRight = document.querySelector('.slider__btn--right')
  const dotContainer = document.querySelector('.dots')



  //Counters
  let curSlide = 0
  //curSlide = 1; -100%,0%
  let maxSlide = slides.length

  //***FUNCTIONS*/

  //Dots bottom of sliders
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`)
    })
  }

  //activate the dot to indicate the current slide 
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')
  }

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`
    })
  }

  //NextSlide
  const nextSlide = () => {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide)
    activateDot(curSlide)

  }

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1
    } else {
      curSlide--

    }
    goToSlide(curSlide)
    activateDot(curSlide)
  }

  //initialize/
  const init = function () {
    //create slide 
    goToSlide(0)
    //create the dots
    createDots();
    //activate dots
    activateDot(0)
  }
  init()

  //Event handlers

  btnRight.addEventListener('click', nextSlide)
  btnLeft.addEventListener('click', prevSlide)

  document.addEventListener('keydown', function (e) {
    e.key == 'ArrowRight' && nextSlide()
    e.key === 'ArrowLeft' && prevSlide()

  })

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset
      goToSlide(slide)
      activateDot(slide)
    }
  })
}

sliders()

