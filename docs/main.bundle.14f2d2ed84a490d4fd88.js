var webclient=function(e){function t(t){for(var r,u,i=t[0],c=t[1],l=t[2],p=0,f=[];p<i.length;p++)u=i[p],o[u]&&f.push(o[u][0]),o[u]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);for(s&&s(t);f.length;)f.shift()();return a.push.apply(a,l||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],r=!0,i=1;i<n.length;i++){var c=n[i];0!==o[c]&&(r=!1)}r&&(a.splice(t--,1),e=u(u.s=n[0]))}return e}var r={},o={0:0},a=[];function u(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,u),n.l=!0,n.exports}u.e=function(e){var t=[],n=o[e];if(0!==n)if(n)t.push(n[2]);else{var r=new Promise(function(t,r){n=o[e]=[t,r]});t.push(n[2]=r);var a,i=document.createElement("script");i.charset="utf-8",i.timeout=120,u.nc&&i.setAttribute("nonce",u.nc),i.src=function(e){return u.p+""+({}[e]||e)+".bundle.14f2d2ed84a490d4fd88.js"}(e),a=function(t){i.onerror=i.onload=null,clearTimeout(c);var n=o[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src,u=new Error("Loading chunk "+e+" failed.\n("+r+": "+a+")");u.type=r,u.request=a,n[1](u)}o[e]=void 0}};var c=setTimeout(function(){a({type:"timeout",target:i})},12e4);i.onerror=i.onload=a,document.head.appendChild(i)}return Promise.all(t)},u.m=e,u.c=r,u.d=function(e,t,n){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},u.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(u.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)u.d(n,r,function(t){return e[t]}.bind(null,r));return n},u.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="/Explorer/",u.oe=function(e){throw console.error(e),e};var i=window.webpackJsonpwebclient=window.webpackJsonpwebclient||[],c=i.push.bind(i);i.push=t,i=i.slice();for(var l=0;l<i.length;l++)t(i[l]);var s=c;return a.push([346,1]),n()}({151:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){for(var n in e)t.hasOwnProperty(n)||(t[n]=e[n])}(n(766))},314:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(52);t.locationToView=function(e){switch(e.search.view){case"details":return{view:"details",routeId:r.fromNullable(e.search.routeId)};default:return{view:"explorer"}}},t.viewToLocation=function(e){switch(e.view){case"details":return{pathname:"/Explorer",search:{view:"details",routeId:e.routeId.getOrElse("")}};case"explorer":return{pathname:"/Explorer",search:{}}}}},316:function(e,t,n){"use strict";var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();Object.defineProperty(t,"__esModule",{value:!0});var a=n(2),u=n(790),i=n(74),c=n(792),l=n(794),s=n(795),p=n(797),f=n(53),d=n(52),m=n(107),h=n(39);n(800);var v=m.default(),y={closeButton:!1,closeOnClick:!0,offset:[0,-40],anchor:"bottom"};t.getRouteDistanceInPixels=function(e,t,n){return e.geometry.coordinates.reduce(function(e,r){var o=n.project(new l.LngLat(t.lng,t.lat)),a=n.project(new l.LngLat(r[0],r[1])),u=Math.sqrt(Math.pow(Math.abs(o.x-a.x),2)+Math.pow(Math.abs(o.y-a.y),2));return u<e?u:e},1/0)};var b=function(e){function n(){!function(e,t){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this);var e=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(n.__proto__||Object.getPrototypeOf(n)).apply(this,arguments));return e.map=d.none,e.popupSelectedRoute=new l.Popup(y),e.popupHoveredRoute=new l.Popup(y),e.onMouseMove=c(function(n){e.map.map(function(r){var o=e.props.routes.reduce(function(e,o){var a=t.getRouteDistanceInPixels(o,n.lngLat,r);return a<e.distance?{distance:a,route:o}:e},{distance:1/0});o.distance<25?e.props.onRouteHover(d.some(o.route)):e.props.onRouteHover(d.none)})},60),e}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(n,a.PureComponent),o(n,[{key:"initializeMap",value:function(){var e=this;l.accessToken="pk.eyJ1IjoiZnJhbmNlc2NvY2lvcmlhIiwiYSI6ImNqcThyejR6ODA2ZDk0M25rZzZjcGo4ZmcifQ.yRWHQbG1dJjDp43d01bBOw";var t=new l.Map({container:"map",style:"mapbox://styles/francescocioria/cjqi3u6lmame92rmw6aw3uyhm",zoom:11});t.on("load",function(){e.map=d.some(t),e.addLayers(),e.addMarkers(),"userLocation"===e.props.startPosition&&document.querySelector(".mapboxgl-ctrl-geolocate").click(),"firstRoute"===e.props.startPosition&&e.props.routes.length>0&&e.flyToRoute(e.props.routes[0],{animate:!1,padding:80})}),v.isDesktop&&t.on("mousemove",this.onMouseMove),t.on("moveend",function(){return e.props.innerRef(e.map)}),t.addControl(new l.FullscreenControl),t.addControl(new l.GeolocateControl({positionOptions:{enableHighAccuracy:!0},trackUserLocation:!0,showUserLocation:!0,fitBoundsOptions:{maxZoom:"firstRoute"===this.props.startPosition?15:11}})),t.addControl(new l.NavigationControl({showZoom:v.isDesktop,showCompass:!v.isDesktop}))}},{key:"getRouteColor",value:function(e){return this.props.selectedRoute.isSome()&&e===this.props.selectedRoute.value||this.props.hoveredRoute.isSome()&&e===this.props.hoveredRoute.value?"#387ddf":e.properties.color}},{key:"addLayers",value:function(){var e=this;this.map.map(function(t){e.props.routes.forEach(function(n){var r={id:n.properties.url,type:"line",source:{type:"geojson",data:n},layout:{"line-join":"round","line-cap":"round"},paint:{"line-width":3,"line-color":e.getRouteColor(n)}};t.on("click",r.id,function(){e.props.onRouteSelect(n)}),t.addLayer(r)})})}},{key:"addMarkers",value:function(){var e=this;this.map.map(function(t){e.props.routes.forEach(function(n){var r=n.geometry.coordinates[0],o=document.createElement("div");i.render(a.createElement(p.default,{onClick:function(){return e.props.onRouteSelect(n)}}),o),new l.Marker({element:o}).setLngLat([r[0],r[1]]).addTo(t)})})}},{key:"updateLayers",value:function(){var e=this;this.map.map(function(t){e.props.routes.forEach(function(n){t.setPaintProperty(n.id,"line-color",e.getRouteColor(n))})})}},{key:"flyToRoute",value:function(e,t){this.map.map(function(n){var o=e.geometry.coordinates.map(function(e){return new l.LngLatBounds(e,e)}).reduce(function(e,t){return e.extend(t)});n.fitBounds(o,r({padding:50},t))})}},{key:"showPopup",value:function(e,t){this.map.map(function(n){var r=new l.LngLat(e.geometry.coordinates[0][0],e.geometry.coordinates[0][1]);t.setLngLat(r).setHTML(u.renderToString(a.createElement(s.default,{route:e}))).addTo(n)})}},{key:"updateSelectedRoutePopup",value:function(){this.props.selectedRoute.isSome()?this.showPopup(this.props.selectedRoute.value,this.popupSelectedRoute):this.popupSelectedRoute.remove()}},{key:"updateHoveredRoutePopup",value:function(){var e=this.props.hoveredRoute;e.isSome()&&e.value!==this.props.selectedRoute.fold(null,h.identity)?this.showPopup(e.value,this.popupHoveredRoute):this.popupHoveredRoute.remove()}},{key:"componentDidMount",value:function(){this.initializeMap(),this.props.innerRef(this.map)}},{key:"componentDidUpdate",value:function(e){this.updateLayers(),this.updateSelectedRoutePopup(),this.updateHoveredRoutePopup(),this.props.selectedRoute.isSome()&&(e.selectedRoute.isNone()||e.selectedRoute.value!==this.props.selectedRoute.value)&&this.flyToRoute(this.props.selectedRoute.value)}},{key:"render",value:function(){return a.createElement(f.default,{grow:!0,id:"map"})}}]),n}();t.default=b},344:function(e,t){},346:function(e,t,n){"use strict";n.r(t),n.d(t,"main",function(){return c}),n(347);var r=n(2),o=n(74),a=n(354).default,u=n(108).IntlProvider,i=n(952).loadLocale;function c(e){o.render(r.createElement(u,{loadLocale:i,locale:"it"},r.createElement(a,null)),e)}n(953),n(954)},347:function(e,t,n){n(348).polyfill(),n(349)},354:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(355);t.default=r.default},355:function(e,t,n){"use strict";var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();Object.defineProperty(t,"__esModule",{value:!0});var o=n(2),a=n(56),u=n(151),i=n(53),c=n(789),l=n(873),s=a.declareQueries({currentView:u.currentView}),p=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.Component),r(t,[{key:"render",value:function(){return this.props.currentView.ready?o.createElement(i.default,{className:"app",height:"100%"},"explorer"===this.props.currentView.value.view&&o.createElement(c.default,null),"details"===this.props.currentView.value.view&&o.createElement(l.default,null)):null}}]),t}();t.default=s(p)},53:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(781);t.default=r.default},766:function(e,t,n){"use strict";var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};Object.defineProperty(t,"__esModule",{value:!0});var o=n(56);t.location=o.location;var a=n(767),u=n(314),i=n(774),c=n(780),l=n(52);t.currentView=o.Query({params:{},dependencies:{location:o.location},fetch:function(e){var t=e.location;return Promise.resolve(u.locationToView(t))}}),t.routes=o.Query({cacheStrategy:o.available,params:{},fetch:function(){return a.getRoutes().then(function(e){return e.map(function(e){return r({id:e.properties.url},e,{properties:r({},e.properties,{color:i(e.properties.name),length:(c(e.geometry)/1e3).toFixed(1),elevationGain:Math.round(function(e){return e.reduce(function(t,n,r){var o=r>0?e[r-1][2]:void 0,a=n[2];return a&&o&&a>o?t+a-o:t},0)}(e.geometry.coordinates))})})})})}}),t.route=o.Query({params:{},dependencies:{currentView:t.currentView,routes:t.routes},fetch:function(e){var t=e.currentView,n=e.routes;if("details"===t.view&&t.routeId.isSome()){var r=t.routeId.value;return Promise.resolve(l.fromNullable(n.find(function(e){return e.id===r})))}return Promise.resolve(l.none)}}),t.routeReadme=o.Query({params:{},dependencies:{route:t.route},fetch:function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(e){var t=e.route;if(t.isSome()){var n="https://raw.githubusercontent.com/BikeRoutes/BikeRoutes/master/"+/BikeRoutes.+master\/(.+)\/.+$/.exec(t.value.properties.url)[1]+"/README.md";return fetch(n).then(function(e){return e.text()}).then(function(e){return l.some(e)})}return Promise.resolve(l.none)})})},767:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){for(var n in e)t.hasOwnProperty(n)||(t[n]=e[n])}(n(768))},768:function(e,t,n){"use strict";var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};Object.defineProperty(t,"__esModule",{value:!0});var o=n(170);function a(e){var t=e.filter(function(e){return"dir"===e.type});if(t.length>0)return Promise.all(t.map(function(e){return fetch(e.url).then(function(e){return e.json()})})).then(o).then(a);var n=e.filter(function(e){return"file"===e.type&&e.name.includes(".geojson")});return Promise.all(n.map(function(e){return fetch(e.download_url).then(function(e){return e.json()}).then(function(t){return r({},t,{features:[r({},t.features[0],{properties:r({},t.features[0].properties,{url:e.html_url})})]})})}))}t.getRoutes=function(){return fetch("https://api.github.com/repos/BikeRoutes/Milano/contents").then(function(e){return e.json()}).then(a).then(function(e){return e.map(function(e){return e.features[0]})})}},781:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(782);t.default=r.default},789:function(e,t,n){"use strict";var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();Object.defineProperty(t,"__esModule",{value:!0});var o=n(2),a=n(56),u=n(151),i=n(53),c=n(316),l=n(801),s=n(52),p=n(207);n(872);var f=a.declareQueries({routes:u.routes}),d=function(e){function t(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var e=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments));return e.map=s.none,e.state={selectedRoute:s.none,hoveredRoute:s.none},e.onRouteSelect=function(t){e.setState({selectedRoute:e.state.selectedRoute.isSome()&&e.state.selectedRoute.value===t?s.none:s.some(t)})},e.onRouteHover=function(t){e.setState({hoveredRoute:t})},e}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.Component),r(t,[{key:"render",value:function(){var e=this,t=this.props.routes;if(!t.ready)return null;var n=this.map.fold(t.value,function(e){return p(t.value,function(t){return c.getRouteDistanceInPixels(t,e.getCenter(),e)})});return o.createElement(i.default,{className:"explorer",grow:!0},o.createElement(l.default,{routes:n,onRouteClick:this.onRouteSelect,selectedRoute:this.state.selectedRoute}),o.createElement(c.default,{routes:t.value,selectedRoute:this.state.selectedRoute,hoveredRoute:this.state.hoveredRoute,onRouteHover:this.onRouteHover,onRouteSelect:this.onRouteSelect,innerRef:function(t){e.map=t,e.forceUpdate()},startPosition:"userLocation"}))}}]),t}();t.default=f(d)},795:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=n(53);n(796),t.default=function(e){return r.createElement(o.default,{className:"popup",column:!0},r.createElement(o.default,{className:"name"},e.route.properties.name),r.createElement(o.default,{className:"distance",vAlignContent:"bottom"},r.createElement("label",null,"Distance")," ",e.route.properties.length," km"),r.createElement(o.default,{className:"elevation",vAlignContent:"bottom"},r.createElement("label",null,"Elevation")," ",e.route.properties.elevationGain," m"))}},796:function(e,t,n){},797:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2);t.default=function(e){return r.createElement("svg",{height:"41px",width:"27px",viewBox:"0 0 27 41",onClick:e.onClick,className:"marker",style:{cursor:"pointer",marginTop:"-100%"}},r.createElement("g",{fillRule:"nonzero"},r.createElement("g",{transform:"translate(3.0, 29.0)",fill:"#000000"},r.createElement("ellipse",{opacity:"0.04",cx:"10.5",cy:"5.80029008",rx:"10.5",ry:"5.25002273"}),r.createElement("ellipse",{opacity:"0.04",cx:"10.5",cy:"5.80029008",rx:"10.5",ry:"5.25002273"}),r.createElement("ellipse",{opacity:"0.04",cx:"10.5",cy:"5.80029008",rx:"9.5",ry:"4.77275007"}),r.createElement("ellipse",{opacity:"0.04",cx:"10.5",cy:"5.80029008",rx:"8.5",ry:"4.29549936"}),r.createElement("ellipse",{opacity:"0.04",cx:"10.5",cy:"5.80029008",rx:"7.5",ry:"3.81822308"}),r.createElement("ellipse",{opacity:"0.04",cx:"10.5",cy:"5.80029008",rx:"6.5",ry:"3.34094679"}),r.createElement("ellipse",{opacity:"0.04",cx:"10.5",cy:"5.80029008",rx:"5.5",ry:"2.86367051"}),r.createElement("ellipse",{opacity:"0.04",cx:"10.5",cy:"5.80029008",rx:"4.5",ry:"2.38636864"})),r.createElement("g",{fill:"#3FB1CE"},r.createElement("path",{d:"M27,13.5 C27,19.074644 20.250001,27.000002 14.75,34.500002 C14.016665,35.500004 12.983335,35.500004 12.25,34.500002 C6.7499993,27.000002 0,19.222562 0,13.5 C0,6.0441559 6.0441559,0 13.5,0 C20.955844,0 27,6.0441559 27,13.5 Z"})),r.createElement("g",{opacity:"0.25",fill:"#000000"},r.createElement("path",{d:"M13.5,0 C6.0441559,0 0,6.0441559 0,13.5 C0,19.222562 6.7499993,27 12.25,34.5 C13,35.522727 14.016664,35.500004 14.75,34.5 C20.250001,27 27,19.074644 27,13.5 C27,6.0441559 20.955844,0 13.5,0 Z M13.5,1 C20.415404,1 26,6.584596 26,13.5 C26,15.898657 24.495584,19.181431 22.220703,22.738281 C19.945823,26.295132 16.705119,30.142167 13.943359,33.908203 C13.743445,34.180814 13.612715,34.322738 13.5,34.441406 C13.387285,34.322738 13.256555,34.180814 13.056641,33.908203 C10.284481,30.127985 7.4148684,26.314159 5.015625,22.773438 C2.6163816,19.232715 1,15.953538 1,13.5 C1,6.584596 6.584596,1 13.5,1 Z"})),r.createElement("g",{transform:"translate(6.0, 7.0)",fill:"#FFFFFF"}),r.createElement("g",{transform:"translate(8.0, 8.0)"},r.createElement("circle",{fill:"#000000",opacity:"0.25",cx:"5.5",cy:"5.5",r:"5.4999962"}),r.createElement("circle",{fill:"#FFFFFF",cx:"5.5",cy:"5.5",r:"5.4999962"}))))}},801:function(e,t,n){"use strict";var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();Object.defineProperty(t,"__esModule",{value:!0});var o=n(2),a=n(36),u=n(53),i=n(314),c=n(52),l=n(318),s=n(868),p=n(161);n(870),n(871);var f=function(e){return o.createElement(u.default,{className:a("route",{"is-selected":e.isSelected}),column:!0,onClick:e.onClick,shrink:!1},o.createElement(u.default,{className:"name"},e.route.properties.name),o.createElement(u.default,{className:"distance",vAlignContent:"bottom"},o.createElement("label",null,"Distance")," ",e.route.properties.length," km"),o.createElement(u.default,{className:"elevation",vAlignContent:"bottom"},o.createElement("label",null,"Elevation")," ",e.route.properties.elevationGain," m"),o.createElement(u.default,{className:"actions"},o.createElement(l.default,{size:"tiny",label:"Details",onClick:e.onDetailsClick})))},d=p.declareCommands({doUpdateLocation:s.doUpdateLocation}),m=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.Component),r(t,[{key:"render",value:function(){var e=this;return o.createElement(u.default,{className:"side-bar",column:!0,shrink:!1},o.createElement("h2",null,"Routes"),this.props.routes.map(function(t,n){return o.createElement(f,{key:n,route:t,onClick:function(){return e.props.onRouteClick(t)},isSelected:e.props.selectedRoute.isSome()&&e.props.selectedRoute.value===t,onDetailsClick:function(n){n.stopPropagation(),e.props.doUpdateLocation(i.viewToLocation({view:"details",routeId:c.some(t.id)}))}})}))}}]),t}();t.default=d(m)},868:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){for(var n in e)t.hasOwnProperty(n)||(t[n]=e[n])}(n(869))},869:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(56);t.doUpdateLocation=r.doUpdateLocation},870:function(e,t,n){},872:function(e,t,n){},873:function(e,t,n){"use strict";var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=n(2),c=n(56),l=n(151),s=n(53),p=n(316),f=n(874),d=n(52),m=n(318),h=n(926),v=n(927);n(929);var y=function(e){function t(){return o(this,t),a(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return u(t,i.PureComponent),r(t,[{key:"componentDidMount",value:function(){this.forceUpdate()}},{key:"render",value:function(){var e=this,t=document.querySelectorAll(".markdown img"),n=document.querySelector("h1");return i.createElement(s.default,{className:"markdown",hAlignContent:"center",shrink:!1},i.createElement(s.default,{className:"wrapper",grow:!0},i.createElement(s.default,{grow:!0,column:!0,style:{position:"relative"}},i.createElement(s.default,{className:"actions",style:{left:n?n.clientWidth:void 0}},i.createElement(m.default,{flat:!0,size:"tiny",label:"Download GPX",onClick:function(){return function(e){var t=new Blob([v(e)],{type:"text/plain;charset=utf-8"});h.saveAs(t,e.properties.name+".gpx")}(e.props.route)}})),i.createElement("div",{className:"remarkable",dangerouslySetInnerHTML:{__html:b.render(this.props.routeReadme)}}),i.createElement(s.default,{className:"summary"},i.createElement(s.default,{className:"distance",column:!0},i.createElement("span",null,this.props.route.properties.length," km"),i.createElement("label",null,"Distance")),i.createElement(s.default,{className:"elevation",column:!0},i.createElement("span",null,this.props.route.properties.elevationGain," m"),i.createElement("label",null,"Elevation")))),i.createElement(s.default,{className:"images",hAlignContent:"right",shrink:!1},Array.from(t).map(function(e){return i.createElement("img",{key:e.src,src:e.src})}))))}}]),t}(),b=new f({linkify:!0}),w=c.declareQueries({route:l.route,routeReadme:l.routeReadme}),g=function(e){function t(){return o(this,t),a(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return u(t,i.Component),r(t,[{key:"render",value:function(){return!this.props.route.ready||this.props.route.value.isNone()||!this.props.routeReadme.ready||this.props.routeReadme.value.isNone()?null:i.createElement(s.default,{className:"details",height:"100%",grow:!0,column:!0},i.createElement(y,{routeReadme:this.props.routeReadme.value.value,route:this.props.route.value.value}),i.createElement(s.default,{shrink:!1,className:"map-wrapper"},i.createElement(p.default,{routes:[this.props.route.value.value],startPosition:"firstRoute",hoveredRoute:d.none,selectedRoute:d.none,onRouteHover:function(){},onRouteSelect:function(){},innerRef:function(){}})))}}]),t}();t.default=w(g)},929:function(e,t,n){},943:function(e,t){},949:function(e,t){},952:function(e,t,n){"use strict";n.r(t),n.d(t,"loadLocale",function(){return o});var r=n(108);function o(e){return new Promise(function(t){switch(e){case"it":return Promise.all([n.e(3),n.e(5)]).then(function(){var o=[n(966),n(967)];Object(r.addLocaleDataAndResolve)(e,t).apply(null,o)}.bind(this)).catch(n.oe);case"en":default:return Promise.all([n.e(2),n.e(4)]).then(function(){var o=[n(968),n(969)];Object(r.addLocaleDataAndResolve)(e,t).apply(null,o)}.bind(this)).catch(n.oe)}})}},953:function(e,t,n){"use strict";n.r(t);var r=n(36),o=n(107),a=n.n(o)()(),u=r({"is-desktop":a.isDesktop,"is-tablet":a.isTablet,"is-phone":a.isPhone}),i=document.documentElement||document.body;i.className=r(i.className,u)},954:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),n(955),n(962),n(964),n(965)},964:function(e,t,n){},965:function(e,t,n){}});
//# sourceMappingURL=main.bundle.14f2d2ed84a490d4fd88.js.map