var webclient=function(e){function t(t){for(var o,a,i=t[0],c=t[1],l=t[2],p=0,f=[];p<i.length;p++)a=i[p],r[a]&&f.push(r[a][0]),r[a]=0;for(o in c)Object.prototype.hasOwnProperty.call(c,o)&&(e[o]=c[o]);for(s&&s(t);f.length;)f.shift()();return u.push.apply(u,l||[]),n()}function n(){for(var e,t=0;t<u.length;t++){for(var n=u[t],o=!0,i=1;i<n.length;i++){var c=n[i];0!==r[c]&&(o=!1)}o&&(u.splice(t--,1),e=a(a.s=n[0]))}return e}var o={},r={0:0},u=[];function a(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.e=function(e){var t=[],n=r[e];if(0!==n)if(n)t.push(n[2]);else{var o=new Promise(function(t,o){n=r[e]=[t,o]});t.push(n[2]=o);var u,i=document.createElement("script");i.charset="utf-8",i.timeout=120,a.nc&&i.setAttribute("nonce",a.nc),i.src=function(e){return a.p+""+({}[e]||e)+".bundle.eec081fc01619eb6a981.js"}(e),u=function(t){i.onerror=i.onload=null,clearTimeout(c);var n=r[e];if(0!==n){if(n){var o=t&&("load"===t.type?"missing":t.type),u=t&&t.target&&t.target.src,a=new Error("Loading chunk "+e+" failed.\n("+o+": "+u+")");a.type=o,a.request=u,n[1](a)}r[e]=void 0}};var c=setTimeout(function(){u({type:"timeout",target:i})},12e4);i.onerror=i.onload=u,document.head.appendChild(i)}return Promise.all(t)},a.m=e,a.c=o,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)a.d(n,o,function(t){return e[t]}.bind(null,o));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="/Explorer/",a.oe=function(e){throw console.error(e),e};var i=window.webpackJsonpwebclient=window.webpackJsonpwebclient||[],c=i.push.bind(i);i.push=t,i=i.slice();for(var l=0;l<i.length;l++)t(i[l]);var s=c;return u.push([270,1]),n()}({268:function(e,t){},270:function(e,t,n){"use strict";n.r(t),n.d(t,"main",function(){return c}),n(271);var o=n(4),r=n(116),u=n(278).default,a=n(73).IntlProvider,i=n(770).loadLocale;function c(e){r.render(o.createElement(a,{loadLocale:i,locale:"it"},o.createElement(u,null)),e)}n(771),n(772)},271:function(e,t,n){n(272).polyfill(),n(273)},278:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(279);t.default=o.default},279:function(e,t,n){"use strict";var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}();Object.defineProperty(t,"__esModule",{value:!0});var r=n(4),u=n(117),a=n(706),i=n(71),c=n(727),l=n(744),s=n(265),p=u.declareQueries({routes:a.routes}),f=function(e){function t(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var e=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments));return e.state={selectedRoute:s.none,hoveredRoute:s.none},e.onRouteSelect=function(t){e.setState({selectedRoute:e.state.selectedRoute.isSome()&&e.state.selectedRoute.value===t?s.none:s.some(t)})},e.onRouteHover=function(t){e.setState({hoveredRoute:t})},e}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,r.Component),o(t,[{key:"render",value:function(){return this.props.routes.ready?r.createElement(i.default,{className:"app",height:"100%"},r.createElement(l.default,{routes:this.props.routes.value,onRouteClick:this.onRouteSelect,selectedRoute:this.state.selectedRoute}),r.createElement(c.default,{routes:this.props.routes.value,selectedRoute:this.state.selectedRoute,hoveredRoute:this.state.hoveredRoute,onRouteHover:this.onRouteHover,onRouteSelect:this.onRouteSelect})):null}}]),t}();t.default=p(f)},706:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){for(var n in e)t.hasOwnProperty(n)||(t[n]=e[n])}(n(707))},707:function(e,t,n){"use strict";var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e};Object.defineProperty(t,"__esModule",{value:!0});var r=n(117);t.location=r.location;var u=n(708),a=n(710),i=n(711),c=n(717);t.currentView=r.Query({params:{},dependencies:{location:r.location},fetch:function(e){var t=e.location;return Promise.resolve(a.locationToView(t))}}),t.routes=r.Query({cacheStrategy:r.available,params:{},fetch:function(){return u.getRoutes().then(function(e){return e.map(function(e){return o({id:e.properties.url},e,{properties:o({},e.properties,{color:i(e.properties.name),length:(c(e.geometry)/1e3).toFixed(1),elevationGain:Math.round(function(e){return e.reduce(function(t,n,o){var r=o>0?e[o-1][2]:void 0,u=n[2];return u&&r&&u>r?t+u-r:t},0)}(e.geometry.coordinates))})})})})}})},708:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){for(var n in e)t.hasOwnProperty(n)||(t[n]=e[n])}(n(709))},709:function(e,t,n){"use strict";var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e};Object.defineProperty(t,"__esModule",{value:!0});var r=n(126);function u(e){var t=e.filter(function(e){return"dir"===e.type});if(t.length>0)return Promise.all(t.map(function(e){return fetch(e.url).then(function(e){return e.json()})})).then(r).then(u);var n=e.filter(function(e){return"file"===e.type&&e.name.includes(".geojson")});return Promise.all(n.map(function(e){return fetch(e.download_url).then(function(e){return e.json()}).then(function(t){return o({},t,{features:[o({},t.features[0],{properties:o({},t.features[0].properties,{url:e.html_url})})]})})}))}t.getRoutes=function(){return fetch("https://api.github.com/repos/BikeRoutes/Milano/contents").then(function(e){return e.json()}).then(u).then(function(e){return e.map(function(e){return e.features[0]})})}},71:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(718);t.default=o.default},710:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.locationToView=function(e){switch(e.pathname){case"/hello":return"hello";default:return"home"}},t.viewToLocation=function(e){switch(e){case"hello":return{pathname:"/hello",search:{}};default:return{pathname:"/",search:{}}}}},718:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(719);t.default=o.default},727:function(e,t,n){"use strict";var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}();Object.defineProperty(t,"__esModule",{value:!0});var r=n(4),u=n(728),a=n(116),i=n(730),c=n(734),l=n(735),s=n(737),p=n(71),f=n(265);n(743);var d=n(23),m={closeButton:!1,closeOnClick:!0,offset:[0,-40],anchor:"bottom"},h=function(e){function t(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var e=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments));return e.map=f.none,e.popupSelectedRoute=new c.Popup(m),e.popupHoveredRoute=new c.Popup(m),e.onMouseMove=i(function(t){e.map.map(function(n){var o=e.props.routes.reduce(function(e,o){var r=o.geometry.coordinates.reduce(function(e,r){var u=n.project(new c.LngLat(r[0],r[1])),a=n.project(new c.LngLat(t.lngLat.lng,t.lngLat.lat)),i=Math.sqrt(Math.pow(Math.abs(u.x-a.x),2)+Math.pow(Math.abs(u.y-a.y),2));return i<e.distance?{distance:i,route:o}:e},{distance:1/0});return r.distance<e.distance?r:e},{distance:1/0});o.distance<25?e.props.onRouteHover(f.some(o.route)):e.props.onRouteHover(f.none)})},60),e}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,r.PureComponent),o(t,[{key:"initializeMap",value:function(){var e=this;c.accessToken="pk.eyJ1IjoiZnJhbmNlc2NvY2lvcmlhIiwiYSI6ImNqcThyejR6ODA2ZDk0M25rZzZjcGo4ZmcifQ.yRWHQbG1dJjDp43d01bBOw";var t=new c.Map({container:"map",style:"mapbox://styles/francescocioria/cjqi3u6lmame92rmw6aw3uyhm",zoom:11});t.on("load",function(){e.map=f.some(t),e.addLayers(),e.addMarkers(),navigator.geolocation.getCurrentPosition(function(e){t.setCenter(new c.LngLat(e.coords.longitude,e.coords.latitude))})}),t.on("mousemove",this.onMouseMove)}},{key:"getRouteColor",value:function(e){return this.props.selectedRoute.isSome()&&e===this.props.selectedRoute.value||this.props.hoveredRoute.isSome()&&e===this.props.hoveredRoute.value?"#387ddf":e.properties.color}},{key:"addLayers",value:function(){var e=this;this.map.map(function(t){e.props.routes.forEach(function(n){var o={id:n.properties.url,type:"line",source:{type:"geojson",data:n},layout:{"line-join":"round","line-cap":"round"},paint:{"line-width":3,"line-color":e.getRouteColor(n)}};t.on("click",o.id,function(){e.props.onRouteSelect(n)}),t.addLayer(o)})})}},{key:"addMarkers",value:function(){var e=this;this.map.map(function(t){e.props.routes.forEach(function(n){var o=n.geometry.coordinates[0],u=document.createElement("div");a.render(r.createElement(s.default,{onClick:function(){return e.props.onRouteSelect(n)}}),u),new c.Marker({element:u}).setLngLat([o[0],o[1]]).addTo(t)})})}},{key:"updateLayers",value:function(){var e=this;this.map.map(function(t){e.props.routes.forEach(function(n){t.setPaintProperty(n.id,"line-color",e.getRouteColor(n))})})}},{key:"flyToRoute",value:function(e){this.map.map(function(t){var n=e.geometry.coordinates.map(function(e){return new c.LngLatBounds(e,e)}).reduce(function(e,t){return e.extend(t)});t.fitBounds(n,{padding:50})})}},{key:"showPopup",value:function(e,t){this.map.map(function(n){var o=new c.LngLat(e.geometry.coordinates[0][0],e.geometry.coordinates[0][1]);t.setLngLat(o).setHTML(u.renderToString(r.createElement(l.default,{route:e}))).addTo(n)})}},{key:"updateSelectedRoutePopup",value:function(){this.props.selectedRoute.isSome()?this.showPopup(this.props.selectedRoute.value,this.popupSelectedRoute):this.popupSelectedRoute.remove()}},{key:"updateHoveredRoutePopup",value:function(){var e=this.props.hoveredRoute;e.isSome()&&e.value!==this.props.selectedRoute.fold(null,d.identity)?this.showPopup(e.value,this.popupHoveredRoute):this.popupHoveredRoute.remove()}},{key:"componentDidMount",value:function(){this.initializeMap()}},{key:"componentDidUpdate",value:function(e){this.updateLayers(),this.updateSelectedRoutePopup(),this.updateHoveredRoutePopup(),this.props.selectedRoute.isSome()&&(e.selectedRoute.isNone()||e.selectedRoute.value!==this.props.selectedRoute.value)&&this.flyToRoute(this.props.selectedRoute.value)}},{key:"render",value:function(){return r.createElement(p.default,{grow:!0,id:"map"})}}]),t}();t.default=h},735:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(4),r=n(71);n(736),t.default=function(e){return o.createElement(r.default,{className:"popup",column:!0},o.createElement(r.default,{className:"name"},e.route.properties.name),o.createElement(r.default,{className:"distance",vAlignContent:"bottom"},o.createElement("label",null,"Distance")," ",e.route.properties.length," km"),o.createElement(r.default,{className:"elevation",vAlignContent:"bottom"},o.createElement("label",null,"Elevation")," ",e.route.properties.elevationGain," m"))}},736:function(e,t,n){},737:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(4);t.default=function(e){return o.createElement("svg",{height:"41px",width:"27px",viewBox:"0 0 27 41",onClick:e.onClick,className:"marker",style:{cursor:"pointer",marginTop:"-100%"}},o.createElement("g",{fillRule:"nonzero"},o.createElement("g",{transform:"translate(3.0, 29.0)",fill:"#000000"},o.createElement("ellipse",{opacity:"0.04",cx:"10.5",cy:"5.80029008",rx:"10.5",ry:"5.25002273"}),o.createElement("ellipse",{opacity:"0.04",cx:"10.5",cy:"5.80029008",rx:"10.5",ry:"5.25002273"}),o.createElement("ellipse",{opacity:"0.04",cx:"10.5",cy:"5.80029008",rx:"9.5",ry:"4.77275007"}),o.createElement("ellipse",{opacity:"0.04",cx:"10.5",cy:"5.80029008",rx:"8.5",ry:"4.29549936"}),o.createElement("ellipse",{opacity:"0.04",cx:"10.5",cy:"5.80029008",rx:"7.5",ry:"3.81822308"}),o.createElement("ellipse",{opacity:"0.04",cx:"10.5",cy:"5.80029008",rx:"6.5",ry:"3.34094679"}),o.createElement("ellipse",{opacity:"0.04",cx:"10.5",cy:"5.80029008",rx:"5.5",ry:"2.86367051"}),o.createElement("ellipse",{opacity:"0.04",cx:"10.5",cy:"5.80029008",rx:"4.5",ry:"2.38636864"})),o.createElement("g",{fill:"#3FB1CE"},o.createElement("path",{d:"M27,13.5 C27,19.074644 20.250001,27.000002 14.75,34.500002 C14.016665,35.500004 12.983335,35.500004 12.25,34.500002 C6.7499993,27.000002 0,19.222562 0,13.5 C0,6.0441559 6.0441559,0 13.5,0 C20.955844,0 27,6.0441559 27,13.5 Z"})),o.createElement("g",{opacity:"0.25",fill:"#000000"},o.createElement("path",{d:"M13.5,0 C6.0441559,0 0,6.0441559 0,13.5 C0,19.222562 6.7499993,27 12.25,34.5 C13,35.522727 14.016664,35.500004 14.75,34.5 C20.250001,27 27,19.074644 27,13.5 C27,6.0441559 20.955844,0 13.5,0 Z M13.5,1 C20.415404,1 26,6.584596 26,13.5 C26,15.898657 24.495584,19.181431 22.220703,22.738281 C19.945823,26.295132 16.705119,30.142167 13.943359,33.908203 C13.743445,34.180814 13.612715,34.322738 13.5,34.441406 C13.387285,34.322738 13.256555,34.180814 13.056641,33.908203 C10.284481,30.127985 7.4148684,26.314159 5.015625,22.773438 C2.6163816,19.232715 1,15.953538 1,13.5 C1,6.584596 6.584596,1 13.5,1 Z"})),o.createElement("g",{transform:"translate(6.0, 7.0)",fill:"#FFFFFF"}),o.createElement("g",{transform:"translate(8.0, 8.0)"},o.createElement("circle",{fill:"#000000",opacity:"0.25",cx:"5.5",cy:"5.5",r:"5.4999962"}),o.createElement("circle",{fill:"#FFFFFF",cx:"5.5",cy:"5.5",r:"5.4999962"}))))}},744:function(e,t,n){"use strict";var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}();Object.defineProperty(t,"__esModule",{value:!0});var r=n(4),u=n(72),a=n(71);n(745);var i=function(e){return r.createElement(a.default,{className:u("route",{"is-selected":e.isSelected}),column:!0,onClick:e.onClick},r.createElement(a.default,{className:"name"},e.route.properties.name),r.createElement(a.default,{className:"distance",vAlignContent:"bottom"},r.createElement("label",null,"Distance")," ",e.route.properties.length," km"),r.createElement(a.default,{className:"elevation",vAlignContent:"bottom"},r.createElement("label",null,"Elevation")," ",e.route.properties.elevationGain," m"),r.createElement(a.default,{className:"actions"},r.createElement("a",{className:"github-button",href:e.route.properties.url,target:"_blank"},"See on GitHub")))},c=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,r.Component),o(t,[{key:"render",value:function(){var e=this;return r.createElement(a.default,{className:"side-bar",column:!0,shrink:!1},r.createElement("h2",null,"Routes"),this.props.routes.map(function(t,n){return r.createElement(i,{key:n,route:t,onClick:function(){return e.props.onRouteClick(t)},isSelected:e.props.selectedRoute.isSome()&&e.props.selectedRoute.value===t})}))}}]),t}();t.default=c},745:function(e,t,n){},761:function(e,t){},767:function(e,t){},770:function(e,t,n){"use strict";n.r(t),n.d(t,"loadLocale",function(){return r});var o=n(73);function r(e){return new Promise(function(t){switch(e){case"it":return Promise.all([n.e(3),n.e(5)]).then(function(){var r=[n(784),n(785)];Object(o.addLocaleDataAndResolve)(e,t).apply(null,r)}.bind(this)).catch(n.oe);case"en":default:return Promise.all([n.e(2),n.e(4)]).then(function(){var r=[n(786),n(787)];Object(o.addLocaleDataAndResolve)(e,t).apply(null,r)}.bind(this)).catch(n.oe)}})}},771:function(e,t,n){"use strict";n.r(t);var o=n(72),r=n(115),u=n.n(r)()(),a=o({"is-desktop":u.isDesktop,"is-tablet":u.isTablet,"is-phone":u.isPhone}),i=document.documentElement||document.body;i.className=o(i.className,a)},772:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),n(773),n(780),n(782),n(783)},782:function(e,t,n){},783:function(e,t,n){}});
//# sourceMappingURL=main.bundle.eec081fc01619eb6a981.js.map