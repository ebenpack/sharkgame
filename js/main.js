(()=>{"use strict";var t=function(){return t=Object.assign||function(t){for(var e,n=1,o=arguments.length;n<o;n++)for(var r in e=arguments[n])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t},t.apply(this,arguments)},e=function(t,e,n,o){return new(n||(n=Promise))((function(r,a){function i(t){try{l(o.next(t))}catch(t){a(t)}}function c(t){try{l(o.throw(t))}catch(t){a(t)}}function l(t){var e;t.done?r(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(i,c)}l((o=o.apply(t,e||[])).next())}))},n=function(t,e){var n,o,r,a,i={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return a={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function c(c){return function(l){return function(c){if(n)throw new TypeError("Generator is already executing.");for(;a&&(a=0,c[0]&&(i=0)),i;)try{if(n=1,o&&(r=2&c[0]?o.return:c[0]?o.throw||((r=o.return)&&r.call(o),0):o.next)&&!(r=r.call(o,c[1])).done)return r;switch(o=0,r&&(c=[2&c[0],r.value]),c[0]){case 0:case 1:r=c;break;case 4:return i.label++,{value:c[1],done:!1};case 5:i.label++,o=c[1],c=[0];continue;case 7:c=i.ops.pop(),i.trys.pop();continue;default:if(!((r=(r=i.trys).length>0&&r[r.length-1])||6!==c[0]&&2!==c[0])){i=0;continue}if(3===c[0]&&(!r||c[1]>r[0]&&c[1]<r[3])){i.label=c[1];break}if(6===c[0]&&i.label<r[1]){i.label=r[1],r=c;break}if(r&&i.label<r[2]){i.label=r[2],i.ops.push(c);break}r[2]&&i.ops.pop(),i.trys.pop();continue}c=e.call(t,i)}catch(t){c=[6,t],o=0}finally{n=r=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,l])}}},o=function(t,e,n){if(n||2===arguments.length)for(var o,r=0,a=e.length;r<a;r++)!o&&r in e||(o||(o=Array.prototype.slice.call(e,0,r)),o[r]=e[r]);return t.concat(o||Array.prototype.slice.call(e))};e(void 0,void 0,void 0,(function(){var r,a,i,c,l,s,u,h,f,d,p,v,y,w,m;return n(this,(function(g){switch(g.label){case 0:if(r=1.5,!(a=document.getElementById("shark-game")))throw new Error("Container not found");return i={ids:{},hitboxes:{}},c=0,l=0,s=o([{id:"background",src:"background.png",width:394,left:29,top:29},{id:"frame",src:"frame.png",width:448,left:0,top:0},{id:"shark",src:"shark.png",width:392,left:30,top:30}],o([],Array(20),!0).map((function(t,e){var n=e+1;return{id:"tooth-".concat(n),src:n<10?"tooth_0".concat(n,".png"):"tooth_".concat(n,".png"),width:392,left:30,top:30}})),!0),u=s.map((function(e){var n=e.width,o=e.left,a=e.top,i=function(t,e){var n={};for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&e.indexOf(o)<0&&(n[o]=t[o]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(t);r<o.length;r++)e.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(t,o[r])&&(n[o[r]]=t[o[r]])}return n}(e,["width","left","top"]);return t({width:Math.floor(n*r),height:Math.floor(404/390*n*r),left:Math.floor(o*r),top:Math.floor(a*r)},i)})),u.forEach((function(t){var e=t.width,n=t.height;c<e&&(c=e),l<n&&(l=n)})),a.style.position="relative",a.style.width="".concat(c,"px"),a.style.height="".concat(l,"px"),h=function(o){return e(void 0,void 0,void 0,(function(){var e,r,a,s,u,h,f,d;return n(this,(function(n){return e=o.id,r=o.src,a=o.width,s=o.height,u=o.left,h=o.top,f=document.createElement("div"),(d=document.createElement("img")).src="images/".concat(r),f.appendChild(d),[2,new Promise((function(n){var r=function(f){if(e.startsWith("tooth")&&!i.ids[e]){i.ids[e]=!0;var p=document.createElement("canvas");p.width=c,p.height=l;var v=p.getContext("2d");if(!v)throw new Error("Something wonky with this context yo");v.drawImage(d,u,h,a,s);for(var y=v.getImageData(0,0,c,l).data,w=0;w<c;w++)for(var m=0;m<l;m++)y[4*(m*c+w)+3]>1&&(i.hitboxes["".concat(w,"-").concat(m)]=e)}n(t(t({},o),{image:d})),d.removeEventListener("load",r)};d.addEventListener("load",r)}))]}))}))},[4,Promise.all(u.map(h))];case 1:if(f=g.sent(),d=function(e){var n=document.createElement("canvas");n.style.position="absolute",n.style.top="0",n.style.left="0",n.style.background="transparent",n.width=c,n.height=l;var o=n.getContext("2d");if(!o)throw new Error("Something wonky with this context yo");return o.imageSmoothingEnabled=!1,a.appendChild(n),t(t({},e),{canvas:n,ctx:o})},p=f.map(d),v=function(t){var e=t.ctx,n=t.image,o=t.left,r=t.top,a=t.width,i=t.height,s=t.tint,u=void 0===s?null:s;if(t.clear)e.clearRect(0,0,c,l);else if(u){var h=u.color,f=u.alpha,d=void 0===f?.5:f,p=document.createElement("canvas");p.width=c,p.height=l;var v=p.getContext("2d");if(!v)throw new Error("Something wonky with this context yo");v.clearRect(0,0,c,l),v.drawImage(n,o,r,a,i),v.fillStyle=h,v.globalCompositeOperation="multiply",v.fillRect(0,0,c,l),v.globalAlpha=d,v.globalCompositeOperation="destination-in",v.drawImage(n,o,r,a,i),e.drawImage(p,0,0,c,l)}else e.drawImage(n,o,r,a,i)},p.forEach((function(t){return v(t)})),y={state:"select-cavity"},w={lock:null},!(m=document.getElementById("reset")))throw new Error("Reset button not found");return m.addEventListener("click",(function(){return e(void 0,void 0,void 0,(function(){return n(this,(function(t){switch(t.label){case 0:return w.lock?[4,w.lock]:[3,2];case 1:t.sent(),t.label=2;case 2:return y={state:"select-cavity"},p.filter((function(t){return t.id.startsWith("tooth")})).map(v),[2]}}))}))})),a.addEventListener("click",(function(o){return e(void 0,void 0,void 0,(function(){return n(this,(function(r){switch(r.label){case 0:return null!==w.lock?[2]:(w.lock=new Promise((function(r){return e(void 0,void 0,void 0,(function(){var e,c,l,s,u,h,f,d,w,m;return n(this,(function(g){switch(g.label){case 0:return a.getBoundingClientRect(),e=Math.floor(o.offsetX),c=Math.floor(o.offsetY),(l=i.hitboxes["".concat(e,"-").concat(c)])?(s=p.find((function(t){return t.id===l})),s?(u=parseInt(l.split("-")[1],10),"select-cavity"!==y.state?[3,1]:(v(t(t({},s),{tint:{color:"#F00000",alpha:.3}})),y={state:"select-tooth",cavity:u,selected:null},[3,6])):[3,6]):[3,7];case 1:if(!(u<y.cavity&&(null==y.selected||y.selected<u)))return[3,6];h=function(e){var o;return n(this,(function(n){switch(n.label){case 0:return o=p.find((function(t){return t.id==="tooth-".concat(e)})),o?(v(t(t({},o),{clear:!0})),[4,(150,new Promise((function(t){return setTimeout(t,150)})))]):[3,2];case 1:n.sent(),n.label=2;case 2:return[2]}}))},f=null!==(m=y.selected)&&void 0!==m?m:1,g.label=2;case 2:return f<=u?[5,h(f)]:[3,5];case 3:g.sent(),g.label=4;case 4:return f++,[3,2];case 5:y=u+1===y.cavity?{state:"win",cavity:y.cavity,selected:u}:{state:"select-tooth",cavity:y.cavity,selected:u},g.label=6;case 6:if(!(d=document.getElementById("instructions-content")))throw new Error("Instructions content area not found");switch(y.state){case"select-cavity":d.textContent="Select the tooth with the cavity!";break;case"select-tooth":w=function(t,e){var n=e-t-1;return{rem:n%4,quot:Math.floor((n-1)/4)}}(21-y.cavity,21-(y.selected||0)).rem,d.textContent="Select the currently played tooth!\nIf it's your turn, then play ".concat(w||1,"!");break;case"win":d.textContent="If it's your turn, then you've won!"}g.label=7;case 7:return r(),[2]}}))}))})),[4,w.lock]);case 1:return r.sent(),w.lock=null,[2]}}))}))})),[2]}}))}))})();
//# sourceMappingURL=main.js.map