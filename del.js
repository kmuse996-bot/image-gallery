// Gallery delete via GitHub REST API (shared by browser + node test)
(function(root){
var REPO="kmuse996-bot/image-gallery",BR="main",API="https://api.github.com/repos/"+REPO+"/contents/";
function b64enc(s){var u=new TextEncoder().encode(s),b="";for(var i=0;i<u.length;i+=0x8000)b+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(b)}
function b64dec(s){var b=atob(s.replace(/\s/g,"")),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return new TextDecoder().decode(u)}
function enc(p){return p.split("/").map(encodeURIComponent).join("/")}
async function gh(tok,method,path,body){
  var r=await fetch(API+enc(path)+(method==="GET"?"?ref="+BR+"&_="+Date.now():""),{method:method,cache:"no-store",headers:{"Authorization":"Bearer "+tok,"Accept":"application/vnd.github+json","Content-Type":"application/json"},body:body?JSON.stringify(body):undefined});
  if(!r.ok){var e=new Error("HTTP "+r.status);e.status=r.status;try{e.detail=(await r.json()).message}catch(_){}throw e}
  return r.status===204?null:r.json();
}
var SK="ig_tok_s";
function u8(b){var x=atob(b),u=new Uint8Array(x.length);for(var i=0;i<x.length;i++)u[i]=x.charCodeAt(i);return u}
async function decryptVault(v,pw){
  var C=(root.crypto&&root.crypto.subtle)?root.crypto:require("crypto").webcrypto;
  var base=await C.subtle.importKey("raw",new TextEncoder().encode(pw),"PBKDF2",false,["deriveKey"]);
  var key=await C.subtle.deriveKey({name:"PBKDF2",hash:"SHA-256",salt:u8(v.salt),iterations:v.iter},base,{name:"AES-GCM",length:256},false,["decrypt"]);
  return new TextDecoder().decode(await C.subtle.decrypt({name:"AES-GCM",iv:u8(v.iv)},key,u8(v.ct)));
}
async function unlock(){
  var t=sessionStorage.getItem(SK);if(t)return t;
  var pw=await askPw();if(!pw)return null;
  var v=await (await fetch("vault.json?_="+Date.now(),{cache:"no-store"})).json();
  try{t=await decryptVault(v,pw)}catch(_){var e=new Error("bad password");e.badpw=true;throw e}
  sessionStorage.setItem(SK,t);return t;
}
function lock(){sessionStorage.removeItem(SK)}
function askPw(){return new Promise(function(res){
  var o=document.createElement("div");o.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:9999";
  o.innerHTML='<form style="background:#222;color:#eee;padding:18px;border-radius:12px;display:flex;flex-direction:column;gap:10px;min-width:240px"><label>삭제 비밀번호</label><input type="password" autocomplete="current-password" style="padding:8px;font-size:16px"><div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" data-x>취소</button><button type="submit">확인</button></div></form>';
  document.body.appendChild(o);var f=o.querySelector("form"),i=o.querySelector("input");i.focus();
  function done(v){o.remove();res(v)}
  f.onsubmit=function(ev){ev.preventDefault();done(i.value)};o.querySelector("[data-x]").onclick=function(){done(null)};
})}
async function deleteEntry(tok,id){
  var f=await gh(tok,"GET","data.json");
  var data=JSON.parse(b64dec(f.content));
  var ent=data.find(function(e){return e.id===id});
  if(!ent){var e=new Error("not found");e.status=404;throw e}
  var rest=data.filter(function(e){return e.id!==id});
  await gh(tok,"PUT","data.json",{message:"Delete "+id+" from gallery",content:b64enc(JSON.stringify(rest,null,2)+"\n"),sha:f.sha,branch:BR});
  if(ent.image&&!rest.some(function(e){return e.image===ent.image})){
    try{var im=await gh(tok,"GET",ent.image);await gh(tok,"DELETE",ent.image,{message:"Delete "+ent.image,sha:im.sha,branch:BR})}catch(err){if(err.status!==404)throw err}
  }
  return ent;
}
root.IGDel={unlock:unlock,lock:lock,decryptVault:decryptVault,deleteEntry:deleteEntry,gh:gh,b64enc:b64enc,b64dec:b64dec};
})(typeof window!=="undefined"?window:globalThis);
