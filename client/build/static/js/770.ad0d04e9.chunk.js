"use strict";(self.webpackChunk_coreui_coreui_free_react_admin_template=self.webpackChunk_coreui_coreui_free_react_admin_template||[]).push([[770],{40770:(e,t,s)=>{s.r(t),s.d(t,{default:()=>p});var a=s(89078),o=s(72791),c=s(57689),n=s(24824),r=s(29655),l=s(52608),i=s(62062),u=s.n(i),d=s(15865),m=s(80184);const p=()=>{const[e,t]=(0,o.useState)([]),[s,i]=((0,c.s0)(),(0,o.useState)("")),p=async()=>{await(0,l.Y8)().then((e=>{t(e.data.info.user),i("".concat("http://localhost:5008/public/userprofile/"))})).catch((e=>{e.response.data.success||(401===e.response.data.status?r.Am.error(e.response.data.message):r.Am.error(e.response.data,"else"))}))};(0,o.useEffect)((()=>{p()}),[]);const h=[{name:"name",label:"Name",options:{filter:!0,sort:!0}},{name:"email",label:"Email",options:{filter:!0,sort:!0}},{name:"mono",label:"MobileNo",options:{filter:!0,sort:!1}},{name:"image",label:"Image",options:{customBodyRender:e=>e?(0,m.jsx)("img",{src:"".concat("http://localhost:5008/public/userprofile/").concat(e),alt:e,style:{height:"50px",width:"50px",borderRadius:"50%"}}):(0,m.jsx)("img",{src:d,alt:e,style:{height:"50px",width:"50px",borderRadius:"50%"}})}},{name:"_id",label:"Action",options:{customBodyRender:e=>(0,m.jsx)(n.Z,{className:"deleteButton",onClick:async()=>{if(await u()({title:"Are you sure?",text:"Are you sure? Want to delete User?",icon:"warning",buttons:["No, cancel it!","Yes, I am sure!"],dangerMode:!0})){const t={id:e};(0,l.h8)(t).then((()=>{p(),r.Am.success("Deleted successfully!")})).catch((e=>{var t,s;console.log(e);const a=(null===(t=e.response)||void 0===t||null===(s=t.data)||void 0===s?void 0:s.message)||"Something went wrong";r.Am.error(a)}))}}})}}];return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(r.Ix,{}),(0,m.jsx)(a.ZP,{title:"User List",data:e,columns:h,options:{selectableRows:"none"}})]})}},24824:(e,t,s)=>{s.d(t,{Z:()=>c});var a=s(76189),o=s(80184);const c=(0,a.Z)((0,o.jsx)("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1"}),"DeleteRounded")},15865:(e,t,s)=>{e.exports=s.p+"static/media/default.9ac34f8f1c1ab5ca9880.png"}}]);
//# sourceMappingURL=770.ad0d04e9.chunk.js.map