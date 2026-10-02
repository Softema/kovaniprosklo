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


    /* POPISNÉ PARAMETRY (výhradně z #description) */
    var parametersTable = document.querySelector(
      '#description .extended-description .detail-parameters'
    );


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

      /* PARAMETRY – max 3, bez Kategorie/Hmotnost */
      var parametersWrapper = document.createElement('div');
      parametersWrapper.className = 'product-top-parameters';

      var shownParameters = 0;
      var EXCLUDED_LABELS = ['kategorie', 'hmotnost'];

      if (parametersTable) {
        var rows = parametersTable.querySelectorAll('tbody tr');
        for (var j = 0; j < rows.length && shownParameters < 3; j++) {
          var row = rows[j];
          var labelElement = row.querySelector('th .row-header-label');
          var valueElement = row.querySelector('td');
          if (!labelElement || !valueElement) { continue; }

          var label = labelElement.textContent.replace(/\s+/g, ' ').replace(/:\s*$/, '').trim();
          var value = valueElement.textContent.replace(/\s+/g, ' ').trim();
          if (!label || !value) { continue; }
          if (EXCLUDED_LABELS.indexOf(label.toLowerCase()) !== -1) { continue; }

          var parameter = document.createElement('div');
          parameter.className = 'product-top-parameter';

          var parameterLabel = document.createElement('span');
          parameterLabel.className = 'product-top-parameter-label';
          parameterLabel.textContent = label + ': ';

          var parameterValue = document.createElement('span');
          parameterValue.className = 'product-top-parameter-value';
          parameterValue.textContent = value;

          parameter.appendChild(parameterLabel);
          parameter.appendChild(parameterValue);
          parametersWrapper.appendChild(parameter);
          shownParameters++;
        }
      }

      if (shownParameters > 0) {
        summary.appendChild(parametersWrapper);
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

}

/* Spustit po načtení DOM – i když se skript načte až po DOMContentLoaded */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
