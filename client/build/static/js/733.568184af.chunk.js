"use strict";(self.webpackChunk_coreui_coreui_free_react_admin_template=self.webpackChunk_coreui_coreui_free_react_admin_template||[]).push([[733],{39733:(e,s,i)=>{i.r(s),i.d(s,{default:()=>p});var r=i(72791),t=i(78983),d=i(61134),a=i(52608),n=i(57689),c=i(29655),l=(i(5462),i(80184));const p=()=>{const{register:e,setValue:s,handleSubmit:i,clearErrors:p,formState:{errors:m}}=(0,d.cI)(),o=(0,n.s0)(),[h,x]=(0,r.useState)(""),[u,j]=(0,r.useState)(""),[b,g]=(0,r.useState)(""),[S,N]=(0,r.useState)(!1),{state:f}=(0,n.TH)();return(0,r.useEffect)((()=>{if(f&&f.id&&g(f.id),f&&f.editData){const{editData:e,imageUrl:i}=f;j(e._id),s("name",e.name),s("stepno",e.stepno),s("description",e.description),s("recipeid",e.recipeid),g(e.recipeid),x(i+e.image)}}),[f,s]),(0,l.jsx)("div",{className:"bg-light min-vh-100",children:(0,l.jsx)(t.KB,{className:"mt-3",children:(0,l.jsx)(t.rb,{children:(0,l.jsx)(t.b7,{md:8,children:(0,l.jsxs)(t.xH,{children:[(0,l.jsx)(t.bn,{children:(0,l.jsx)("strong",{children:u?"Edit Step":"Add Step"})}),(0,l.jsxs)(t.sl,{children:[(0,l.jsx)(c.Ix,{}),(0,l.jsxs)(t.lx,{className:"row g-3",onSubmit:i((e=>{let s=new FormData;Object.keys(e).forEach((i=>{"image"===i?void 0!==e[i][0]&&s.append(i,e[i][0]):s.append(i,e[i])})),f&&f.id&&s.append("recipeid",f.id),u?(0,a.d)(s,u).then((()=>{o("/Step",{state:{id:b}})})).catch((e=>{e.response.data.success?N(!1):c.Am.error(e.response.data.message)})):(0,a.ZL)(s).then((()=>{o("/Step",{state:{id:b}})})).catch((e=>{e.response.data.success?N(!1):c.Am.error(e.response.data.message)}))})),children:[(0,l.jsxs)(t.b7,{xl:6,md:12,children:[(0,l.jsx)(t.L8,{children:"Step Name"}),(0,l.jsx)(t.jO,{type:"text",id:"name",...e("name",{required:"Step Name is required"}),invalid:!!m.name,placeholder:"Step Name"}),(0,l.jsx)(t.CO,{invalid:!0,children:"Step Name is required"})]}),(0,l.jsxs)(t.b7,{xl:6,md:12,children:[(0,l.jsx)(t.L8,{children:"Step Number"}),(0,l.jsx)(t.jO,{type:"number",id:"stepno",...e("stepno",{required:"Step Number is required"}),invalid:!!m.stepno,placeholder:"Step Number"}),(0,l.jsx)(t.CO,{invalid:!0,children:"Step Number is required"})]}),(0,l.jsxs)(t.b7,{md:12,children:[(0,l.jsx)(t.L8,{children:"Description"}),(0,l.jsx)(t.PB,{id:"description",...e("description",{required:"Description is required"}),placeholder:"Step Description",rows:"4",invalid:!!m.description}),(0,l.jsx)(t.CO,{invalid:!0,children:"Description is required"})]}),(0,l.jsxs)(t.b7,{xl:6,md:12,children:[(0,l.jsxs)(t.L8,{children:["Step Image",(0,l.jsx)("span",{className:"errors",children:"Only png, jpg, webp, and jpeg images allowed"})]}),(0,l.jsx)(t.jO,{type:"file",id:"image",...e("image"),onChange:e=>{const s=e.target.files[0];if(s){const e=URL.createObjectURL(s);x(e)}else x("")}})]}),(0,l.jsx)(t.b7,{md:6,children:h&&(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("p",{children:"Image preview"}),(0,l.jsx)("img",{src:h,alt:"preview",style:{maxWidth:"40%",borderRadius:"10px",maxHeight:"40%"}})]})}),(0,l.jsx)(t.b7,{md:12,className:"text-center submitButton",children:S?(0,l.jsxs)(t.u5,{disabled:!0,children:[(0,l.jsx)(t.LQ,{component:"span",size:"sm","aria-hidden":"true"}),"Loading..."]}):(0,l.jsx)(t.u5,{type:"submit",className:"AddButton",children:u?"Update":"Add"})})]})]})]})})})})})}}}]);
//# sourceMappingURL=733.568184af.chunk.js.map