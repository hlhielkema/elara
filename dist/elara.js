!function(t){var e={};function n(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(i,o,function(e){return t[e]}.bind(null,o));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=5)}([function(t,e,n){},function(t,e,n){},function(t,e,n){},function(t,e,n){},function(t,e,n){},function(t,e,n){"use strict";n.r(e);n(0);const i={};var o={createSvgElement:function(t,e,n){const o=`${t};${e}x${n}`;if(void 0===i[o]){const s=document.createElement("div");return fetch(t).then(t=>t.text()).then(t=>{const r=document.createElement("div");r.innerHTML=t;const l=r.querySelector("svg");l.removeAttribute("xmlns:a"),l.setAttribute("width",e+"px"),l.setAttribute("height",n+"px"),s.parentNode.replaceChild(l,s),i[o]=l}),s}return i[o].cloneNode(!0)}};function s(){this.taskbarElement=null,this.windowManager=null}s.prototype.bind=function(t,e){this.taskbarElement=document.querySelector(t),this.taskbarElement.innerHTML="",this.windowManager=e;const n=document.createElement("div");n.classList.add("elara-windows"),this.taskbarElement.appendChild(n);const i=this,o=function(){i.update()};this.windowManager.windowSetCollection.events.selectedChanged.subscribe(o),this.windowManager.windowSetCollection.events.added.subscribe((t,e)=>{e.events.focusChanged.subscribe(o),e.events.changed.subscribe(o)}),this.windowManager.windowSetCollection.events.removed.subscribe((t,e)=>{e.events.focusChanged.unsubscribe(o),e.events.changed.unsubscribe(o)});for(let t=0;t<this.windowManager.windowSetCollection.count();t++){const e=this.windowManager.windowSetCollection.getAt(t);e.events.focusChanged.subscribe(o),e.events.changed.subscribe(o)}},s.prototype.update=function(){const t=this.taskbarElement.querySelector(".elara-windows");t.innerHTML="";const e=this.windowManager.getActiveControllerSet().getOrdered();for(let n=0;n<e.length;n++){const i=e[n],s=document.createElement("div"),r=document.createElement("span");s.className="elara-window-button",r.innerText=i.getTitle();const l=o.createSvgElement(i.getIcon(),16,16);s.appendChild(l),s.appendChild(r),t.appendChild(s),i.state.focus&&s.classList.add("window-focus"),s.addEventListener("click",()=>{i.focusFromTaskbar()})}};var r=s,l=(n(1),r);function a(t,e,n){this.parent=t,this.title=e,this.height=n,this.drawerButton=null,this.drawer=null}a.prototype.construct=function(){const t=document.createElement("div"),e=document.createElement("div"),n=document.createElement("div");t.className="elara-drawer-button",e.className="elara-button",n.className="elara-drawer",e.innerText=this.title,t.appendChild(e),t.appendChild(n),this.drawerButton=t,this.drawer=n,null!==this.height&&void 0!==this.height&&(n.style.height=this.height);const i=this;return e.addEventListener("click",()=>{i.open()}),t},a.prototype.open=function(){this.drawerButton.classList.contains("opened")?this.close():(this.parent.closeAll(),null!==this.openCallback&&this.openCallback(this.drawer),this.drawerButton.classList.add("opened"))},a.prototype.close=function(){this.drawerButton.classList.contains("opened")&&this.drawerButton.classList.remove("opened")},a.prototype.bind=function(t){this.openCallback=t};var c=a;function h(t,e,n){this.parent=t,this.title=e,this.items=n,this.dropdownButton=null}h.prototype.construct=function(){const t=document.createElement("div"),e=document.createElement("div"),n=document.createElement("div");t.className="elara-dropdown-button",e.className="elara-button",n.className="elara-dropdown-items",e.innerText=this.title,t.appendChild(e),t.appendChild(n),this.dropdownButton=t;const i=this;return e.addEventListener("click",()=>{i.open()}),t},h.prototype.constructButton=function(t){const e=this,n=document.createElement("div"),i=document.createElement("div");if(n.className="elara-menu-button",i.className="elara-menu-button-label",i.innerText=t.title,void 0!==t.icon){const e=document.createElement("div");e.className="elara-button-icon-container",e.appendChild(o.createSvgElement(t.icon,16,16)),n.appendChild(e)}return n.appendChild(i),n.addEventListener("click",()=>{!0!==t.click()&&e.close()}),n},h.prototype.open=function(){if(this.dropdownButton.classList.contains("opened"))this.close();else{this.parent.closeAll(),this.dropdownButton.classList.add("opened");const t=this.dropdownButton.querySelector(".elara-dropdown-items");for(let e=0;e<this.items.length;e++)t.appendChild(this.constructButton(this.items[e]))}},h.prototype.close=function(){if(this.dropdownButton.classList.contains("opened")){const t=this.dropdownButton.querySelectorAll(".elara-dropdown-items");for(let e=0;e<t.length;e++)t[e].innerHTML="";this.dropdownButton.classList.remove("opened")}},h.prototype.updateItems=function(t){this.items=t};var d=h;function u(){}u.prototype.construct=function(){const t=document.createElement("div");return t.className="elara-seperator",t},u.prototype.close=function(){};var p=u;function w(){this.toolbarElement=null,this.items=[],this.autoUpdate=!0,this.pendingConstruct=!1,this.imageBasePath="img/menu"}w.prototype.suspendLayout=function(){this.autoUpdate=!1},w.prototype.resumeLayout=function(){this.autoUpdate=!0,this.pendingConstruct&&this.construct()},w.prototype.constructIfEnabled=function(){this.autoUpdate?this.construct():this.pendingConstruct=!0},w.prototype.bind=function(t){this.toolbarElement=document.querySelector(t),this.toolbarElement.innerHTML="";const e=document.createElement("div");e.classList.add("elara-toolbar-buttons"),this.toolbarElement.appendChild(e)},w.prototype.construct=function(){this.pendingConstruct=!1;const t=this.toolbarElement.querySelector(".elara-toolbar-buttons");t.innerHTML="";for(let e=0;e<this.items.length;e++){const n=this.items[e].construct();if(Array.isArray(n))for(let e=0;e<n.length;e++)t.appendChild(n[e]);else null!=n&&t.appendChild(n)}},w.prototype.closeAll=function(){for(let t=0;t<this.items.length;t++)this.items[t].close()},w.prototype.addSeperator=function(){this.items.push(new p),this.constructIfEnabled()},w.prototype.addDropDownMenu=function(t,e){const n=new d(this,t,e);return this.items.push(n),this.constructIfEnabled(),n},w.prototype.addDrawer=function(t,e){const n=new c(this,t,e);return this.items.push(n),this.constructIfEnabled(),n},w.prototype.addWindowsMenu=function(t){const e=this.createWindowsMenuItems(t),n=this.addDropDownMenu("Windows",e),i=this,o=function(){n.updateItems(i.createWindowsMenuItems(t)),i.constructIfEnabled()};t.windowSetCollection.events.added.subscribe(o),t.windowSetCollection.events.removed.subscribe(o)},w.prototype.createWindowsMenuItems=function(t){const e=[];function n(e){return function(){t.getActiveControllerSet()[e]()}}const i=t.windowSetCollection.getLayouts(this.imageBasePath);for(let t=0;t<i.length;t++){const o=n(i[t].name);e.push({title:i[t].title,icon:i[t].icon,click:()=>(o(),!0)})}e.push({title:"Expose",icon:this.imageBasePath+"/split-windows.svg",click:()=>(t.toggleExpose(),!1)});for(let n=0;n<t.windowSetCollection.count();n++){const i=n;e.push({title:"Workspace "+(n+1),icon:this.imageBasePath+"/workspace.svg",click:()=>(t.windowSetCollection.selectAt(i),!0)})}return e.push({title:"Add workspace",icon:this.imageBasePath+"/add-workspace.svg",click:()=>(t.windowSetCollection.add(),t.windowSetCollection.selectAt(t.windowSetCollection.count()-1),!0)}),e},w.prototype.addWorkspacesDrawer=function(t){const e=this.addDrawer("Workspaces");function n(e,n){const i=t.windowSetCollection.createPreviews(280,180,n);e.innerHTML="";for(let t=0;t<i.length;t++)e.appendChild(i[t])}e.bind(i=>{n(i,(function o(s,r){t.windowSetCollection.selectAt(s),r?e.close():n(i,o)}))})};var m=w,f=(n(2),m);function g(t){this.owner=t,this.subscribers=[]}g.prototype.subscribe=function(t){this.subscribers.push(t)},g.prototype.unsubscribe=function(t){const e=this.subscribers.indexOf(t);-1!==e&&this.subscribers.splice(e,1)},g.prototype.invoke=function(t){for(let e=0;e<this.subscribers.length;e++)this.subscribers[e](this.owner,t)};var y=g;function v(t){const e=this;if(e.value=t,e.unit=null,e.number=null,Number.isInteger(t))e.unit="px",e.number=t;else if(Number(t)===t&&t%1!=0)e.unit="px",e.number=Math.floor(t);else if(t.endsWith("px"))e.unit="px",e.number=+t.substring(0,t.length-2);else{if(!t.endsWith("%"))throw new Error("Invalid value");e.unit="%",e.number=+t.substring(0,t.length-1)}e.raw=function(){return e.value},e.getPx=function(){if("px"===e.unit)return e.number;throw new Error("The value does not have the unit: px.")},e.cssValue=function(){return e.number+e.unit},e.convertToPx=function(t){if("px"===e.unit)return e.number;if("%"===e.unit)return e.number*t/100;throw new Error("Invalid value")}}function b(t,e){this.x=t,this.y=e}function x(t,e,n){this.x=t,this.y=e,this.z=n}function C(t){this.parent=t,this.controllers=[],this.orderedControllers=[],this.focus=null,this.exposeActive=!1,this.events={changed:new y(this),focusChanged:new y(this)}}C.prototype.add=function(t){this.controllers.push(t),this.orderedControllers.push(t);const e=this;t.events.closed.subscribe(()=>{e.remove(t),e.events.changed.invoke()}),t.events.focus.subscribe(()=>{e.quitExpose(),e.setFocus(t)}),t.events.lostFocus.subscribe(()=>{e.resetFocus()}),this.events.changed.invoke()},C.prototype.get=function(t){const e=+t;for(let t=0;t<this.controllers.length;t++)if(this.controllers[t].getId()===e)return this.controllers[t];return null},C.prototype.stash=function(){for(let t=0;t<this.controllers.length;t++)this.controllers[t].stash();this.quitExpose()},C.prototype.resume=function(){for(let t=0;t<this.controllers.length;t++)this.controllers[t].resume()},C.prototype.remove=function(t){const e=this.controllers.indexOf(t);if(-1===e)throw new Error("Window controller not found.");const n=this.orderedControllers.indexOf(t);if(-1===n)throw new Error("Window controller not found.");this.controllers.splice(e,1),this.orderedControllers.splice(n,1),this.events.changed.invoke()},C.prototype.getOrdered=function(){return this.orderedControllers},C.prototype.getMaximumForPositionZ=function(){let t=-1;for(let e=0;e<this.controllers.length;e++){const n=this.controllers[e].position.z;n>t&&(t=n)}return t},C.prototype.setFocus=function(t){this.focus=t,this.controllers.sort((e,n)=>e===t?1:n===t?-1:e.position.z-n.position.z);for(let t=0;t<this.controllers.length;t++)this.controllers[t].position.z=new v(t),this.controllers[t].applyDimensions();let e=!1;for(let t=0;t<this.controllers.length;t++)this.controllers[t].state.focus&&(this.controllers[t].setFocus(!1),e=!0);t.state.focus||(t.setFocus(!0),e=!0),e&&this.events.focusChanged.invoke()},C.prototype.resetFocus=function(){this.focus=null;let t=!1;for(let e=0;e<this.controllers.length;e++)this.controllers[e].state.focus&&(this.controllers[e].setFocus(!1),t=!0);t&&this.events.focusChanged.invoke()},C.prototype.getCurrentFocus=function(){return this.focus},C.prototype.exportDimensions=function(){const t=[];for(let e=0;e<this.controllers.length;e++){const n=this.controllers[e];t.push({id:n.id,title:n.title,x:n.position.x,y:n.position.y,width:n.size.x,height:n.size.y})}return t},C.prototype.createPreview=function(t,e,n,i,o){const s=function(t,e,n){if("px"===t.unit)return Math.round(t.number/e*n)+"px";if("%"===t.unit)return Math.round(t.number/100*n)+"px";throw new Error("Not supported")},r=document.createElement("div"),l=document.createElement("div");r.classList.add("elera-window-set-preview"),l.classList.add("title-overlay"),r.style.width=e+"px",r.style.height=n+"px",l.innerText=t;for(let t=0;t<this.controllers.length;t++){const l=this.controllers[t],a=document.createElement("div");a.classList.add("window"),a.style.left=s(l.position.x,i,e),a.style.top=s(l.position.y,o,n),a.style.width=s(l.size.x,i,e),a.style.height=s(l.size.y,o,n),r.appendChild(a)}return r.appendChild(l),r},C.prototype.cascade=function(){for(let t=0;t<this.controllers.length;t++)this.controllers[t].show(),this.controllers[t].move(100+50*t,100+50*t)},C.prototype.minimizeAll=function(){for(let t=0;t<this.controllers.length;t++)this.controllers[t].minimize()},C.prototype.showAll=function(){for(let t=0;t<this.controllers.length;t++)this.controllers[t].show()},C.prototype.maximizeAll=function(){for(let t=0;t<this.controllers.length;t++)this.controllers[t].show(),this.controllers[t].maximize()},C.prototype.split=function(){for(let t=0;t<this.controllers.length;t++)this.controllers[t].show();const t=this.controllers.length;if(0!==t)if(1===t)this.controllers[0].resize("fullscreen");else if(2===t)this.controllers[0].resize("left"),this.controllers[1].resize("right");else if(3===t)this.controllers[0].resize("top-left"),this.controllers[1].resize("top-right"),this.controllers[2].resize("bottom");else if(t>3){const e=this.controllers.reverse();e[0].resize("top-left"),e[1].resize("top-right"),e[2].resize("bottom-left"),e[3].resize("bottom-right");for(let n=4;n<t;n++)e[n].hide()}},C.prototype.toggleExpose=function(){this.exposeActive?this.quitExpose():this.expose()},C.prototype.expose=function(){if(!this.exposeActive&&this.controllers.length>0){const t=this.parent.parent.getWindowContainerRect(),e=Math.floor((t.width-64)/400);for(let t=0;t<this.controllers.length;t++)this.controllers[t].expose(t,e);this.exposeActive=!0}},C.prototype.quitExpose=function(){if(this.exposeActive){for(let t=0;t<this.controllers.length;t++)this.controllers[t].quitExpose();this.exposeActive=!1}};var E=C;function z(t){this.parent=t,this.sets=[],this.selected=null,this.events={selectedChanged:new y(this),added:new y(this),removed:new y(this)}}z.prototype.getSelected=function(){return this.selected},z.prototype.getAt=function(t){return this.sets[t]},z.prototype.add=function(){const t=new E(this);this.sets.push(t),this.events.added.invoke(t)},z.prototype.select=function(t){if(-1===this.sets.indexOf(t))throw new Error("Set not found");null!==this.selected&&this.selected.stash(),this.selected=t,this.selected.resume(),this.events.selectedChanged.invoke()},z.prototype.selectAt=function(t){null!==this.selected&&this.selected.stash(),this.selected=this.sets[t],this.selected.resume(),this.events.selectedChanged.invoke()},z.prototype.count=function(){return this.sets.length},z.prototype.exportDimensions=function(){const t=[];for(let e=0;e<this.sets.length;e++){const n=this.sets[e];t.push({index:e,selected:this.selected===n,windows:n.exportDimensions()})}return t},z.prototype.createPreviews=function(t,e,n){const i=function(t,e){return function(){n(t,e)}},{width:o,height:s}=this.parent.getWindowContainerRect(),r=[];for(let n=0;n<this.sets.length;n++){const l=""+(n+1),a=this.sets[n].createPreview(l,t,e,o,s);a.addEventListener("click",i(n,!1)),a.addEventListener("dblclick",i(n,!0)),this.sets[n]===this.selected&&a.classList.add("selected"),r.push(a)}return r},z.prototype.getLayouts=function(t){return[{title:"Cascade Windows",name:"cascade",icon:t+"/cascade.svg"},{title:"Split Windows",name:"split",icon:t+"/pause.svg"},{title:"Maximize All Windows",name:"maximizeAll",icon:t+"/maximize.svg"},{title:"Minimize All Windows",name:"minimizeAll",icon:t+"/minimize.svg"},{title:"Show All Windows",name:"showAll",icon:t+"/show-all.svg"}]};var S=z;function M(t,e){this.target=t.target,this.initialPageX=t.pageX,this.initialPageY=t.pageY,this.first=!0,this.transform=e.transform}M.prototype.setInitialPosition=function(t,e){this.initialX=t,this.initialY=e},M.prototype.setInitialSize=function(t,e){this.initialWidth=t,this.initialHeight=e},M.prototype.setTransformMode=function(t,e){this.hmode=t,this.vmode=e},M.prototype.setController=function(t){this.controller=t},M.prototype.setInnerTarget=function(t){this.innerTarget=t};var L=M;var A=function(){const t=this;t.session=null,t.start=function(e,n){const i=new L(e,n);return n.init(i),t.session=i,window.addEventListener("mousemove",t.moveHandler,!0),window.addEventListener("mouseup",t.moveUpHandler,!1),e.stopPropagation&&e.stopPropagation(),e.preventDefault&&e.preventDefault(),e.cancelBubble=!0,e.returnValue=!1,!1},t.hasSession=function(){return null!==t.session},t.moveHandler=function(e){const n=e.pageX-t.session.initialPageX,i=e.pageY-t.session.initialPageY;return t.session.transform(t.session,n,i,e.pageX,e.pageY,t.session.first,!1),t.session.first=!1,e.stopPropagation&&e.stopPropagation(),e.preventDefault&&e.preventDefault(),e.cancelBubble=!0,e.returnValue=!1,!1},t.moveUpHandler=function(e){window.removeEventListener("mousemove",t.moveHandler,!0),window.removeEventListener("mouseup",t.moveUpHandler,!1);const n=e.pageX-t.session.initialPageX,i=e.pageY-t.session.initialPageY;t.session.transform(t.session,n,i,e.pageX,e.pageY,t.session.first,!0),t.session=null}};function k(t){this.windowManager=t,this.engine=new A,this.resizeZoneSize=16}k.prototype.onTitlebarGrab=function(t){const e=this;e.engine.start(t,{init(t){t.setInnerTarget(t.target.closest(".elara-window"));const n=t.innerTarget.getAttribute("data-controller-id"),i=e.windowManager.getController(n);t.setController(i);const o=e.windowManager.windowContainer.getBoundingClientRect(),s=t.innerTarget.getBoundingClientRect(),r=s.left-o.left,l=s.top-o.top;t.setInitialPosition(r,l)},transform(t,n,i,o,s,r,l){r&&(e.windowManager.windowContainer.classList.add("window-dragging-active"),t.controller.setMoving(!0),t.controller.focus(),t.innerTarget.style.setProperty("z-index",2e3));const a=t.initialX+n,c=t.initialY+i;if(t.controller.move(a,c),l){if(t.controller.state.allowDocking){const n=e.windowManager.getSuggestedDocking(o,s);null!=n?t.controller.resize(n):t.controller.move(a,c)}else t.controller.move(a,c);e.windowManager.windowContainer.classList.remove("window-dragging-active"),t.controller.setMoving(!1);const n=e.windowManager.windowContainer.getBoundingClientRect();t.controller.ensureBounds(n.width,n.height)}else t.controller.state.relative&&t.controller.setRelative(!1),t.controller.state.allowDocking&&e.windowManager.renderSuggestedDocking(o,s)}})},k.prototype.determineResizeCursor=function(t,e){if("resize"===t&&"resize"===e||"move"===t&&"move"===e)return"nw-resize";if("resize"===t&&"move"===e||"move"===t&&"resize"===e)return"ne-resize";if("none"!==t&&"none"===e)return"e-resize";if("none"===t&&"none"!==e)return"n-resize";throw new Error("invalid input")},k.prototype.determineModes=function(t,e,n,i){const o=this.resizeZoneSize;let s="none",r="none";return t<16?s="move":n-t<o&&(s="resize"),e<o?r="move":i-e<o&&(r="resize"),{hmode:s,vmode:r}},k.prototype.onWindowGrab=function(t){const e=this;e.engine.start(t,{init(n){n.setInnerTarget(n.target.closest(".elara-window"));const i=n.innerTarget.getAttribute("data-controller-id"),o=e.windowManager.getController(i);n.setController(o);const s=e.windowManager.windowContainer.getBoundingClientRect(),r=n.innerTarget.getBoundingClientRect(),l=r.left-s.left,a=r.top-s.top,c=n.controller.size.x.getPx(),h=n.controller.size.y.getPx();n.setInitialPosition(l,a),n.setInitialSize(c,h);const d=t.pageX-r.left,u=t.pageY-r.top,p=r.width,w=r.height,m=e.determineModes(d,u,p,w);n.setTransformMode(m.hmode,m.vmode);const f=e.determineResizeCursor(n.hmode,n.vmode);n.innerTarget.style.setProperty("cursor",f)},transform(t,n,i,o,s,r,l){r&&(e.windowManager.windowContainer.classList.add("window-resize-active"),t.controller.setResizing(!0),t.controller.focus(),t.innerTarget.style.setProperty("z-index",2e3));let a=t.initialX,c=t.initialY,h=t.initialWidth,d=t.initialHeight;"resize"===t.hmode?h+=n:"move"===t.hmode&&(a+=n,h-=n),"resize"===t.vmode?d+=i:"move"===t.vmode&&(c+=i,d-=i),h<0&&(h=0),d<0&&(d=0),t.controller.move(a,c),t.controller.resize(h,d),l&&(t.controller.setResizing(!1),e.windowManager.windowContainer.classList.remove("window-resize-active"))}})},k.prototype.init=function(){const t=this;document.addEventListener("mousedown",e=>{const n=e.target.closest(".elara-window");if(null!=n)if(n.classList.contains("elara-mode-default"))if(e.target.classList.contains("elara-title-bar")||e.target.classList.contains("elara-title"))t.onTitlebarGrab(e);else if(e.target.classList.contains("elara-window")){const n=e.target.getAttribute("data-controller-id");this.windowManager.getController(n).state.allowResizing&&t.onWindowGrab(e)}else{const e=n.getAttribute("data-controller-id");t.windowManager.getController(e).focus()}else if(n.classList.contains("elara-mode-expose")){const e=n.getAttribute("data-controller-id");t.windowManager.getController(e).focus()}}),document.addEventListener("mousemove",e=>{const n=e.target.closest(".elara-window");if(null!=n&&n.classList.contains("elara-mode-default")&&void 0!==e.target.classList&&e.target.classList.contains("elara-window")&&!t.engine.hasSession()){const n=e.target,i=n.getBoundingClientRect(),o=n.getAttribute("data-controller-id");if(this.windowManager.getController(o).state.allowResizing){const o=e.pageX-i.left,s=e.pageY-i.top,r=i.width,l=i.height,a=t.determineModes(o,s,r,l);n.style.cursor=t.determineResizeCursor(a.hmode,a.vmode)}}})};var T=k;function D(){}D.prototype.window=function(){const t=this.titleBar(),e=this.content(),n=document.createElement("div"),i=document.createElement("div"),o=document.createElement("div");return n.className="elara-window",i.className="elara-window-visible",o.className="elara-window-overlay",n.appendChild(i),i.appendChild(t),i.appendChild(e),i.appendChild(o),n},D.prototype.titleBar=function(){const t=document.createElement("div"),e=document.createElement("div"),n=document.createElement("div");t.className="elara-title-bar",e.className="elara-title",n.className="elara-icon-container";const i=this.controlbox();return t.appendChild(n),t.appendChild(e),t.appendChild(i),t},D.prototype.controlbox=function(){const t=document.createElement("div"),e=document.createElement("div"),n=document.createElement("div"),i=document.createElement("div");return t.className="elara-control-button minimize",e.className="elara-control-button maximize",n.className="elara-control-button close",i.className="elara-control-box",i.appendChild(t),i.appendChild(e),i.appendChild(n),i},D.prototype.content=function(){const t=document.createElement("div");return t.className="elara-window-content",t};var R=D;var I={fullscreen:{top:0,left:0,width:"100%",height:"100%"},"top-left":{top:0,left:0,width:"50%",height:"50%"},"top-right":{top:0,left:"50%",width:"50%",height:"50%"},"bottom-left":{top:"50%",left:0,width:"50%",height:"50%"},"bottom-right":{top:"50%",left:"50%",width:"50%",height:"50%"},left:{top:0,left:0,width:"50%",height:"100%"},right:{top:0,left:"50%",width:"50%",height:"100%"},top:{top:0,left:0,width:"100%",height:"50%"},bottom:{top:"50%",left:0,width:"100%",height:"50%"}};function P(t){this.id=t,this.nonRelativeDimensions=null,this.icon=null,this.title=null,this.position=new x(new v(0),new v(0),new v(0)),this.size=new b(new v(0),new v(0)),this.state={mode:"default",hidden:!1,relative:!1,moving:!1,resizing:!1,focus:!1,stashed:!1,allowMinimize:!0,allowMaximize:!0,allowClose:!0,alwaysOnTop:!1,allowDocking:!0,allowResizing:!0,containsIframe:!1},this.windowElement=null,this.events={closed:new y(this),focus:new y(this),lostFocus:new y(this)}}P.prototype.applyDimensions=function(){null!==this.windowElement&&"default"===this.state.mode&&(this.windowElement.style.left=this.position.x.cssValue(),this.windowElement.style.top=this.position.y.cssValue(),this.windowElement.style["z-index"]=this.position.z.raw(),this.windowElement.style.width=this.size.x.cssValue(),this.windowElement.style.height=this.size.y.cssValue())},P.prototype.applyState=function(){const t=this;function e(e,n){e?t.windowElement.classList.contains(n)||t.windowElement.classList.add(n):t.windowElement.classList.contains(n)&&t.windowElement.classList.remove(n)}function n(n,i,o){e(t.state[n]!==o,i)}null!==this.windowElement&&(n("hidden","elara-window-hidden",!1),n("relative","elara-window-relative",!1),n("moving","elara-window-moving",!1),n("resizing","elara-window-resizing",!1),n("focus","elara-window-focus",!1),n("stashed","elara-window-stashed",!1),n("allowMinimize","elara-window-disable-minimize",!0),n("allowMaximize","elara-window-disable-maximize",!0),n("allowClose","elara-window-disable-close",!0),n("alwaysOnTop","elara-window-always-on-top",!1),n("allowResizing","elara-window-resizable",!1),n("containsIframe","elara-iframe-window",!1),e("default"===this.state.mode,"elara-mode-default"),e("expose"===this.state.mode,"elara-mode-expose"))},P.prototype.setRelative=function(t){if(this.state.relative!==t)if(this.state.relative=t,this.applyState(),t){const t=this.position.x.raw(),e=this.position.y.raw(),n=this.size.x.raw(),i=this.size.y.raw();this.setNonRelativeDimensions(t,e,n,i)}else this.restoreNonRelativeDimensions()},P.prototype.show=function(){this.state.hidden=!1,this.applyState()},P.prototype.minimize=function(){this.state.hidden=!0,this.applyState(),this.hasFocus()&&this.events.lostFocus.invoke()},P.prototype.setTitle=function(t){this.title=t,this.windowElement.querySelector(".elara-title").innerText=t},P.prototype.getTitle=function(){return this.title},P.prototype.getContentContainer=function(){return this.windowElement.querySelector(".elara-window-content")},P.prototype.toggleMaximize=function(){this.state.relative?this.setRelative(!1):this.resize("fullscreen")},P.prototype.getId=function(){return this.id},P.prototype.getWindow=function(){return this.windowElement},P.prototype.bindWindowElement=function(t){const e=this;t.querySelector(".elara-control-button.minimize").addEventListener("click",()=>{"default"===e.state.mode&&e.minimize()}),t.querySelector(".elara-control-button.maximize").addEventListener("click",()=>{"default"===e.state.mode&&e.maximize()}),t.querySelector(".elara-control-button.close").addEventListener("click",()=>{"default"===e.state.mode&&e.close()}),t.querySelector(".elara-title-bar").addEventListener("dblclick",()=>{"default"===e.state.mode&&e.state.allowMaximize&&e.toggleMaximize()}),t.setAttribute("data-controller-id",this.getId()),this.windowElement=t,this.applyDimensions(),this.applyState()},P.prototype.maximize=function(){this.resize("fullscreen")},P.prototype.close=function(){this.windowElement.parentElement.removeChild(this.windowElement),this.events.closed.invoke()},P.prototype.getIcon=function(){return this.icon},P.prototype.setIcon=function(t){if(this.icon!==t){this.icon=t;const e=this.windowElement.querySelector(".elara-icon-container");e.innerHTML="",e.appendChild(o.createSvgElement(this.icon,16,16))}},P.prototype.setNonRelativeDimensions=function(t,e,n,i){this.nonRelativeDimensions=null===t?null:{x:t,y:e,width:n,height:i}},P.prototype.restoreNonRelativeSize=function(){null!==this.nonRelativeDimensions&&(this.resize(this.nonRelativeDimensions.width,this.nonRelativeDimensions.height),this.nonRelativeDimensions=null)},P.prototype.restoreNonRelativePosition=function(){null!==this.nonRelativeDimensions&&(this.move(this.nonRelativeDimensions.x,this.nonRelativeDimensions.y),this.nonRelativeDimensions=null)},P.prototype.restoreNonRelativeDimensions=function(){if(null!==this.nonRelativeDimensions){const t=this.nonRelativeDimensions;this.move(t.x,t.y),this.resize(t.width,t.height),this.nonRelativeDimensions=null}},P.prototype.hasFocus=function(){return this.windowElement.classList.contains("elara-window-focus")},P.prototype.focus=function(){this.events.focus.invoke();const t=this.windowElement.querySelector("iframe");null!==t&&t!==document.activeElement&&(t.focus(),t.blur())},P.prototype.focusFromTaskbar=function(){this.hasFocus()?this.minimize():(this.show(),this.focus())},P.prototype.move=function(t,e){this.position.x=new v(t),this.position.y=new v(e),this.state.hidden=!1,this.applyDimensions(),this.applyState()},P.prototype.resize=function(t,e){if("string"==typeof t){const e=t;this.setRelative(!0);const n=I[e];this.position.x=new v(n.left),this.position.y=new v(n.top),this.size.x=new v(n.width),this.size.y=new v(n.height),this.applyDimensions()}else this.size.x=new v(t),this.size.y=new v(e),this.applyDimensions()},P.prototype.ensureBounds=function(t,e){let n=!1;const i=this.position.x.convertToPx(t),o=this.position.y.convertToPx(e),s=this.size.x.convertToPx(t),r=this.size.y.convertToPx(e);i<0?(this.position.x=new v(0),n=!0):i+s>t&&(this.position.x=new v(Math.max(t-s,0)),n=!0),o<0?(this.position.y=new v(0),n=!0):o+40>e&&(this.position.y=new v(Math.max(e-r,0)),n=!0),n&&this.applyDimensions()},P.prototype.stash=function(){this.state.stashed=!0,this.applyState()},P.prototype.resume=function(){this.state.stashed=!1,this.applyState()},P.prototype.setFocus=function(t){this.state.focus!==t&&(this.state.focus=t,this.applyState())},P.prototype.setMoving=function(t){this.state.moving!==t&&(this.state.moving=t,this.applyState())},P.prototype.setResizing=function(t){this.state.resizing!==t&&(this.state.resizing=t,this.applyState())},P.prototype.setAllowMinimize=function(t){this.state.allowMinimize!==t&&(this.state.allowMinimize=t,this.applyState())},P.prototype.setAllowMaximize=function(t){this.state.allowMaximize!==t&&(this.state.allowMaximize=t,this.applyState())},P.prototype.setAllowClose=function(t){this.state.allowClose!==t&&(this.state.allowClose=t,this.applyState())},P.prototype.setAlwaysOnTop=function(t){this.state.alwaysOnTop!==t&&(this.state.alwaysOnTop=t,this.applyState())},P.prototype.setAllowDocking=function(t){this.state.allowDocking!==t&&(this.state.allowDocking=t,this.applyState())},P.prototype.setAllowResizing=function(t){this.state.allowResizing!==t&&(this.state.allowResizing=t,this.applyState())},P.prototype.setContainsIframe=function(t){this.state.containsIframe!==t&&(this.state.containsIframe=t,this.applyState())},P.prototype.setMode=function(t){this.state.mode=t,this.applyDimensions(),this.applyState()},P.prototype.expose=function(t,e){this.setMode("expose"),this.windowElement.style.transform="scale(0.3)";const n=t%e,i=Math.floor(t/e);this.windowElement.style.left=400*n+32+"px",this.windowElement.style.top=220*i+32+"px",this.windowElement.style["z-index"]=0,this.windowElement.style.width="1200px",this.windowElement.style.height="600px"},P.prototype.quitExpose=function(){this.windowElement.style.transform=null,this.setMode("default")};var F=P;var B=[{left:0,right:1,top:0,bottom:1,name:"top-left"},{left:99,right:100,top:0,bottom:1,name:"top-right"},{left:0,right:1,top:99,bottom:100,name:"bottom-left"},{left:99,right:100,top:99,maxY:100,name:"bottom-right"},{left:0,right:100,top:0,bottom:1,name:"fullscreen"},{left:0,right:1,top:0,bottom:100,name:"left"},{left:99,right:100,top:0,bottom:100,name:"right"},{left:0,right:100,top:99,bottom:100,name:"bottom"}];function N(){this.windowContainer=null,this.windowSetCollection=new S(this),this.windowSetCollection.add(),this.windowSetCollection.selectAt(0),this.dragging=new T(this),this.construct=new R,this.pollForIFrameFocusActive=!1;let t=1;this.getNextId=function(){return t+=1,t}}N.prototype.pollForIFrameFocus=function(){if(this.pollForIFrameFocusActive)return;this.pollForIFrameFocusActive=!0;const t=this;setInterval(()=>{if(document.activeElement instanceof HTMLIFrameElement){const e=document.activeElement.dataset.id,n=t.getActiveControllerSet(),i=n.getCurrentFocus();+e!==i.id&&n.get(e).focus()}},100)},N.prototype.bind=function(t){this.windowContainer=document.querySelector(t);const e=document.createElement("div");e.classList.add("window-drag-overlay"),this.windowContainer.appendChild(e),this.dragging.init()},N.prototype.getController=function(t){const e=this.windowSetCollection.count();for(let n=0;n<e;n++){const e=this.windowSetCollection.getAt(n).get(t);if(null!==e)return e}return null},N.prototype.getActiveControllerSet=function(){return this.windowSetCollection.getSelected()},N.prototype.createIFrameWindow=function(t,e){const n=this.createWindow(e),i=n.getContentContainer(),o=document.createElement("iframe");return o.src=t,o.dataset.id=n.id,i.appendChild(o),o.onload=function(){null!==o.contentDocument&&n.setTitle(o.contentDocument.title)},n.iframe=o,n.setContainsIframe(!0),this.pollForIFrameFocus(),n},N.prototype.createWindow=function(t){this.quitExpose();const e=new F(this.getNextId()),n={title:"-",size:{width:600,height:400},location:{x:100,y:100},icon:null,allowMinimize:!0,allowMaximize:!0,allowClose:!0,alwaysOnTop:!1,allowDocking:!0,allowResizing:!0},i=Object.keys(t),o=Object.values(t);for(let t=0;t<i.length;t+=1)n[i[t]]=o[t];const s=this.construct.window();e.bindWindowElement(s),e.move(n.location.x,n.location.y),e.resize(n.size.width,n.size.height),e.setIcon(n.icon),e.setTitle(n.title),e.setAllowMinimize(n.allowMinimize),e.setAllowMaximize(n.allowMaximize),e.setAllowClose(n.allowClose),e.setAlwaysOnTop(n.alwaysOnTop),e.setAllowDocking(n.allowDocking),e.setAllowResizing(n.allowResizing),this.windowContainer.appendChild(s);return this.getActiveControllerSet().add(e),e.focus(),e},N.prototype.getSuggestedDocking=function(t,e){const n=this.windowContainer.getBoundingClientRect();let i=Math.round((t-n.left)/n.width*100),o=Math.round((e-n.top)/n.height*100);i=Math.min(Math.max(i,0),100),o=Math.min(Math.max(o,0),100);const s=B;for(let t=0;t<s.length;t++){const e=s[t];if(i>=e.left&&i<=e.right&&o>=e.top&&o<=e.bottom)return e.name}return null},N.prototype.renderSuggestedDocking=function(t,e){const n=this.getSuggestedDocking(t,e);let i=this.windowContainer.querySelector(".window-drag-overlay .dock-preview");if(null!==n){null===i&&(i=document.createElement("div"),i.classList.add("dock-preview"),i.appendChild(document.createElement("div")),this.windowContainer.querySelector(".window-drag-overlay").appendChild(i)),i.style.display="block";const t=I[n];i.style.top=t.top,i.style.left=t.left,i.style.width=t.width,i.style.height=t.height}else null!==i&&(i.style.display="none")},N.prototype.getWindowContainerRect=function(){return this.windowContainer.getBoundingClientRect()},N.prototype.toggleExpose=function(){this.getActiveControllerSet().toggleExpose()},N.prototype.expose=function(){this.getActiveControllerSet().expose()},N.prototype.quitExpose=function(){this.getActiveControllerSet().quitExpose()};var W=N,q=(n(3),W);function O(t,e){this.parent=t,this.title=e.title,this.image=e.image,this.open=e.open,this.x=0,this.y=0,this.element=null}O.prototype.construct=function(){const t=document.createElement("div"),e=document.createElement("div"),n=document.createElement("div"),i=document.createElement("img");t.classList.add("tile"),e.classList.add("title"),n.classList.add("image-container"),e.innerText=this.title,i.src=this.image,n.appendChild(i),t.appendChild(n),t.appendChild(e),this.element=t,this.applyPosition(),i.addEventListener("dblclick",this.open),e.addEventListener("dblclick",this.open);const o=this;return t.addEventListener("mousedown",t=>{o.startDragDrop(t)}),t},O.prototype.applyPosition=function(){this.element.style.top=this.y+"px",this.element.style.left=this.x+"px"},O.prototype.startDragDrop=function(t){const e=this;this.parent.engine.start(t,{init(t){t.setInitialPosition(e.x,e.y)},transform(t,n,i,o,s,r,l){if(r&&e.element.classList.contains("animate-position")&&e.element.classList.remove("animate-position"),e.x=t.initialX+n,e.y=t.initialY+i,e.applyPosition(),l&&e.parent.settings.grid.enforce){const t=e.parent.translateScreenToGrid(e.x,e.y),n=t.x,i=t.y,o=e.parent.translateGridToScreen(n,i);e.x=o.x,e.y=o.y,e.element.classList.add("animate-position"),e.applyPosition()}}})};var H=O;function Y(){this.selector=null,this.items=[],this.engine=new A,this.settings={grid:{enforce:!0,tile:{height:96,width:96,margin:16}}}}Y.prototype.bind=function(t){this.selector=t},Y.prototype.update=function(t){this.items=[];for(let e=0;e<t.length;e++)this.items.push(new H(this,t[e]));this.autoArrangeItems(),this.construct()},Y.prototype.autoArrangeItems=function(){const t=Math.ceil(Math.sqrt(this.items.length));for(let e=0;e<this.items.length;e++){const n=e%t,i=Math.floor(e/t),o=this.translateGridToScreen(n,i);this.items[e].x=o.x,this.items[e].y=o.y}},Y.prototype.translateGridToScreen=function(t,e){const{grid:n}=this.settings;return{x:(n.tile.width+2*n.tile.margin)*t+n.tile.margin,y:(n.tile.height+2*n.tile.margin)*e+n.tile.margin}},Y.prototype.translateScreenToGrid=function(t,e){const{grid:n}=this.settings;return{x:+Math.round((t-n.tile.margin)/(n.tile.width+2*n.tile.margin)),y:+Math.round((e-n.tile.margin)/(n.tile.height+2*n.tile.margin))}},Y.prototype.construct=function(){const t=document.querySelector(this.selector);t.innerHTML="";for(let e=0;e<this.items.length;e++)t.appendChild(this.items[e].construct())};var X=Y,j=(n(4),X);window.Elara={WindowManager:q,Taskbar:l,Toolbar:f,TileView:j}}]);