/* Vlastní skripty pro kovaniprosklo – Shoptet */
(function () {

function init() {

  /* ============================= */
  /* VLASTNÍ HORNÍ LIŠTA */
  /* ============================= */

  if (!document.querySelector('.kps-topbar')) {

    var bar = document.createElement('div');
    bar.className = 'kps-topbar';
    bar.innerHTML =
      '<span>Potřebujete poradit s výběrem?</span>' +
      '<span><a href="tel:+420602627144">+420 602 627 144</a></span>' +
      '<span><a href="mailto:kovani@kovaniprosklo.cz">kovani@kovaniprosklo.cz</a></span>';

    var wrapper = document.querySelector('.overall-wrapper');
    var adminBar = wrapper ? wrapper.querySelector('.admin-bar') : null;

    if (adminBar) {
      adminBar.insertAdjacentElement('afterend', bar);
    } else if (wrapper) {
      wrapper.insertBefore(bar, wrapper.firstElementChild);
    }

  }

  /* lišta je na místě – rezervované místo z CSS už není potřeba */
  document.body.classList.add('kps-topbar-ready');


  /* ============================= */
  /* PŘICHYCENÁ HLAVIČKA – LIŠTA ODJEDE NAHORU */
  /* ============================= */
  /* Šablona při scrollu přidá body odsazení ve výšce hlavičky. To by    */
  /* posunulo lištu pod hlavičku – odsazení proto přesuneme až pod lištu. */

  var stickyHeader = document.getElementById('header');

  if (stickyHeader && stickyHeader.parentNode) {

    var headerSpacer = document.createElement('div');
    headerSpacer.className = 'kps-header-spacer';
    stickyHeader.parentNode.insertBefore(headerSpacer, stickyHeader.nextSibling);

    var headerNaturalTop = 0;
    var headerNaturalHeight = 0;
    var headerFixedHeight = null;

    function measureNaturalHeader() {
      headerNaturalTop = stickyHeader.getBoundingClientRect().top + window.pageYOffset;
      headerNaturalHeight = stickyHeader.offsetHeight;
    }

    function updateStickyHeader() {
      var isFixed = stickyHeader.classList.contains('fixed-menu');
      document.body.classList.toggle('kps-header-fixed', isFixed);

      if (document.body.style.paddingTop && document.body.style.paddingTop !== '0px') {
        document.body.style.paddingTop = '0px';
      }

      if (!isFixed) {
        headerSpacer.style.height = '';
        measureNaturalHeader();
        return;
      }

      if (headerFixedHeight === null) {
        headerFixedHeight = stickyHeader.offsetHeight;
      }

      /* Přichytit až ve chvíli, kdy na sebe zmenšená hlavička a obsah    */
      /* přesně navazují – jinak by mezi nimi byla bílá mezera.            */
      var threshold = headerNaturalTop + headerNaturalHeight - headerFixedHeight;
      if (window.pageYOffset < threshold) {
        stickyHeader.classList.remove('fixed-menu');
        document.body.classList.remove('kps-header-fixed');
        headerSpacer.style.height = '';
        return;
      }

      headerSpacer.style.height = headerNaturalHeight + 'px';
    }

    /* prohlížeč by jinak při přichycení sám posunul stránku */
    document.documentElement.style.overflowAnchor = 'none';

    measureNaturalHeader();
    window.addEventListener('load', function () {
      if (!stickyHeader.classList.contains('fixed-menu')) { measureNaturalHeader(); }
    });

    /* při scrollu zpět nahoru šablona třídu nemění – kontrolujeme sami */
    window.addEventListener('scroll', updateStickyHeader, { passive: true });

    var headerOffsetObserver = new MutationObserver(updateStickyHeader);
    headerOffsetObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    headerOffsetObserver.observe(stickyHeader, { attributes: true, attributeFilter: ['class'] });

  }


  /* ============================= */
  /* PATIČKA – E-MAIL POD TELEFONEM */
  /* ============================= */
  /* Šablona kopíruje kontakt i do horního řádku patičky vedle loga, */
  /* a to až po načtení – e-mail proto doplňujeme opakovaně.         */

  function addFooterMail() {
    var lists = document.querySelectorAll('#footer .contact-box ul');
    for (var m = 0; m < lists.length; m++) {
      if (lists[m].querySelector('a[href^="mailto:"]')) { continue; }
      var mailItem = document.createElement('li');
      mailItem.innerHTML =
        '<span class="mail">' +
        '<a href="mailto:kovani@kovaniprosklo.cz">kovani@kovaniprosklo.cz</a>' +
        '</span>';
      lists[m].appendChild(mailItem);
    }
  }

  addFooterMail();
  window.addEventListener('load', addFooterMail);
  setTimeout(addFooterMail, 1500);
  setTimeout(addFooterMail, 4000);


  /* ============================= */
  /* NADPIS KATEGORIÍ NA HOMEPAGE */
  /* ============================= */

  if (document.querySelector('.homepage-box')) {

    function renameCategoryTitle() {
      var titles = document.querySelectorAll('.homepage-group-title');
      for (var h = 0; h < titles.length; h++) {
        var titleText = titles[h].textContent.replace(/\s+/g, ' ').trim().toLowerCase();
        if (titleText === 'top kategorie') {
          titles[h].textContent = 'Náš sortiment';
        }
      }
    }

    renameCategoryTitle();

    var categoryTitleObserver = new MutationObserver(function () {
      renameCategoryTitle();
    });

    categoryTitleObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    window.addEventListener('load', renameCategoryTitle);

    setTimeout(function () {
      categoryTitleObserver.disconnect();
    }, 20000);

  }


  /* ============================= */
  /* DETAIL PRODUKTU – POUZE DESKTOP */
  /* ============================= */

  if (window.innerWidth >= 768) {

    var infoWrapper = document.querySelector('.p-info-wrapper');
    var price = document.querySelector('.p-info-wrapper .price-line');

    var title =
      document.querySelector('.p-detail-inner-header h1') ||
      document.querySelector('.p-info-wrapper > h1');

    var oldHeader = document.querySelector('.p-detail-inner-header');

    /* Kód produktu – původní prvek Shoptetu (mění se podle varianty) */
    var productCode =
      document.querySelector('.p-detail-inner-header .p-code') ||
      document.querySelector('.p-code');


    /* PŘESUN H1 */
    if (title && price && infoWrapper) {
      if (title.parentElement !== infoWrapper) {
        price.parentNode.insertBefore(title, price);
      }
    }


    /* PŮVODNÍ ODKAZ "DETAILNÍ INFORMACE" (hledáme podle textu) */
    function findOriginalDetailLink() {
      var candidates = infoWrapper ? infoWrapper.querySelectorAll('a') : [];
      for (var i = 0; i < candidates.length; i++) {
        var linkText = candidates[i].textContent.replace(/\s+/g, ' ').trim();
        if (linkText === 'Detailní informace') {
          return candidates[i];
        }
      }
      return null;
    }

    var originalDetailLink = findOriginalDetailLink();


    /* VYTVOŘENÍ BLOKU POD H1 */
    if (infoWrapper && price && !document.querySelector('.product-top-summary')) {

      var summary = document.createElement('div');
      summary.className = 'product-top-summary';

      /* Kód produktu jako první řádek pod názvem */
      if (productCode) {
        productCode.classList.add('product-top-code');
        summary.appendChild(productCode);
      }

      /* ODKAZ "DETAILNÍ INFORMACE" – nový vzhled, původní funkčnost */
      if (originalDetailLink) {

        var topDetailLink = document.createElement('a');
        topDetailLink.href = '#description';
        topDetailLink.className = 'product-top-detail-link';
        topDetailLink.textContent = 'Detailní informace';

        topDetailLink.addEventListener('click', function (e) {
          e.preventDefault();
          originalDetailLink.click();
          var descriptionSection = document.getElementById('description');
          if (descriptionSection) {
            descriptionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });

        summary.appendChild(topDetailLink);
        infoWrapper.classList.add('product-top-summary-ready');
        originalDetailLink.style.display = 'none';

      } else {
        console.warn('[product-top-summary] Odkaz "Detailní informace" nebyl nalezen.');
      }

      /* VLOŽENÍ POD H1 / PŘED CENU */
      if (summary.children.length > 0) {
        price.parentNode.insertBefore(summary, price);
      }

    }


    /* PŮVODNÍ HEADER – jen skrýt, NEMAZAT */
    /* (Shoptet do něj zapisuje při výběru varianty) */
    if (oldHeader && !oldHeader.querySelector('h1')) {
      oldHeader.style.display = 'none';
    }


    /* MOŽNOSTI DORUČENÍ */
    var delivery = document.querySelector('.delivery-line');
    var cart = document.querySelector('.add-to-cart');
    if (delivery && cart) {
      cart.insertAdjacentElement('afterend', delivery);
    }

  }


  /* ============================= */
  /* DETAIL PRODUKTU – DOPLŇKOVÉ PARAMETRY NAD CENOU */
  /* ============================= */
  /* Kopie tabulky „Doplňkové parametry“ z popisu produktu, bez řádku */
  /* Kategorie. Kopie nesmí mít třídu .detail-parameters – šablona     */
  /* Carbon na ni nad cenou navazuje styly a skript pro výběr variant. */

  var topParamsPrice = document.querySelector('.p-detail .p-info-wrapper > .price-line');
  var sourceParams = document.querySelector('#description .extended-description table.detail-parameters');

  if (topParamsPrice && sourceParams && !document.querySelector('.kps-top-params')) {

    var paramsCopy = sourceParams.cloneNode(true);
    paramsCopy.className = 'kps-top-params-table';
    paramsCopy.removeAttribute('id');

    var copyRows = paramsCopy.querySelectorAll('tr');
    for (var r = 0; r < copyRows.length; r++) {
      var rowLabel = copyRows[r].querySelector('th .row-header-label');
      if (!rowLabel) { continue; }
      var labelText = '';
      for (var n = 0; n < rowLabel.childNodes.length; n++) {
        if (rowLabel.childNodes[n].nodeType === 3) { labelText += rowLabel.childNodes[n].textContent; }
      }
      if (labelText.replace(/\s+/g, ' ').trim().toLowerCase() === 'kategorie') {
        copyRows[r].parentNode.removeChild(copyRows[r]);
      }
    }

    if (paramsCopy.querySelector('tr')) {

      var paramsBox = document.createElement('div');
      paramsBox.className = 'kps-top-params';
      paramsBox.appendChild(paramsCopy);
      topParamsPrice.parentNode.insertBefore(paramsBox, topParamsPrice);

      /* Nápověda (?) – stejný Bootstrap tooltip, jaký používá Shoptet */
      var tips = paramsCopy.querySelectorAll('.show-tooltip');
      for (var t = 0; t < tips.length; t++) {
        if (!tips[t].getAttribute('title') && tips[t].getAttribute('data-original-title')) {
          tips[t].setAttribute('title', tips[t].getAttribute('data-original-title'));
        }
        tips[t].removeAttribute('aria-describedby');
      }
      if (tips.length && window.jQuery && window.jQuery.fn.tooltip) {
        window.jQuery(tips).tooltip({ html: true, placement: 'auto', container: 'body' });
      }

    }

  }

}

/* Spustit po načtení DOM – i když se skript načte až po DOMContentLoaded */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
