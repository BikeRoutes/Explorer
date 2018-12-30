var webclient=function(e){function t(t){for(var r,u,i=t[0],c=t[1],l=t[2],f=0,p=[];f<i.length;f++)u=i[f],o[u]&&p.push(o[u][0]),o[u]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);for(s&&s(t);p.length;)p.shift()();return a.push.apply(a,l||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],r=!0,i=1;i<n.length;i++){var c=n[i];0!==o[c]&&(r=!1)}r&&(a.splice(t--,1),e=u(u.s=n[0]))}return e}var r={},o={0:0},a=[];function u(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,u),n.l=!0,n.exports}u.e=function(e){var t=[],n=o[e];if(0!==n)if(n)t.push(n[2]);else{var r=new Promise(function(t,r){n=o[e]=[t,r]});t.push(n[2]=r);var a,i=document.createElement("script");i.charset="utf-8",i.timeout=120,u.nc&&i.setAttribute("nonce",u.nc),i.src=function(e){return u.p+""+({}[e]||e)+".bundle.b8b08f22ee468ce26f11.js"}(e),a=function(t){i.onerror=i.onload=null,clearTimeout(c);var n=o[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src,u=new Error("Loading chunk "+e+" failed.\n("+r+": "+a+")");u.type=r,u.request=a,n[1](u)}o[e]=void 0}};var c=setTimeout(function(){a({type:"timeout",target:i})},12e4);i.onerror=i.onload=a,document.head.appendChild(i)}return Promise.all(t)},u.m=e,u.c=r,u.d=function(e,t,n){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},u.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(u.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)u.d(n,r,function(t){return e[t]}.bind(null,r));return n},u.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="/Explorer/",u.oe=function(e){throw console.error(e),e};var i=window.webpackJsonpwebclient=window.webpackJsonpwebclient||[],c=i.push.bind(i);i.push=t,i=i.slice();for(var l=0;l<i.length;l++)t(i[l]);var s=c;return a.push([269,1]),n()}({267:function(e,t){},269:function(e,t,n){"use strict";n.r(t),n.d(t,"main",function(){return c}),n(270);var r=n(4),o=n(274),a=n(278).default,u=n(73).IntlProvider,i=n(769).loadLocale;function c(e){o.render(r.createElement(u,{loadLocale:i,locale:"it"},r.createElement(a,null)),e)}n(770),n(771)},270:function(e,t,n){n(271).polyfill(),n(272)},278:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(279);t.default=r.default},279:function(e,t,n){"use strict";var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();Object.defineProperty(t,"__esModule",{value:!0});var o=n(4),a=n(116),u=n(706),i=n(71),c=n(727),l=n(743),s=n(264),f=a.declareQueries({routes:u.routes}),p=function(e){function t(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var e=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments));return e.state={selectedRoute:s.none,hoveredRoute:s.none},e.onRouteSelect=function(t){e.setState({selectedRoute:e.state.selectedRoute.isSome()&&e.state.selectedRoute.value===t?s.none:s.some(t)})},e.onRouteHover=function(t){e.setState({hoveredRoute:t})},e}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.Component),r(t,[{key:"render",value:function(){return this.props.routes.ready?o.createElement(i.default,{className:"app",height:"100%"},o.createElement(l.default,{routes:this.props.routes.value,onRouteClick:this.onRouteSelect,selectedRoute:this.state.selectedRoute}),o.createElement(c.default,{routes:this.props.routes.value,selectedRoute:this.state.selectedRoute,hoveredRoute:this.state.hoveredRoute,onRouteHover:this.onRouteHover})):null}}]),t}();t.default=f(p)},706:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){for(var n in e)t.hasOwnProperty(n)||(t[n]=e[n])}(n(707))},707:function(e,t,n){"use strict";var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};Object.defineProperty(t,"__esModule",{value:!0});var o=n(116);t.location=o.location;var a=n(708),u=n(710),i=n(711),c=n(717);t.currentView=o.Query({params:{},dependencies:{location:o.location},fetch:function(e){var t=e.location;return Promise.resolve(u.locationToView(t))}}),t.routes=o.Query({cacheStrategy:o.available,params:{},fetch:function(){return a.getRoutes().then(function(e){return e.map(function(e){var t=e.features[0],n=r({},t,{properties:r({},t.properties,{color:i(t.properties.name),length:(c(t.geometry)/1e3).toFixed(1),elevationGain:Math.round(function(e){return e.reduce(function(t,n,r){var o=r>0?e[r-1][2]:void 0,a=n[2];return a&&o&&a>o?t+a-o:t},0)}(t.geometry.coordinates))})});return r({},e,{features:[n]})})})}})},708:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){for(var n in e)t.hasOwnProperty(n)||(t[n]=e[n])}(n(709))},709:function(e,t,n){"use strict";var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};Object.defineProperty(t,"__esModule",{value:!0});var o=n(125);t.getRoutes=function(){return fetch("https://api.github.com/repos/BikeRoutes/Milano/contents").then(function(e){return e.json()}).then(function(e){var t=e.filter(function(e){return"dir"===e.type});return Promise.all(t.map(function(e){return fetch(e.url).then(function(e){return e.json()})}))}).then(o).then(function(e){return e.filter(function(e){return"file"===e.type&&e.name.includes(".geojson")})}).then(function(e){return Promise.all(e.map(function(e){return fetch(e.download_url).then(function(e){return e.json()}).then(function(t){var n=t.features[0];return r({},t,{features:[r({},n,{properties:r({},n.properties,{url:e.html_url})})]})})}))})}},71:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(718);t.default=r.default},710:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.locationToView=function(e){switch(e.pathname){case"/hello":return"hello";default:return"home"}},t.viewToLocation=function(e){switch(e){case"hello":return{pathname:"/hello",search:{}};default:return{pathname:"/",search:{}}}}},718:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(719);t.default=r.default},727:function(e,t,n){"use strict";var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();Object.defineProperty(t,"__esModule",{value:!0});var o=n(4),a=n(728),u=n(730),i=n(734),c=n(735),l=n(71),s=n(264);n(742);var f=function(e){function t(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var e=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments));return e.popup=i.popup({closeButton:!1}),e.layers=[],e.markers=[],e.onMouseMove=u(function(t){var n=e.props.routes.reduce(function(n,r){var o=r.features[0].geometry.coordinates.reduce(function(n,o){var a=i.latLng(o[1],o[0]),u=e.map.latLngToContainerPoint(i.latLng(o[1],o[0])).distanceTo(e.map.latLngToContainerPoint(t.latlng));return u<n.distance?{distance:u,point:a,route:r}:n},{distance:1/0});return o.distance<n.distance?o:n},{distance:1/0});if(n.distance<25){var r=n.route.features[0].geometry.coordinates[0],u=i.latLng(r[1],r[0]);e.popup.setLatLng(u).setContent(a.renderToString(o.createElement(c.default,{feature:n.route.features[0]}))).openOn(e.map),e.props.onRouteHover(s.some(n.route))}else e.props.onRouteHover(s.none),e.map.closePopup(e.popup)},30),e}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.PureComponent),r(t,[{key:"initializeMap",value:function(){var e=this;this.map=i.map("map",{preferCanvas:!1}),this.tileLayer=i.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",{id:"mapbox.streets",accessToken:"pk.eyJ1IjoiZnJhbmNlc2NvY2lvcmlhIiwiYSI6ImNqcThzMDJrejJ1bzgzeGxjZTZ2aXR0cHMifQ.qzCmhZEf3Ta1YHvAfli3bA"}),this.map.addLayer(this.tileLayer),navigator.geolocation.getCurrentPosition(function(t){e.map.setView(i.latLng(t.coords.latitude,t.coords.longitude),12)})}},{key:"updateMap",value:function(){var e=this;this.layers.forEach(function(e){return e.remove()}),this.markers.forEach(function(e){return e.remove()}),this.layers=this.props.routes.map(function(t){var n=t.features[0],r=e.props.selectedRoute.isSome()&&t===e.props.selectedRoute.value||e.props.hoveredRoute.isSome()&&t===e.props.hoveredRoute.value?"#387ddf":n.properties.color;return i.geoJSON(t,{style:function(){return{color:r}}})}),this.markers=this.layers.map(function(e){var t=e.toGeoJSON().features[0].geometry.coordinates[0];return i.marker([t[1],t[0]],{})}),this.layers.forEach(function(t){return e.map.addLayer(t)}),this.markers.forEach(function(t){return t.addTo(e.map)}),this.map.on("mousemove",this.onMouseMove)}},{key:"componentDidMount",value:function(){this.initializeMap(),this.updateMap()}},{key:"componentDidUpdate",value:function(){this.updateMap()}},{key:"render",value:function(){return o.createElement(l.default,{grow:!0,id:"map"})}}]),t}();t.default=f},735:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(4),o=n(71);n(736),t.default=function(e){return r.createElement(o.default,{className:"popup",column:!0},r.createElement(o.default,{className:"name"},e.feature.properties.name),r.createElement(o.default,{className:"distance",vAlignContent:"bottom"},r.createElement("label",null,"Distance")," ",e.feature.properties.length," km"),r.createElement(o.default,{className:"elevation",vAlignContent:"bottom"},r.createElement("label",null,"Elevation")," ",e.feature.properties.elevationGain," m"))}},736:function(e,t,n){},743:function(e,t,n){"use strict";var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();Object.defineProperty(t,"__esModule",{value:!0});var o=n(4),a=n(72),u=n(71);n(744);var i=function(e){return o.createElement(u.default,{className:a("route",{"is-selected":e.isSelected}),column:!0,onClick:e.onClick},o.createElement(u.default,{className:"name"},e.feature.properties.name),o.createElement(u.default,{className:"distance",vAlignContent:"bottom"},o.createElement("label",null,"Distance")," ",e.feature.properties.length," km"),o.createElement(u.default,{className:"elevation",vAlignContent:"bottom"},o.createElement("label",null,"Elevation")," ",e.feature.properties.elevationGain," m"),o.createElement(u.default,{className:"actions"},o.createElement("a",{className:"github-button",href:e.feature.properties.url,target:"_blank"},"See on GitHub")))},c=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.Component),r(t,[{key:"render",value:function(){var e=this;return o.createElement(u.default,{className:"side-bar",column:!0,shrink:!1},o.createElement("h2",null,"Routes"),this.props.routes.map(function(t,n){return o.createElement(i,{key:n,feature:t.features[0],onClick:function(){return e.props.onRouteClick(t)},isSelected:e.props.selectedRoute.isSome()&&e.props.selectedRoute.value===t})}))}}]),t}();t.default=c},744:function(e,t,n){},760:function(e,t){},766:function(e,t){},769:function(e,t,n){"use strict";n.r(t),n.d(t,"loadLocale",function(){return o});var r=n(73);function o(e){return new Promise(function(t){switch(e){case"it":return Promise.all([n.e(3),n.e(5)]).then(function(){var o=[n(783),n(784)];Object(r.addLocaleDataAndResolve)(e,t).apply(null,o)}.bind(this)).catch(n.oe);case"en":default:return Promise.all([n.e(2),n.e(4)]).then(function(){var o=[n(785),n(786)];Object(r.addLocaleDataAndResolve)(e,t).apply(null,o)}.bind(this)).catch(n.oe)}})}},770:function(e,t,n){"use strict";n.r(t);var r=n(72),o=n(115),a=n.n(o)()(),u=r({"is-desktop":a.isDesktop,"is-tablet":a.isTablet,"is-phone":a.isPhone}),i=document.documentElement||document.body;i.className=r(i.className,u)},771:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),n(772),n(779),n(781),n(782)},781:function(e,t,n){},782:function(e,t,n){}});
//# sourceMappingURL=main.bundle.b8b08f22ee468ce26f11.js.map