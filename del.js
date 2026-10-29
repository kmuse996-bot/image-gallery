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
root.IGDel={deleteEntry:deleteEntry,gh:gh,b64enc:b64enc,b64dec:b64dec};
})(typeof window!=="undefined"?window:globalThis);
