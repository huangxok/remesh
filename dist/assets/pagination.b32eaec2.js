var F=Object.defineProperty,N=Object.defineProperties;var V=Object.getOwnPropertyDescriptors;var k=Object.getOwnPropertySymbols;var X=Object.prototype.hasOwnProperty,A=Object.prototype.propertyIsEnumerable;var S=(e,t,s)=>t in e?F(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,E=(e,t)=>{for(var s in t||(t={}))X.call(t,s)&&S(e,s,t[s]);if(k)for(var s of k(t))A.call(t,s)&&S(e,s,t[s]);return e},j=(e,t)=>N(e,V(t));import{s as R,m as T,R as u}from"./vendor.c1cd45af.js";import{u as L,a as U,R as C}from"./remesh-logger.d0a302f9.js";const b={default:()=>({type:"default"}),loading:e=>({type:"loading",promise:e}),success:e=>({type:"success",promise:Promise.resolve(e),value:e}),failed:e=>({type:"failed",promise:Promise.reject(e),error:e}),isDefault:e=>e.type==="default",isLoading:e=>e.type==="loading",isSuccess:e=>e.type==="success",isFailed:e=>e.type==="failed",assertDefault:e=>{if(e.type!=="default")throw new Error(`Expected async data in default phase, but got '${e.type}'`)},assertLoading:e=>{if(e.type!=="loading")throw new Error(`Expected async data in loading phase, but got '${e.type}'`)},assertSuccess:e=>{if(e.type!=="success")throw new Error(`Expected async data in success phase, but got '${e.type}'`)},assertFailed:e=>{if(e.type!=="failed")throw new Error(`Expected async data in failed phase, but got '${e.type}'`)}},W=(e,t)=>{const s="default"in t&&t.default?t.default:b.default(),a=e.state({name:`${t.name}.AsyncState`,default:s}),g=e.query({name:`${t.name}.isType`,inspectable:!1,impl:({get:i},r)=>i(a()).type===r}),_=e.query({name:`${t.name}.isDefault`,impl:({get:i})=>i(g("default"))}),l=e.query({name:`${t.name}.isLoading`,impl:({get:i})=>i(g("loading"))}),v=e.query({name:`${t.name}.isSuccess`,impl:({get:i})=>i(g("success"))}),f=e.query({name:`${t.name}.isFailed`,impl:({get:i})=>i(g("failed"))}),n=e.event({name:`${t.name}.LoadingEvent`}),o=e.event({name:`${t.name}.SuccessEvent`}),p=e.event({name:`${t.name}.FailedEvent`}),c=(i,r)=>{var m,y,h;if(r.type==="loading")return[a().new(r),n(),(m=t.command)==null?void 0:m.call(t,i,r)];if(r.type==="success")return[a().new(r),o(r.value),(y=t.command)==null?void 0:y.call(t,i,r)];if(r.type==="failed")return[a().new(r),p(r.error),(h=t.command)==null?void 0:h.call(t,i,r)];throw new Error(`Unknown async data: ${r}`)},D=e.command$({name:`${t.name}.load`,impl:({get:i,peek:r,hasNoValue:m},y)=>{const h={get:i,peek:r,hasNoValue:m};return y.pipe(R(M=>{const z=t.query(h,M),P=z.then(d=>{const w=b.success(d);return c(h,w)},d=>{const w=b.failed(d instanceof Error?d:new Error(`${d}`));return c(h,w)}),Q=c(h,b.loading(z));return T(Q,P)}))}});return{query:{asyncState:a.query,isDefault:_,isLoading:l,isSuccess:v,isFailed:f},command:{load:D},event:{LoadingEvent:n,SuccessEvent:o,FailedEvent:p}}},I=e=>new Promise(t=>setTimeout(t,e)),O=[{login:"mojombo",id:1,node_id:"MDQ6VXNlcjE=",avatar_url:"https://avatars.githubusercontent.com/u/1?v=4",gravatar_id:"",url:"https://api.github.com/users/mojombo",html_url:"https://github.com/mojombo",followers_url:"https://api.github.com/users/mojombo/followers",following_url:"https://api.github.com/users/mojombo/following{/other_user}",gists_url:"https://api.github.com/users/mojombo/gists{/gist_id}",starred_url:"https://api.github.com/users/mojombo/starred{/owner}{/repo}",subscriptions_url:"https://api.github.com/users/mojombo/subscriptions",organizations_url:"https://api.github.com/users/mojombo/orgs",repos_url:"https://api.github.com/users/mojombo/repos",events_url:"https://api.github.com/users/mojombo/events{/privacy}",received_events_url:"https://api.github.com/users/mojombo/received_events",type:"User",site_admin:!1},{login:"defunkt",id:2,node_id:"MDQ6VXNlcjI=",avatar_url:"https://avatars.githubusercontent.com/u/2?v=4",gravatar_id:"",url:"https://api.github.com/users/defunkt",html_url:"https://github.com/defunkt",followers_url:"https://api.github.com/users/defunkt/followers",following_url:"https://api.github.com/users/defunkt/following{/other_user}",gists_url:"https://api.github.com/users/defunkt/gists{/gist_id}",starred_url:"https://api.github.com/users/defunkt/starred{/owner}{/repo}",subscriptions_url:"https://api.github.com/users/defunkt/subscriptions",organizations_url:"https://api.github.com/users/defunkt/orgs",repos_url:"https://api.github.com/users/defunkt/repos",events_url:"https://api.github.com/users/defunkt/events{/privacy}",received_events_url:"https://api.github.com/users/defunkt/received_events",type:"User",site_admin:!1},{login:"pjhyett",id:3,node_id:"MDQ6VXNlcjM=",avatar_url:"https://avatars.githubusercontent.com/u/3?v=4",gravatar_id:"",url:"https://api.github.com/users/pjhyett",html_url:"https://github.com/pjhyett",followers_url:"https://api.github.com/users/pjhyett/followers",following_url:"https://api.github.com/users/pjhyett/following{/other_user}",gists_url:"https://api.github.com/users/pjhyett/gists{/gist_id}",starred_url:"https://api.github.com/users/pjhyett/starred{/owner}{/repo}",subscriptions_url:"https://api.github.com/users/pjhyett/subscriptions",organizations_url:"https://api.github.com/users/pjhyett/orgs",repos_url:"https://api.github.com/users/pjhyett/repos",events_url:"https://api.github.com/users/pjhyett/events{/privacy}",received_events_url:"https://api.github.com/users/pjhyett/received_events",type:"User",site_admin:!1},{login:"wycats",id:4,node_id:"MDQ6VXNlcjQ=",avatar_url:"https://avatars.githubusercontent.com/u/4?v=4",gravatar_id:"",url:"https://api.github.com/users/wycats",html_url:"https://github.com/wycats",followers_url:"https://api.github.com/users/wycats/followers",following_url:"https://api.github.com/users/wycats/following{/other_user}",gists_url:"https://api.github.com/users/wycats/gists{/gist_id}",starred_url:"https://api.github.com/users/wycats/starred{/owner}{/repo}",subscriptions_url:"https://api.github.com/users/wycats/subscriptions",organizations_url:"https://api.github.com/users/wycats/orgs",repos_url:"https://api.github.com/users/wycats/repos",events_url:"https://api.github.com/users/wycats/events{/privacy}",received_events_url:"https://api.github.com/users/wycats/received_events",type:"User",site_admin:!1},{login:"ezmobius",id:5,node_id:"MDQ6VXNlcjU=",avatar_url:"https://avatars.githubusercontent.com/u/5?v=4",gravatar_id:"",url:"https://api.github.com/users/ezmobius",html_url:"https://github.com/ezmobius",followers_url:"https://api.github.com/users/ezmobius/followers",following_url:"https://api.github.com/users/ezmobius/following{/other_user}",gists_url:"https://api.github.com/users/ezmobius/gists{/gist_id}",starred_url:"https://api.github.com/users/ezmobius/starred{/owner}{/repo}",subscriptions_url:"https://api.github.com/users/ezmobius/subscriptions",organizations_url:"https://api.github.com/users/ezmobius/orgs",repos_url:"https://api.github.com/users/ezmobius/repos",events_url:"https://api.github.com/users/ezmobius/events{/privacy}",received_events_url:"https://api.github.com/users/ezmobius/received_events",type:"User",site_admin:!1},{login:"ivey",id:6,node_id:"MDQ6VXNlcjY=",avatar_url:"https://avatars.githubusercontent.com/u/6?v=4",gravatar_id:"",url:"https://api.github.com/users/ivey",html_url:"https://github.com/ivey",followers_url:"https://api.github.com/users/ivey/followers",following_url:"https://api.github.com/users/ivey/following{/other_user}",gists_url:"https://api.github.com/users/ivey/gists{/gist_id}",starred_url:"https://api.github.com/users/ivey/starred{/owner}{/repo}",subscriptions_url:"https://api.github.com/users/ivey/subscriptions",organizations_url:"https://api.github.com/users/ivey/orgs",repos_url:"https://api.github.com/users/ivey/repos",events_url:"https://api.github.com/users/ivey/events{/privacy}",received_events_url:"https://api.github.com/users/ivey/received_events",type:"User",site_admin:!1},{login:"evanphx",id:7,node_id:"MDQ6VXNlcjc=",avatar_url:"https://avatars.githubusercontent.com/u/7?v=4",gravatar_id:"",url:"https://api.github.com/users/evanphx",html_url:"https://github.com/evanphx",followers_url:"https://api.github.com/users/evanphx/followers",following_url:"https://api.github.com/users/evanphx/following{/other_user}",gists_url:"https://api.github.com/users/evanphx/gists{/gist_id}",starred_url:"https://api.github.com/users/evanphx/starred{/owner}{/repo}",subscriptions_url:"https://api.github.com/users/evanphx/subscriptions",organizations_url:"https://api.github.com/users/evanphx/orgs",repos_url:"https://api.github.com/users/evanphx/repos",events_url:"https://api.github.com/users/evanphx/events{/privacy}",received_events_url:"https://api.github.com/users/evanphx/received_events",type:"User",site_admin:!1},{login:"vanpelt",id:17,node_id:"MDQ6VXNlcjE3",avatar_url:"https://avatars.githubusercontent.com/u/17?v=4",gravatar_id:"",url:"https://api.github.com/users/vanpelt",html_url:"https://github.com/vanpelt",followers_url:"https://api.github.com/users/vanpelt/followers",following_url:"https://api.github.com/users/vanpelt/following{/other_user}",gists_url:"https://api.github.com/users/vanpelt/gists{/gist_id}",starred_url:"https://api.github.com/users/vanpelt/starred{/owner}{/repo}",subscriptions_url:"https://api.github.com/users/vanpelt/subscriptions",organizations_url:"https://api.github.com/users/vanpelt/orgs",repos_url:"https://api.github.com/users/vanpelt/repos",events_url:"https://api.github.com/users/vanpelt/events{/privacy}",received_events_url:"https://api.github.com/users/vanpelt/received_events",type:"User",site_admin:!1},{login:"wayneeseguin",id:18,node_id:"MDQ6VXNlcjE4",avatar_url:"https://avatars.githubusercontent.com/u/18?v=4",gravatar_id:"",url:"https://api.github.com/users/wayneeseguin",html_url:"https://github.com/wayneeseguin",followers_url:"https://api.github.com/users/wayneeseguin/followers",following_url:"https://api.github.com/users/wayneeseguin/following{/other_user}",gists_url:"https://api.github.com/users/wayneeseguin/gists{/gist_id}",starred_url:"https://api.github.com/users/wayneeseguin/starred{/owner}{/repo}",subscriptions_url:"https://api.github.com/users/wayneeseguin/subscriptions",organizations_url:"https://api.github.com/users/wayneeseguin/orgs",repos_url:"https://api.github.com/users/wayneeseguin/repos",events_url:"https://api.github.com/users/wayneeseguin/events{/privacy}",received_events_url:"https://api.github.com/users/wayneeseguin/received_events",type:"User",site_admin:!1},{login:"brynary",id:19,node_id:"MDQ6VXNlcjE5",avatar_url:"https://avatars.githubusercontent.com/u/19?v=4",gravatar_id:"",url:"https://api.github.com/users/brynary",html_url:"https://github.com/brynary",followers_url:"https://api.github.com/users/brynary/followers",following_url:"https://api.github.com/users/brynary/following{/other_user}",gists_url:"https://api.github.com/users/brynary/gists{/gist_id}",starred_url:"https://api.github.com/users/brynary/starred{/owner}{/repo}",subscriptions_url:"https://api.github.com/users/brynary/subscriptions",organizations_url:"https://api.github.com/users/brynary/orgs",repos_url:"https://api.github.com/users/brynary/repos",events_url:"https://api.github.com/users/brynary/events{/privacy}",received_events_url:"https://api.github.com/users/brynary/received_events",type:"User",site_admin:!1}];let Y=1e6;const $=async e=>(await I(500),O.map(t=>j(E({},t),{id:Y++})));let q=!1;const B=async e=>{if(q)return $();try{const t=await fetch(`https://api.github.com/users?since=${e.offset}&per_page=${e.pageSize}`);if(!t.ok)throw new Error(t.statusText);return await t.json()}catch{return q=!0,$()}},x=C.domain({name:"pagination",impl:e=>{const t={offset:0,pageSize:10},s=e.state({name:"Pagination",default:t}),a=e.state({name:"UserListState",default:[]}),g=e.query({name:"isEmptyUserList",impl:({get:n})=>n(a()).length===0}),_=e.query({name:"NextPaginationQuery",impl:({get:n})=>{const o=n(s()),p=n(a());if(p.length===0)return o;const c=p[p.length-1];return j(E({},o),{offset:c.id+1})}}),l=W(e,{name:"userFetcher",query:async({},n)=>await B(n),command:({get:n},o)=>{if(!b.isSuccess(o))return null;const p=n(_()),c=n(a());return[s().new(p),a().new(c.concat(o.value))]}});e.ignite(()=>l.command.load(t));const v=e.command({name:"loadMore",impl:({get:n})=>{const o=n(_());return l.command.load(o)}}),f=e.command({name:"reset",impl:({})=>[s().new(t),a().new([]),v()]});return{query:{userList:a.query,isEmptyUserList:g,isLoading:l.query.isLoading,asyncState:l.query.asyncState},command:{loadMore:v,reset:f},event:{LoadingUsersEvent:l.event.LoadingEvent,SuccessToLoadUsersEvent:l.event.SuccessEvent,FailedToLoadUsersEvent:l.event.FailedEvent}}}});var ee=()=>{const e=L(x()),t=U(e.query.isEmptyUserList());return u.createElement("div",null,u.createElement("h2",null,"Pagination"),t?"loading...":u.createElement(G,null))};const G=()=>{const e=L(x()),t=U(e.query.isLoading()),s=()=>{e.command.reset()},a=()=>{e.command.loadMore()};return u.createElement(u.Fragment,null,u.createElement("div",null,u.createElement("button",{onClick:s},"reset")),u.createElement(H,null),u.createElement("div",{style:{display:"flex",flexWrap:"wrap",justifyContent:"space-around"}},!t&&u.createElement("button",{onClick:a},"load more"),t&&"loading..."))},H=()=>{const e=L(x()),t=U(e.query.userList());return u.createElement("div",{style:{display:"flex",flexWrap:"wrap",justifyContent:"space-around"}},t.map(s=>u.createElement("div",{style:{width:100,margin:10},key:s.id},u.createElement("img",{style:{width:100,height:100},src:s.avatar_url,loading:"lazy"}),u.createElement("p",null,u.createElement("a",{href:s.html_url},s.login)))))};export{ee as default};
//# sourceMappingURL=pagination.b32eaec2.js.map