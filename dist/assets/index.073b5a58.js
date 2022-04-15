var z=Object.defineProperty,P=Object.defineProperties;var X=Object.getOwnPropertyDescriptors;var q=Object.getOwnPropertySymbols;var T=Object.prototype.hasOwnProperty,U=Object.prototype.propertyIsEnumerable;var N=(e,n,a)=>n in e?z(e,n,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[n]=a,b=(e,n)=>{for(var a in n||(n={}))T.call(n,a)&&N(e,a,n[a]);if(q)for(var a of q(n))U.call(n,a)&&N(e,a,n[a]);return e},k=(e,n)=>P(e,X(n));var $=(e,n)=>{var a={};for(var r in e)T.call(e,r)&&n.indexOf(r)<0&&(a[r]=e[r]);if(e!=null&&q)for(var r of q(e))n.indexOf(r)<0&&U.call(e,r)&&(a[r]=e[r]);return a};import"./modulepreload-polyfill.b7f2da20.js";import{R as t,m as B,a as Y,d as j,s as K,o as H,N as W,b as V,p as G,e as A,t as J,r as R,c as _}from"./vendor.c1cd45af.js";import{R as S,u as w,a as E,b as Z,c as ee,d as te}from"./remesh-logger.d0a302f9.js";import{L as ne}from"./list.0d9e4950.js";const ae=S.domain({name:"Counter",impl:e=>{const n=e.state({name:"CounterState",default:0}),a=e.command({name:"increCommand",impl:({get:r})=>{const l=r(n());return n().new(l+1)}});return{query:{count:n.query},command:{incre:a}}}}),re=()=>{const e=w(ae()),n=E(e.query.count()),a=()=>{e.command.incre()};return t.createElement("div",{style:{width:400,border:"1px solid #eaeaea",boxSizing:"border-box",padding:10}},t.createElement("h2",null,"Counter"),t.createElement("input",{type:"number",readOnly:!0,value:n}),t.createElement("label",null,t.createElement("button",{onClick:a},"Count ")," "))},le=S.domain({name:"TemperatureConverter",impl:e=>{const n=e.state({name:"CelsiusState",default:""}),a=e.state({name:"FahrenheitState",default:""}),r=e.command({name:"resetBoth",impl:()=>[n().new(""),a().new("")]}),l=e.command({name:"updateCelsius",impl:({},u)=>{if(u==="")return r();const g=parseFloat(u);if(Number.isNaN(g))return n().new(u);const d=g*(9/5)+32;return[n().new(u),a().new(d.toString())]}}),p=e.command({name:"updateFahrenheit",impl:({},u)=>{if(u==="")return r();const g=parseFloat(u);if(Number.isNaN(g))return a().new(u);const d=(g-32)*(5/9);return[n().new(d.toString()),a().new(u)]}});return{query:{celsius:n.query,fahrenheit:a.query},command:{updateCelsius:l,updateFahrenheit:p}}}}),oe=()=>{const e=w(le()),n=E(e.query.celsius()),a=E(e.query.fahrenheit()),r=p=>{e.command.updateCelsius(p.target.value)},l=p=>{e.command.updateFahrenheit(p.target.value)};return t.createElement("div",{style:{border:"1px solid #eaeaea",boxSizing:"border-box",padding:10}},t.createElement("h2",null,"Temperature Converter"),t.createElement("div",null,t.createElement("input",{type:"text",value:n,onChange:r}),t.createElement("label",{htmlFor:""},"Celsius"),"=",t.createElement("input",{type:"text",value:a,onChange:l}),t.createElement("label",{htmlFor:""},"Fahrenheit")))},O=e=>{const n=e.split(".");if(n.length!==3)return null;const a=new Date(`${n[2]}.${n[1]}.${n[0]}`);return a.toString()==="Invalid Date"?null:a},M=e=>{const n=e.toLocaleDateString().split("/");return`${n[2]}.${n[1]}.${n[0]}`},se=(e,n)=>e.getFullYear()!==n.getFullYear()?e.getFullYear()-n.getFullYear():e.getMonth()!==n.getMonth()?e.getMonth()-n.getMonth():e.getDate()-n.getDate(),ce=S.domain({name:"FlightBooker",impl:e=>{const n=e.state({name:"OptionState",default:"one-way"}),a=e.state({name:"StartDateInputState",default:M(new Date)}),r=e.state({name:"EndDateInputState",default:M(new Date)}),l=e.query({name:"StartDateQuery",impl:({get:s})=>{const f=s(a());return O(f)}}),p=e.query({name:"EndDateQuery",impl:({get:s})=>{const f=s(r());return O(f)}}),u=e.command({name:"updateOption",impl:({},s)=>n().new(s)}),g=e.command({name:"updateStartDate",impl:({},s)=>a().new(s)}),d=e.command({name:"updateEndDate",impl:({},s)=>r().new(s)});return{query:{status:e.query({name:"StatusQuery",impl:({get:s})=>{const f=s(n()),y=s(l()),h=s(p()),c=y?"valid":"invalid",o=f==="return"?h?"valid":"invalid":"disabled",i=f==="one-way"?y?"enabled":"disabled":!!y&&!!h&&se(y,h)<=0?"enabled":"disabled";return{startDate:c,endDate:o,bookButton:i}}}),option:n.query,startDate:l,endDate:p,startDateInput:a.query,endDateInput:r.query},command:{updateOption:u,updateStartDate:g,updateEndDate:d}}}}),ie=()=>{const e=w(ce()),n=E(e.query.option()),a=E(e.query.status()),r=E(e.query.startDateInput()),l=E(e.query.endDateInput()),p=m=>{e.command.updateOption(m.target.value)},u=m=>{e.command.updateStartDate(m.target.value)},g=m=>{e.command.updateEndDate(m.target.value)},d=()=>{a.bookButton==="enabled"&&alert(n==="one-way"?`You have booked a one-way flight on ${r}`:`You have booked return flight from ${r} to ${l}`)};return t.createElement("div",{style:{width:400,border:"1px solid #eaeaea",boxSizing:"border-box",padding:10}},t.createElement("h2",null,"Flight Booker"),t.createElement("div",null,t.createElement("select",{value:n,onChange:p},t.createElement("option",{value:"one-way"},"One-way flight"),t.createElement("option",{value:"return"},"Return flight"))),t.createElement("div",null,t.createElement("input",{type:"text",style:{backgroundColor:a.startDate==="invalid"?"red":""},value:r,onChange:u})),t.createElement("div",null,t.createElement("input",{type:"text",style:{backgroundColor:a.endDate==="invalid"?"red":""},disabled:a.endDate==="disabled",value:l,onChange:g})),t.createElement("div",null,t.createElement("button",{disabled:a.bookButton==="disabled",onClick:d},"Book")))},de=S.domain({name:"timer",inspectable:!1,impl:e=>{const n=e.state({name:"duration",default:15e3}),a=e.state({name:"elapsed",default:0}),r=e.event({name:"StartEvent"}),l=e.event({name:"StopEvent"}),p=e.command({name:"updateElapsed",impl:({get:d},m)=>{const s=d(n()),f=d(a());return f>s?l():a().new(f+m)}}),u=e.command({name:"updateDuration",impl:({get:d},m)=>{const s=d(a());return m>s?[n().new(m),r()]:n().new(m)}}),g=e.command({name:"resetElapsed",impl:({})=>[a().new(0),r()]});return e.command$({name:"updateElapsed$",impl:({fromEvent:d})=>{const s=B(d(r).pipe(Y(1)),d(l).pipe(Y(0))).pipe(j()).pipe(K(f=>f===0?W:V().pipe(G(),A(([y,h])=>h.elapsed-y.elapsed),A(y=>p(y)),J(d(l)))));return B(s,H(r()))}}),{query:{duration:n.query,elapsed:a.query},command:{resetElapsed:g,updateDuration:u}}}}),ue=()=>{const e=w(de()),n=E(e.query.elapsed()),a=E(e.query.duration()),r=p=>{const u=parseInt(p.target.value,10);isNaN(u)||e.command.updateDuration(u)},l=()=>{e.command.resetElapsed()};return t.createElement("div",{style:{width:400,border:"1px solid #eaeaea",boxSizing:"border-box",padding:10}},t.createElement("h2",null,"Timer"),t.createElement("div",{style:{display:"flex"}},t.createElement("label",{style:{marginRight:10,whiteSpace:"nowrap"}},"Elapsed Timer:"),t.createElement("div",{style:{width:"100%"}},t.createElement("span",{style:{display:"inline-block",height:10,background:"green",width:`${Math.min(n/a,1)*100}%`,verticalAlign:"middle",borderRadius:5}}))),t.createElement("div",null,n>a?(a/1e3).toFixed(1):(n/1e3).toFixed(1),"s"),t.createElement("div",{style:{display:"flex"}},t.createElement("label",{style:{width:100,marginRight:10}},"Duration:"),t.createElement("input",{style:{width:"100%"},type:"range",min:0,max:3e4,value:a,onChange:r})),t.createElement("div",null,t.createElement("button",{style:{width:"100% "},onClick:l},"Reset Timer")))},F=e=>{const l=e,{onOuterClick:n}=l,a=$(l,["onOuterClick"]),r=R.exports.useRef(null);return R.exports.useEffect(()=>{const p=u=>{var d;if(!((d=u.target)!=null&&d.parentElement))return;!!(r.current&&!r.current.contains(u.target))&&(n==null||n(u))};return document.addEventListener("click",p,!1),()=>{document.removeEventListener("click",p,!1)}},[]),t.createElement("div",b({ref:r},a))},me=S.domain({name:"CRUD",impl:e=>{let n=0;const a=ne(e,{name:"Name",key:h=>h.id}),r=e.state({name:"FilterPrefix",default:""}),l=e.command({name:"updateFilterPrefix",impl:({},h)=>r().new(h)}),p=e.state({name:"Created",default:{name:"",surname:""}}),u=e.command({name:"UpdateCreated",impl:({get:h},c)=>{const o=h(p());return p().new(b(b({},o),c))}}),g=e.state({name:"Selected",default:null}),d=e.command({name:"Select",impl:({get:h},c)=>{const o=h(g());if(c===null)return o===null?null:g().new(null);if(o&&o.id===c)return g().new(null);const i=h(a.query.item(c));return g().new(i)}}),m=e.command({name:"UpdateSelectedName",impl:({get:h},c)=>{const o=h(g());return o===null?[]:g().new(b(b({},o),c))}}),s=e.query({name:"FilteredListQuery",impl:({get:h})=>{const c=h(r()),o=h(a.query.itemList());return c===""?o:o.filter(i=>i.surname.startsWith(c))}}),f=e.command({name:"SyncSelected",impl:({get:h})=>{const c=h(g());return c===null?[]:a.command.updateItem(c)}}),y=e.command({name:"CreateNameItem",impl:({get:h})=>{const c=h(p()),o=b({id:`${n++}`},c);return[a.command.addItem(o),u({name:"",surname:""})]}});return{query:k(b({},a.query),{filteredList:s,selected:g.query,filterPrefix:r.query,created:p.query}),command:k(b({},a.command),{updateFilterPrefix:l,selectItem:d,updateCreated:u,updateSelectedName:m,createNameItem:y,syncSelected:f})}}}),pe=()=>{const e=w(me()),n=E(e.query.filteredList()),a=E(e.query.filterPrefix()),r=E(e.query.created()),l=E(e.query.selected()),p=y=>{e.command.updateFilterPrefix(y.target.value)},u=y=>{e.command.selectItem(y)},g=y=>{l?e.command.updateSelectedName({name:y.target.value}):e.command.updateCreated({name:y.target.value})},d=y=>{l?e.command.updateSelectedName({surname:y.target.value}):e.command.updateCreated({surname:y.target.value})},m=()=>{l===null&&e.command.createNameItem()},s=()=>{l&&e.command.syncSelected()},f=()=>{l&&(e.command.deleteItem(l.id),e.command.selectItem(null))};return t.createElement(F,{style:{width:400,border:"1px solid #eaeaea",boxSizing:"border-box",padding:10},onOuterClick:()=>{u(null)}},t.createElement("h2",null,"CRUD"),t.createElement("div",null,t.createElement("label",{htmlFor:""},"Filter prefix"),t.createElement("input",{type:"text",value:a,onChange:p})),t.createElement("div",{style:{display:"flex"}},t.createElement("div",{style:{width:"50%",height:100,border:"1px solid #eaeaea",overflow:"scroll"}},n.map(y=>{const h=y.name+", "+y.surname;return t.createElement("div",{key:y.id,style:{background:(l==null?void 0:l.id)===y.id?"blue":"",color:(l==null?void 0:l.id)===y.id?"white":""},onClick:()=>{u(y.id)}},h)})),t.createElement("div",{style:{width:"50%",padding:10}},t.createElement("div",null,t.createElement("label",null,"Name:"),t.createElement("input",{type:"text",value:l?l.name:r.name,onChange:g})),t.createElement("div",null,t.createElement("label",null,"Surname:"),t.createElement("input",{type:"text",value:l?l.surname:r.surname,onChange:d}))),t.createElement("div",null,t.createElement("button",{disabled:l!==null,style:{marginRight:10},onClick:m},"Create"),t.createElement("button",{disabled:l===null,style:{marginRight:10},onClick:s},"Update"),t.createElement("button",{disabled:l===null,style:{marginRight:10},onClick:f},"Delete"))))},ye=S.domain({name:"CircleDrawer",impl:e=>{const n=e.state({name:"HistoryState",default:{items:[],currentIndex:-1}}),a=e.command({name:"recordHistoryState",impl:({get:o},i)=>{const C=o(n()),x=C.items.slice(0,C.currentIndex+1);if(i.action==="adjust-circle"){const I=x[x.length-1];I.action==="adjust-circle"&&I.index===i.index&&x.pop()}const v=[...x,i],D=v.length-1;return n().new({items:v,currentIndex:D})}}),r=e.state({name:"DrawState",default:{circles:[]}}),l=e.command({name:"undo",impl:({get:o})=>{const i=o(n()),C=o(u()),x=i.currentIndex-1;return!C||x<0?[r().new({circles:[]}),n().new({items:i.items,currentIndex:-1})]:[r().new(i.items[x].state),n().new({items:i.items,currentIndex:x})]}}),p=e.command({name:"redo",impl:({get:o})=>{const i=o(n());if(!o(g()))return[];const x=i.currentIndex+1;return[r().new(i.items[x].state),n().new({items:i.items,currentIndex:x})]}}),u=e.query({name:"CanUndoQuery",impl:({get:o})=>o(n()).currentIndex>=0}),g=e.query({name:"CanRedoQuery",impl:({get:o})=>{const i=o(n());return i.currentIndex<i.items.length-1}}),d=e.state({name:"SelectedIndexState",default:-1}),m=e.command({name:"setSelectedIndex",impl:({},o)=>d().new(o)}),s=e.query({name:"SelectedCircleInfoQuery",impl:({get:o})=>{const i=o(d()),C=o(r()).circles;return i===-1?null:{index:i,circle:C[i]}}}),f=e.command({name:"draw",impl:({get:o},i)=>{const x={circles:[...o(r()).circles,{position:i.position,diameter:i.diameter}]};return[r().new(x),a({action:"add-circle",state:x})]}}),y=e.command({name:"adjust",impl:({get:o},i)=>{const v={circles:o(r()).circles.map((D,I)=>I===i.index?{position:D.position,diameter:i.diameter}:D)};return[r().new(v),a({action:"adjust-circle",index:i.index,state:v})]}}),h=e.state({name:"TooltipsState",default:{type:"default"}}),c=e.command({name:"updateTooltips",impl:({},o)=>h().new(o)});return{query:{historyState:n.query,drawState:r.query,tooltipsState:h.query,selectedIndex:d.query,selectedCircleInfo:s,canUndo:u,canRedo:g},command:{draw:f,adjust:y,updateTooltips:c,undo:l,redo:p,setSelectedIndex:m}}}}),he=(e,n)=>{const{x:a,y:r}=e,{diameter:l,position:p}=n,{x:u,y:g}=p,d=l/2,m=a-u,s=r-g;return m*m+s*s<d*d},ge=()=>{var h;const e=w(ye()),n=E(e.query.drawState()),a=E(e.query.tooltipsState()),r=E(e.query.selectedCircleInfo()),l=E(e.query.canUndo()),p=E(e.query.canRedo()),u=c=>{const o=n.circles.find(C=>he(c,C));return o?{index:n.circles.indexOf(o),circle:o}:null},g=c=>{c.preventDefault();const o={x:c.pageX,y:c.pageY},i=u(o);i&&(e.command.setSelectedIndex(i.index),e.command.updateTooltips({type:"show-tips",index:i.index,circle:i.circle,pageX:c.pageX,pageY:c.pageY}))},d=c=>{if(a.type!=="default")return;const o={x:c.pageX,y:c.pageY};u(o)||e.command.draw({position:o,diameter:30})},m=c=>{if(a.type!=="default")return;const o={x:c.pageX,y:c.pageY},i=u(o);i?e.command.setSelectedIndex(i.index):e.command.setSelectedIndex(-1)},s=()=>{a.type==="show-tips"&&e.command.updateTooltips({type:"open-slider",index:a.index,circle:a.circle,pageX:a.pageX,pageY:a.pageY})},f=()=>{console.log("handleCloseSlider"),e.command.updateTooltips({type:"default"})},y=c=>{const o=parseInt(c.target.value,10);r&&!isNaN(o)&&e.command.adjust({index:r.index,diameter:o})};return t.createElement("div",{style:{border:"1px solid #eaeaea",boxSizing:"border-box",padding:10}},t.createElement("h2",null,"Circle Drawer"),t.createElement("div",{style:{width:400,textAlign:"center",padding:10}},t.createElement("button",{onClick:()=>e.command.undo(),style:{margin:"0 10px"},disabled:!l},"Undo"),t.createElement("button",{onClick:()=>e.command.redo(),style:{margin:"0 10px"},disabled:!p},"Redo")),t.createElement("div",{style:{width:400,height:400,border:"1px solid #eaeaea",boxSizing:"border-box",overflow:"hidden"},onClick:d,onMouseMove:m},n.circles.map((c,o)=>t.createElement("div",{key:c.position.x+"-"+c.position.y+"-"+c.diameter,style:{position:"absolute",left:c.position.x-c.diameter/2,top:c.position.y-c.diameter/2,width:c.diameter,height:c.diameter,borderRadius:c.diameter/2,border:"1px solid #666",backgroundColor:(r==null?void 0:r.index)===o?"#eaeaea":""},onContextMenu:g}))),a.type==="show-tips"&&t.createElement(F,{key:"show-tips",style:{position:"absolute",left:a.pageX,top:a.pageY,zIndex:100,background:"#fff",border:"1px solid #666",padding:10},onOuterClick:f,onClick:s},"Adjust Diameter"),a.type==="open-slider"&&t.createElement(F,{key:"open-slider",style:{position:"absolute",left:a.pageX,top:a.pageY,background:"#fff",border:"1px solid #666",zIndex:100,padding:10},onOuterClick:f},t.createElement("p",null,"Adjust Diameter"),t.createElement("div",null,t.createElement("input",{type:"range",value:(h=r==null?void 0:r.circle.diameter)!=null?h:"",min:1,max:150,onChange:y}))))},L=S.domain({name:"Cells",inspectable:!1,impl:e=>{const n=e.state({name:"RowKeyListState",default:[0,1,2,3,4,5,6,7,8,9].map(String)}),a=e.state({name:"ColumnKeyListState",default:["A","B","C","D","E","F","G","H","I","J"]}),r=e.state({name:"CellState",impl:d=>({content:{type:"text",text:""},isEditing:!1})}),l=e.query({name:"CellQuery",impl:({get:d},m)=>{const s=d(r(m));if(s.content.type==="text")return{type:"text",isEditing:s.isEditing,content:s.content.text,displayContent:s.content.text};if(s.content.type==="formula"){const f=Ce(s.content.formula),y=h=>Number(d(l(h)).displayContent);return{type:"formula",isEditing:s.isEditing,content:s.content.formula,displayContent:f(y)}}throw new Error("Unknown cell type")}}),p=e.command({name:"selectCell",impl:({get:d},m)=>{const s=d(r(m));return r(m).new({content:s.content,isEditing:!0})}}),u=e.command({name:"unselectCell",impl:({get:d},m)=>{const s=d(r(m));return r(m).new({content:s.content,isEditing:!1})}}),g=e.command({name:"setCellContent",impl:({get:d},{key:m,input:s})=>{const f=d(r(m));return s.startsWith("=")?r(m).new({content:{type:"formula",formula:s},isEditing:f.isEditing}):r(m).new({content:{type:"text",text:s},isEditing:f.isEditing})}});return{query:{cell:l,columnKeyList:a.query,rowKeyList:n.query},command:{selectCell:p,unselectCell:u,setCellContent:g}}}}),fe=()=>{const e=w(L()),n=E(e.query.columnKeyList()),a=E(e.query.rowKeyList());return t.createElement("div",null,t.createElement("h2",null,"Cells"),t.createElement("table",{style:{borderCollapse:"collapse",border:"1px solid #bbb",textAlign:"center"}},t.createElement("thead",null,t.createElement("tr",{style:{backgroundColor:"#f6f6f6"}},t.createElement("th",{style:{width:30,display:"block"}}),n.map(r=>t.createElement("th",{key:r,style:{maxWidth:80,border:"1px solid #bbb"}},r)))),t.createElement("tbody",null,a.map(r=>t.createElement("tr",{key:r},t.createElement(Ee,{rowKey:r,columnKeyList:n}))))))},Ee=({columnKeyList:e,rowKey:n})=>{const a=w(L());return t.createElement(t.Fragment,null,t.createElement("td",{style:{width:30,border:"1px solid #bbb",backgroundColor:"#f6f6f6"}},n),e.map(r=>{const l=`${r}${n}`;return t.createElement("td",{key:l,style:{maxWidth:80,minWidth:80,border:"1px solid #bbb",overflow:"hidden"},onClick:p=>{p.target instanceof HTMLInputElement||a.command.selectCell(l)}},t.createElement(xe,{cellKey:l}))}))},xe=({cellKey:e})=>{const n=w(L()),a=E(n.query.cell(e)),r=l=>{n.command.setCellContent({key:e,input:l.target.value})};return t.createElement(t.Fragment,null,a.isEditing&&t.createElement("input",{style:{width:"100%",height:"100%",backgroundColor:"transparent",boxSizing:"border-box",textAlign:"center"},value:a.content,onChange:r,onBlur:()=>{a.isEditing&&n.command.unselectCell(e)},autoFocus:!0}),!a.isEditing&&a.displayContent)},Ce=e=>n=>{try{const a=e.slice(1).replace(/\w\d+/g,l=>`get('${l}')`);return new Function("get",`return (${a}).toString()`)(n)}catch{return"-"}},be=()=>t.createElement("div",null,t.createElement("h1",null,"7GUIs in React/Remesh/TypeScript"),t.createElement("p",null,"This is a live version of an implementation (source) of 7GUIs with React, TypeScript and Remesh."),t.createElement("hr",null),t.createElement(re,null),t.createElement("hr",null),t.createElement(oe,null),t.createElement("hr",null),t.createElement(ie,null),t.createElement("hr",null),t.createElement(ue,null),t.createElement("hr",null),t.createElement(pe,null),t.createElement("hr",null),t.createElement(ge,null),t.createElement("hr",null),t.createElement(fe,null)),Q=document.getElementById("root");if(Q){const e=_(Q),n=S.store({inspectors:[Z(),ee()]});e.render(t.createElement(R.exports.StrictMode,null,t.createElement(te,{store:n},t.createElement(be,null))))}
//# sourceMappingURL=index.073b5a58.js.map