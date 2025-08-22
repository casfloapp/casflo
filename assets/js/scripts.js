!(function (MainApp) {
    "use strict";
    
    
    /* =======================================================
      Custom Menu (sidebar/header)
    ========================================================== */
    let menu={
      classes: {
        main: 'menu-side',
        item:'menu-item',
        link:'menu-link',
        toggle: 'menu-toggle',
        sub: 'sub-menu',
        subparent: 'has-sub',
        active: 'is-active',
        current: 'current-page'
      },
    };
    let header_menu={
      classes: {
        main: 'menu-head',
        item:'menu-item',
        link:'menu-link',
        toggle: 'has-toggle',
        sub: 'sub-menu',
        subparent: 'has-sub',
        active: 'active',
        current: 'current-page'
      },
    };
    
    
    MainApp.Menu = {
      load: function(elm,subparent){
        let parent = elm.parentElement;
        if(!parent.classList.contains(subparent)){
          parent.classList.add(subparent);
        }
      },
      toggle: function(elm,active){
        let parent = elm.parentElement;
        let nextelm = elm.nextElementSibling;
        let speed = nextelm.children.length > 5 ? 400 + nextelm.children.length * 10 : 400;
        if(!parent.classList.contains(active)){
          parent.classList.add(active);
          MainApp.SlideDown(nextelm,speed);
        }else{
          parent.classList.remove(active);
          MainApp.SlideUp(nextelm,speed);
        }
      },
      closeSiblings: function(elm,active,subparent,submenu){
        let parent = elm.parentElement;
        let siblings = parent.parentElement.children;
        Array.from(siblings).forEach(item => {
          if(item !== parent){
            item.classList.remove(active);
            if(item.classList.contains(subparent)){
              let subitem = item.querySelectorAll(`.${submenu}`);
              subitem.forEach(child => {
                child.parentElement.classList.remove(active);
                MainApp.SlideUp(child,400);
              })
            }
          }
        });
      }
    }

    //init Menu
    MainApp.Menu.sidebar = function (){
      const elm = document.querySelectorAll(`.${menu.classes.toggle}`);
      let active = menu.classes.active;
      let subparent = menu.classes.subparent;
      let submenu = menu.classes.sub;
      elm?.forEach(item => {
        MainApp.Menu.load(item,subparent);
        item.addEventListener("click", function(e){
          e.preventDefault();
          MainApp.Menu.toggle(item,active);
          MainApp.Menu.closeSiblings(item,active,subparent,submenu);
        });
      })
    };
    MainApp.Menu.header = function (){
      const elm = document.querySelectorAll(`.${header_menu.classes.toggle}`);
      let active = header_menu.classes.active;
      let subparent = header_menu.classes.subparent;
      let submenu = header_menu.classes.sub;
      elm?.forEach(item => {
        MainApp.Menu.load(item,subparent);
        item.addEventListener("click", function(e){
          e.preventDefault();
          if(MainApp.Win.width < MainApp.Break.xl){
            MainApp.Menu.toggle(item,active);
            MainApp.Menu.closeSiblings(item,active,subparent,submenu);
          }
        });
      })
    };


    /* =======================================================
      Custom Sidebar
    ========================================================== */
    MainApp.Sidebar ={
      toggle: function(){
        let toggle = document.querySelectorAll('.sidebar-toggle');
        let target = document.querySelector('.main-sidebar');
        toggle.forEach(item => {
          item.addEventListener("click", function(e){
            e.preventDefault();
            toggle.forEach(item => {
              item.classList.toggle('active');
            })
            target?.classList.toggle('sidebar-visible');
            document.body.classList.toggle('overflow-hidden')
          });
        })
      },

      page_resize: function(){
        let toggle = document.querySelectorAll('.sidebar-toggle');
        let target = document.querySelector('.main-sidebar');
        if(MainApp.Win.width > MainApp.Break.xl2) {
          toggle.forEach(item => {
            item.classList.remove('active');
          })
          target?.classList.remove('sidebar-visible');
          document.body.classList.remove('overflow-hidden');
        }
      }
    }

    MainApp.Sidebar.init = function (){
      MainApp.Sidebar.toggle();
      window.addEventListener('resize', function(){
        MainApp.Sidebar.page_resize();
      });
    }

    /* =======================================================
      Custom Header
    ========================================================== */
    MainApp.Header ={
      toggle: function(){
        let toggle = document.querySelectorAll('.header-toggle');
        let target = document.querySelector('.main-header');
        toggle.forEach(item => {
          item.addEventListener("click", function(e){
            e.preventDefault();
            toggle.forEach(item => {
              item.classList.toggle('active');
            })
            target?.classList.toggle('header-visible');
            document.body.classList.toggle('overflow-hidden')
          });
        })
      },

      page_resize: function(){
        let toggle = document.querySelectorAll('.header-toggle');
        let target = document.querySelector('.main-header');
        if(MainApp.Win.width > MainApp.Break.xl) {
          toggle.forEach(item => {
            item.classList.remove('active');
          })
          target?.classList.remove('header-visible');
          document.body.classList.remove('overflow-hidden');
        }
      }
    }

    MainApp.Header.init = function (){
      MainApp.Header.toggle();
      window.addEventListener('resize', function(){
        MainApp.Header.page_resize();
      });
    }
    
    /* =======================================================
      Add some class to current link
    ========================================================== */
    MainApp.CurrentLink = function(selector, parent, submenu, base, active){
      let menuWrapper = document.querySelector(`.${base}`);
      if (!menuWrapper) return; // <-- PERBAIKAN: Hentikan jika menu tidak ada

      let elm = menuWrapper.querySelectorAll(selector);
      let currentURL = document.location.href,
      removeHash = currentURL.substring(0, (currentURL.indexOf("#") == -1) ? currentURL.length : currentURL.indexOf("#")),
      removeQuery = removeHash.substring(0, (removeHash.indexOf("?") == -1) ? removeHash.length : removeHash.indexOf("?")),
      fileName = removeQuery;
      
      elm.forEach(function(item){
        var selfLink = item.getAttribute('href').split('../').slice(-1)[0];
        if (fileName.endsWith(selfLink)) {
          let parents = MainApp.getParents(item,`.${base}`, parent);
          parents.forEach(parentElemets =>{
            parentElemets.classList.add(...active);
            let subItem = parentElemets.querySelector(`.${submenu}`);
            subItem !== null && (subItem.style.display = "block")
          })
        } else {
          item.parentElement.classList.remove(...active);
        }
      })
    }
    
    MainApp.CurrentLinkApp = function(selector, parent, submenu, base, active){
      let menuWrapper = document.querySelector(`.${base}`);
      if (!menuWrapper) return; // <-- PERBAIKAN: Hentikan jika menu tidak ada

      let elm = menuWrapper.querySelectorAll(selector);
      let currentURL = document.location.href,
      removeHash = currentURL.substring(0, (currentURL.indexOf("#") == -1) ? currentURL.length : currentURL.indexOf("#")),
      fileName = removeHash;
      elm.forEach(function(item){
        var selfLink = item.getAttribute('href').replace('../', '').replace('./', '');
        if (fileName.includes(selfLink)) {
          let parents = MainApp.getParents(item,`.${base}`, parent);
          parents.forEach(parentElemets =>{
            parentElemets.classList.add(...active);
            let subItem = parentElemets.querySelector(`.${submenu}`);
            subItem !== null && (subItem.style.display = "block")
          })
        } else {
          item.parentElement.classList.remove(...active);
        }
      })
    }

    /* ================================================================
      Custom select js (Choices)
    ==================================================================== */
    MainApp.Select = function(selector,options){
      let elm = document.querySelectorAll(selector);
      if( elm.length > 0 ){
        elm.forEach(item => {
          let search = item.dataset.search ? JSON.parse(item.dataset.search) : false;
          let sort = item.dataset.sort ? JSON.parse(item.dataset.sort) : false;
          let cross = item.dataset.cross ? JSON.parse(item.dataset.cross) : true;
          let placeholderValue = item.dataset.placeholder ? item.dataset.placeholder : null;
          const choices = new Choices(item, {
            silent: true,
            allowHTML: false,
            searchEnabled: search,
            placeholder: true,
            placeholderValue: placeholderValue,
            searchPlaceholderValue: '',
            shouldSort: sort,
            removeItemButton: cross,
            itemSelectText: '',
            noResultsText: 'No results',
          });
        })
      }
    }

    /* ================================================================
      AutoChangeInput
    ==================================================================== */
    MainApp.AutoChangeInput = function (selector) {
      let elem = document.querySelectorAll(selector);
      if (elem) {
        elem.forEach(item => {
          item.onkeyup = function(e) {
            var target = e.srcElement;
            var maxLength = parseInt(target.attributes["maxlength"].value, 10);
            var myLength = target.value.length;
            if (myLength >= maxLength) {
                var next = target;
                while (next = next.nextElementSibling) {
                    if (next == null)
                        break;
                    if (next.tagName.toLowerCase() == "input") {
                        next.focus();
                        break;
                    }
                }
            }
            if(e.key === "Backspace"){
              var previous = target;
              while (previous = previous.previousElementSibling) {
                if (previous == null)
                    break;
                if (previous.tagName.toLowerCase() == "input") {
                    previous.focus();
                    break;
                }
              }
            }
          }
        })
      }
    }
    
    /* =======================================================
      Mode Switch
    ========================================================== */
    MainApp.Settings = function () {
        // ... (kode settings Anda tetap sama)
    }

    
    /* =======================================================
      Custom Scripts init 
    ========================================================== */
    MainApp.Custom.init = function () {
      MainApp.Menu.sidebar();
      MainApp.Menu.header();
      MainApp.Sidebar.init();
      MainApp.Header.init();
      MainApp.Select('.js-select');
      MainApp.AutoChangeInput('.js-auto-input-change');
      MainApp.Settings();
      MainApp.CurrentLink(`.${menu.classes.main} .${menu.classes.link}`, menu.classes.item, menu.classes.sub, menu.classes.main, [menu.classes.active, menu.classes.current]);
      MainApp.CurrentLinkApp(`.${header_menu.classes.main} .${header_menu.classes.link}`, header_menu.classes.item, header_menu.classes.sub, header_menu.classes.main, [header_menu.classes.active, header_menu.classes.current]);
    }
    
    // Initial by default
    /////////////////////////////
    MainApp.init = function () {
      MainApp.winLoad(MainApp.Custom.init);
    }
    
    MainApp.init();
    
    return MainApp;
    })(MainApp);
