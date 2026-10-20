window.initLinkyGift=function(CONFIG){
'use strict';
let dead=false, raf=0; const _L=[], _T=new Set();
const _on=(t,e,f,o)=>{ t.addEventListener(e,f,o); _L.push([t,e,f,o]); };
const _st=(f,ms)=>{ const id=setTimeout(()=>{ _T.delete(id); if(!dead) f(); },ms); _T.add(id); return id; };
function destroy(){ dead=true; cancelAnimationFrame(raf); _T.forEach(clearTimeout); _T.clear(); _L.forEach(([t,e,f,o])=>t.removeEventListener(e,f,o)); try{ gsap.globalTimeline.clear(); }catch(e){} try{ if(AC) AC.close(); }catch(e){} try{ if(renderer){ renderer.dispose(); renderer.forceContextLoss&&renderer.forceContextLoss(); } }catch(e){} }

/* ---------- helpers ---------- */
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lin=h=>new THREE.Color(h).convertSRGBToLinear();
const PAL=[0xFF4F8B,0x8FA8FF,0xFFE27A,0xFBF9FF,0xB48CFF,0xFF9E7A];

/* ---------- fill content ---------- */
const TX=CONFIG.text||{}, tx=(k,d)=>(TX[k]!=null&&TX[k]!=='')?TX[k]:d;
$$('[data-t]').forEach(e=>{ const v=TX[e.dataset.t]; if(v!=null&&v!=='') e.textContent=v; }); // must run before split()
{ const longest=Math.max(...$$('[data-split]').map(e=>Math.max(...e.textContent.split(' ').map(w=>w.length)))); if(longest>9) $('#p1 .hero').classList.add('long'); }
document.title=tx('pageTitle',CONFIG.name+"'s birthday gift");
$$('[data-name]').forEach(e=>e.textContent=CONFIG.name);
$$('[data-from]').forEach(e=>e.textContent=CONFIG.from);
$('#secret').textContent=CONFIG.secret;
$('#finale').textContent=CONFIG.finale;
$('#footA').textContent=CONFIG.footerTitle;
$('#footB').textContent=CONFIG.footerLine;
if(!CONFIG.footerTitle&&!CONFIG.footerLine) $('#p6 .badge').style.display='none';
if(TX.fromLine) $('#p1 .from').textContent=TX.fromLine;
function split(el){
  const txt=el.textContent; el.textContent='';
  txt.split(' ').forEach((w,wi,arr)=>{
    const ws=document.createElement('span'); ws.className='word';
    [...w].forEach(c=>{const s=document.createElement('span'); s.className='ch'; s.textContent=c; ws.appendChild(s);});
    el.appendChild(ws); if(wi<arr.length-1) el.appendChild(document.createTextNode(' '));
  });
}
$$('[data-split]').forEach(split);

/* ---------- audio (all synthesized, starts after first tap) ---------- */
let AC=null,master=null,delay=null,noiseBuf=null,muted=false;
function audioInit(){
  if(AC){ if(AC.state==='suspended') AC.resume(); return; }
  try{
    AC=new (window.AudioContext||window.webkitAudioContext)();
    master=AC.createGain(); master.gain.value=muted?0:.55;
    const comp=AC.createDynamicsCompressor(); master.connect(comp); comp.connect(AC.destination);
    delay=AC.createDelay(); delay.delayTime.value=.24;
    const fb=AC.createGain(); fb.gain.value=.3; delay.connect(fb); fb.connect(delay);
    const wet=AC.createGain(); wet.gain.value=.35; delay.connect(wet); wet.connect(comp);
    noiseBuf=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);
    const d=noiseBuf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
  }catch(e){ AC=null; }
}
function tone(f,t,d,type,g,send){
  const o=AC.createOscillator(), a=AC.createGain(); o.type=type||'sine'; o.frequency.value=f;
  a.gain.setValueAtTime(.0001,t); a.gain.exponentialRampToValueAtTime(g,t+.012); a.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(a); a.connect(master); if(send!==false) a.connect(delay); o.start(t); o.stop(t+d+.05);
}
function noise(t,d,type,f0,f1,g){
  const s=AC.createBufferSource(); s.buffer=noiseBuf; s.loop=true;
  const bp=AC.createBiquadFilter(); bp.type=type; bp.frequency.setValueAtTime(f0,t); bp.frequency.exponentialRampToValueAtTime(f1,t+d); bp.Q.value=1.2;
  const a=AC.createGain(); a.gain.setValueAtTime(g,t); a.gain.exponentialRampToValueAtTime(.0001,t+d);
  s.connect(bp); bp.connect(a); a.connect(master); s.start(t); s.stop(t+d+.05);
}
const SFX={
  chime(){ if(!AC) return; const t=AC.currentTime; [523.25,659.25,783.99,1046.5,1318.5].forEach((f,i)=>{tone(f,t+i*.09,1.3,'sine',.15); tone(f*2,t+i*.09,.6,'triangle',.04);}); },
  pop(){ if(!AC) return; const t=AC.currentTime; noise(t,.12,'bandpass',2800,500,.5); tone(220,t,.12,'sine',.22,false); },
  petal(n){ if(!AC) return; const t=AC.currentTime, f=520*Math.pow(2,(n||0)*2/12); tone(f,t,.55,'sine',.16); tone(f*1.5,t+.05,.4,'triangle',.05); },
  whoosh(){ if(!AC) return; const t=AC.currentTime; noise(t,.5,'bandpass',300,3200,.22); },
  thump(){ if(!AC) return; const t=AC.currentTime; tone(90,t,.35,'sine',.45,false); noise(t,.4,'lowpass',900,80,.4); },
  crackle(){ if(!AC) return; const t=AC.currentTime; for(let i=0;i<9;i++) noise(t+.05+Math.random()*.55,.05,'highpass',3000,5200,.16); },
  whistle(){ if(!AC) return; const t=AC.currentTime, o=AC.createOscillator(), a=AC.createGain(); o.type='sine';
    o.frequency.setValueAtTime(500,t); o.frequency.exponentialRampToValueAtTime(1900,t+.65);
    a.gain.setValueAtTime(.05,t); a.gain.exponentialRampToValueAtTime(.0001,t+.7); o.connect(a); a.connect(master); o.start(t); o.stop(t+.75); },
  blow(){ if(!AC) return; const t=AC.currentTime; noise(t,.9,'bandpass',600,1500,.3); },
  melody(){
    if(!AC) return; const N={C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,B4:493.88,C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99};
    const seq=[['G4',.75],['G4',.25],['A4',1],['G4',1],['C5',1],['B4',2],['G4',.75],['G4',.25],['A4',1],['G4',1],['D5',1],['C5',2],
      ['G4',.75],['G4',.25],['G5',1],['E5',1],['C5',1],['B4',1],['A4',2],['F5',.75],['F5',.25],['E5',1],['C5',1],['D5',1],['C5',2]];
    let t=AC.currentTime+.4; const beat=.46;
    seq.forEach(([n,d])=>{ const f=N[n]; tone(f,t,1.5,'sine',.11); tone(f*2,t,.5,'sine',.045); tone(f*3,t,.25,'sine',.02); t+=d*beat; });
  }
};
Object.keys(SFX).forEach(k=>{ const fn=SFX[k]; SFX[k]=function(){ if(muted||!AC) return; try{ fn(); }catch(e){} }; });
const buzz=ms=>{ try{ navigator.vibrate&&navigator.vibrate(ms); }catch(e){} };
$('#mute').addEventListener('click',()=>{ audioInit(); muted=!muted; $('#mute').classList.toggle('muted',muted); if(master) master.gain.value=muted?0:.55; });

/* ---------- three.js ---------- */
const canvas=$('#gl');
let renderer;
try{
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
}catch(e){ $('#nogl').style.display='grid'; return destroy; }
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.setClearColor(0x000000,0);
renderer.outputEncoding=THREE.sRGBEncoding;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(45,1,.1,100);

// studio-style reflections: a tiny scene of glowing panels baked into an environment map
(function(){
  const envScene=new THREE.Scene(); envScene.background=new THREE.Color(0x0b0620);
  const panel=(c,k,w,h,pos)=>{ const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(c).multiplyScalar(k),side:THREE.DoubleSide})); m.position.set(pos[0],pos[1],pos[2]); m.lookAt(0,0,0); envScene.add(m); };
  panel(0xffffff,7,9,5,[0,8,2]); panel(0xff4f8b,6,6,7,[-8,2,0]); panel(0x8fa8ff,6,6,7,[8,1,-2]);
  panel(0xffe27a,5,7,3,[0,-1,8]); panel(0xffffff,2.5,10,2,[0,3,-9]); panel(0xb48cff,4,6,3,[0,-7,0]);
  const pm=new THREE.PMREMGenerator(renderer); scene.environment=pm.fromScene(envScene,.03).texture; pm.dispose();
})();
scene.add(new THREE.HemisphereLight(0xbfb0ff,0x2a1450,.45));
const key=new THREE.DirectionalLight(0xffffff,1.05); key.position.set(3,6,5); scene.add(key);
const rim=new THREE.PointLight(lin(0xff4f8b),1.3,30); rim.position.set(-5,2,-3); scene.add(rim);

function glowTex(inner,outer){
  const c=document.createElement('canvas'); c.width=c.height=128; const x=c.getContext('2d');
  const g=x.createRadialGradient(64,64,0,64,64,64); g.addColorStop(0,inner); g.addColorStop(.35,outer); g.addColorStop(1,'rgba(0,0,0,0)');
  x.fillStyle=g; x.fillRect(0,0,128,128); return new THREE.CanvasTexture(c);
}

/* confetti: instanced, lit, metallic so it glints */
class Confetti{
  constructor(n){
    this.n=n; this.i=0;
    const geo=new THREE.PlaneGeometry(.15,.28);
    const mat=new THREE.MeshStandardMaterial({side:THREE.DoubleSide,roughness:.35,metalness:.55});
    this.mesh=new THREE.InstancedMesh(geo,mat,n); this.mesh.frustumCulled=false;
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.p=new Float32Array(n*3); this.v=new Float32Array(n*3); this.r=new Float32Array(n*3); this.w=new Float32Array(n*3);
    this.life=new Float32Array(n); this.s=new Float32Array(n); this.ph=new Float32Array(n);
    this.d=new THREE.Object3D();
    for(let i=0;i<n;i++){ this.mesh.setColorAt(i,lin(PAL[i%PAL.length])); this.d.scale.set(0,0,0); this.d.updateMatrix(); this.mesh.setMatrixAt(i,this.d.matrix); }
    this.mesh.instanceColor.needsUpdate=true;
  }
  emit(x,y,z,vx,vy,vz,life,sc){
    const i=this.i; this.i=(i+1)%this.n; const k=i*3;
    this.p[k]=x;this.p[k+1]=y;this.p[k+2]=z; this.v[k]=vx;this.v[k+1]=vy;this.v[k+2]=vz;
    this.r[k]=rand(0,6.28);this.r[k+1]=rand(0,6.28);this.r[k+2]=rand(0,6.28);
    this.w[k]=rand(-9,9);this.w[k+1]=rand(-9,9);this.w[k+2]=rand(-5,5);
    this.life[i]=life; this.s[i]=sc||rand(.7,1.3); this.ph[i]=rand(0,6.28);
  }
  burst(o,n,opt){
    opt=opt||{}; const sp=opt.speed||6, up=opt.up||4, life=opt.life||3.6;
    for(let k=0;k<n;k++){
      const th=rand(0,6.283), u=rand(-.2,1), r=Math.sqrt(1-u*u), s=sp*rand(.35,1);
      this.emit(o.x,o.y,o.z,Math.cos(th)*r*s,u*s*.8+up*rand(.4,1),Math.sin(th)*r*s*.6,life*rand(.7,1.1));
    }
  }
  update(dt,t){
    let any=false;
    for(let i=0;i<this.n;i++){
      if(this.life[i]<=0) continue; any=true;
      const k=i*3; this.life[i]-=dt;
      if(this.life[i]<=0){ this.life[i]=0; this.d.scale.set(0,0,0); this.d.updateMatrix(); this.mesh.setMatrixAt(i,this.d.matrix); continue; }
      const drag=Math.exp(-1.5*dt);
      this.v[k]=this.v[k]*drag+Math.sin(t*3+this.ph[i])*1.4*dt; this.v[k+2]*=drag;
      this.v[k+1]=Math.max(this.v[k+1]*drag-5*dt,-2.1);
      this.p[k]+=this.v[k]*dt; this.p[k+1]+=this.v[k+1]*dt; this.p[k+2]+=this.v[k+2]*dt;
      this.r[k]+=this.w[k]*dt; this.r[k+1]+=this.w[k+1]*dt; this.r[k+2]+=this.w[k+2]*dt;
      this.d.position.set(this.p[k],this.p[k+1],this.p[k+2]); this.d.rotation.set(this.r[k],this.r[k+1],this.r[k+2]);
      this.d.scale.setScalar(this.s[i]*Math.min(1,this.life[i]/.5)); this.d.updateMatrix(); this.mesh.setMatrixAt(i,this.d.matrix);
    }
    if(any) this.mesh.instanceMatrix.needsUpdate=true;
  }
}

/* glow particles: sparks, fireworks, smoke, bokeh, all in one additive Points object */
class Sparks{
  constructor(n){
    this.n=n; this.i=0;
    this.pos=new Float32Array(n*3); this.vel=new Float32Array(n*3); this.life=new Float32Array(n); this.max=new Float32Array(n);
    this.sz0=new Float32Array(n); this.a0=new Float32Array(n); this.drag=new Float32Array(n); this.grav=new Float32Array(n); this.tw=new Uint8Array(n);
    this.col=new Float32Array(n*3); this.size=new Float32Array(n); this.alpha=new Float32Array(n);
    const g=new THREE.BufferGeometry();
    this.aPos=new THREE.BufferAttribute(this.pos,3).setUsage(THREE.DynamicDrawUsage);
    this.aCol=new THREE.BufferAttribute(this.col,3).setUsage(THREE.DynamicDrawUsage);
    this.aSize=new THREE.BufferAttribute(this.size,1).setUsage(THREE.DynamicDrawUsage);
    this.aAlpha=new THREE.BufferAttribute(this.alpha,1).setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('position',this.aPos); g.setAttribute('aColor',this.aCol); g.setAttribute('aSize',this.aSize); g.setAttribute('aAlpha',this.aAlpha);
    this.mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uScale:{value:600}},
      vertexShader:'attribute vec3 aColor;attribute float aSize;attribute float aAlpha;uniform float uScale;varying vec3 vC;varying float vA;'+
        'void main(){vC=aColor;vA=aAlpha;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=aSize*uScale/max(.1,-mv.z);gl_Position=projectionMatrix*mv;}',
      fragmentShader:'precision mediump float;varying vec3 vC;varying float vA;'+
        'void main(){float d=length(gl_PointCoord-.5)*2.;float a=exp(-d*d*4.5)*vA;if(a<.004)discard;gl_FragColor=vec4(vC,a);}'});
    this.points=new THREE.Points(g,this.mat); this.points.frustumCulled=false;
  }
  emit(x,y,z,vx,vy,vz,life,size,alpha,r,g,b,drag,grav,tw){
    const i=this.i; this.i=(i+1)%this.n; const k=i*3;
    this.pos[k]=x;this.pos[k+1]=y;this.pos[k+2]=z; this.vel[k]=vx;this.vel[k+1]=vy;this.vel[k+2]=vz;
    this.col[k]=r;this.col[k+1]=g;this.col[k+2]=b; this.life[i]=life; this.max[i]=life; this.sz0[i]=size; this.a0[i]=alpha;
    this.drag[i]=drag; this.grav[i]=grav; this.tw[i]=tw?1:0;
  }
  update(dt,t){
    let any=false;
    for(let i=0;i<this.n;i++){
      if(this.life[i]<=0) continue; any=true; const k=i*3;
      this.life[i]-=dt;
      if(this.life[i]<=0){ this.life[i]=0; this.size[i]=0; this.alpha[i]=0; continue; }
      const dr=Math.exp(-this.drag[i]*dt);
      this.vel[k]*=dr; this.vel[k+1]=this.vel[k+1]*dr-this.grav[i]*dt; this.vel[k+2]*=dr;
      this.pos[k]+=this.vel[k]*dt; this.pos[k+1]+=this.vel[k+1]*dt; this.pos[k+2]+=this.vel[k+2]*dt;
      const q=this.life[i]/this.max[i];
      this.alpha[i]=this.a0[i]*q*q*(this.tw[i]?(.72+.28*Math.sin(t*38+i)):1);
      this.size[i]=this.sz0[i]*(.55+.45*q);
    }
    if(any){ this.aPos.needsUpdate=true; this.aCol.needsUpdate=true; this.aSize.needsUpdate=true; this.aAlpha.needsUpdate=true; }
  }
  /* quick coloured burst */
  puff(o,n,hex,speed,size){
    const c=new THREE.Color(hex);
    for(let k=0;k<n;k++){
      const th=rand(0,6.283), u=rand(-1,1), r=Math.sqrt(1-u*u), s=speed*rand(.4,1);
      this.emit(o.x,o.y,o.z,Math.cos(th)*r*s,u*s,Math.sin(th)*r*s,rand(.6,1.1),size||.2,1,c.r,c.g,c.b,2.2,1.5,true);
    }
  }
}
const confetti=new Confetti(1100); scene.add(confetti.mesh);
const sparks=new Sparks(5000); scene.add(sparks.points);

/* ---------- the gift ---------- */
function bevBox(w,h,d,b,mat){
  const hw=w/2-b, hd=d/2-b, r=Math.min(.16,hw,hd), s=new THREE.Shape();
  s.moveTo(-hw+r,-hd); s.lineTo(hw-r,-hd); s.absarc(hw-r,-hd+r,r,-Math.PI/2,0,false);
  s.lineTo(hw,hd-r); s.absarc(hw-r,hd-r,r,0,Math.PI/2,false);
  s.lineTo(-hw+r,hd); s.absarc(-hw+r,hd-r,r,Math.PI/2,Math.PI,false);
  s.lineTo(-hw,-hd+r); s.absarc(-hw+r,-hd+r,r,Math.PI,Math.PI*1.5,false);
  const g=new THREE.ExtrudeGeometry(s,{depth:h-2*b,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:5,curveSegments:10});
  g.rotateX(-Math.PI/2); g.translate(0,-(h/2-b),0);
  return new THREE.Mesh(g,mat);
}
const giftG=new THREE.Group(); scene.add(giftG);
const bodyM=new THREE.MeshPhysicalMaterial({color:lin(0xFF4F8B),roughness:.28,metalness:.05,clearcoat:1,clearcoatRoughness:.12});
const lidM=new THREE.MeshPhysicalMaterial({color:lin(0xFF6B9E),roughness:.25,metalness:.05,clearcoat:1,clearcoatRoughness:.1});
const goldM=new THREE.MeshStandardMaterial({color:lin(0xFFE27A),roughness:.22,metalness:.85,emissive:lin(0xFFB020),emissiveIntensity:0});
const body=bevBox(2.3,1.5,2.3,.07,bodyM); giftG.add(body);
giftG.add(bevBox(.42,1.52,2.34,.04,goldM)); giftG.add(bevBox(2.34,1.54,.42,.04,goldM));
const lidG=new THREE.Group(); lidG.position.y=.96; giftG.add(lidG);
lidG.add(bevBox(2.5,.5,2.5,.06,lidM)); lidG.add(bevBox(.42,.52,2.54,.04,goldM)); lidG.add(bevBox(2.54,.54,.42,.04,goldM));
const bow=new THREE.Group(); bow.position.y=.3; lidG.add(bow);
[-1,1].forEach(sx=>{
  const l=new THREE.Mesh(new THREE.TorusGeometry(.38,.1,16,48),goldM); l.scale.set(1,1.35,.8); l.position.set(sx*.4,.3,0); l.rotation.z=sx*-.85; bow.add(l);
});
const knot=new THREE.Mesh(new THREE.SphereGeometry(.2,24,16),goldM); knot.position.y=.12; bow.add(knot);
// glowing interior revealed when the lid leaves
const glowM=new THREE.MeshBasicMaterial({color:0xfff0b8,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
const glowPlane=new THREE.Mesh(new THREE.PlaneGeometry(2.1,2.1).rotateX(-Math.PI/2),glowM); glowPlane.position.y=.77; giftG.add(glowPlane);
const beamMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,uniforms:{uA:{value:0}},
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'varying vec2 vUv;uniform float uA;void main(){float f=pow(1.-vUv.y,1.7)*uA;gl_FragColor=vec4(vec3(1.,.88,.55)*f,f*.85);}'});
const beam=new THREE.Mesh(new THREE.CylinderGeometry(2.1,1.0,6,40,1,true),beamMat); beam.position.y=.77+3; giftG.add(beam);
const disc=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('rgba(255,240,190,1)','rgba(255,190,90,.35)'),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0}));
disc.scale.set(7,7,1); disc.position.y=1.1; giftG.add(disc);
const innerLight=new THREE.PointLight(lin(0xffd27a),0,10); innerLight.position.y=1.4; giftG.add(innerLight);
const shadow=new THREE.Mesh(new THREE.PlaneGeometry(4,4).rotateX(-Math.PI/2),
  new THREE.MeshBasicMaterial({map:glowTex('rgba(0,0,0,.9)','rgba(0,0,0,.35)'),transparent:true,depthWrite:false,opacity:.5}));
shadow.position.set(0,-2.1,0); scene.add(shadow);
giftG.position.y=-.3;

/* ---------- balloons ---------- */
const balloonG=new THREE.Group(); scene.add(balloonG); balloonG.visible=false;
const balloons=[];
const lathePts=[]; for(let i=0;i<=40;i++){ const a=i/40*Math.PI; lathePts.push(new THREE.Vector2(Math.max(.0001,.5*Math.sin(a)*(1-.16*Math.cos(a))),-.62*Math.cos(a))); }
const balloonGeo=new THREE.LatheGeometry(lathePts,40);
const knotGeo=new THREE.ConeGeometry(.07,.13,12).rotateX(Math.PI);
const hitGeo=new THREE.SphereGeometry(.82,8,8);
const hitMat=new THREE.MeshBasicMaterial({visible:false});
const BCOL=[0xFF4F8B,0x8FA8FF,0xFFE27A,0xFBF9FF,0xB48CFF,0xFF9E7A,0xFF4F8B,0x8FA8FF,0xFFE27A,0xB48CFF];
for(let i=0;i<10;i++){
  const g=new THREE.Group();
  const m=new THREE.MeshPhysicalMaterial({color:lin(BCOL[i]),roughness:.16,metalness:0,clearcoat:1,clearcoatRoughness:.04});
  const b=new THREE.Mesh(balloonGeo,m); g.add(b);
  const k=new THREE.Mesh(knotGeo,m); k.position.y=-.67; g.add(k);
  const str=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-.73,0),new THREE.Vector3(.07,-1.1,0),new THREE.Vector3(-.06,-1.5,0),new THREE.Vector3(.04,-1.95,0)]),
    new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.45}));
  g.add(str);
  const hit=new THREE.Mesh(hitGeo,hitMat); g.add(hit);
  balloonG.add(g);
  balloons.push({g,hit,color:BCOL[i],popped:false,base:new THREE.Vector3(),off:{y:-9},ph:rand(0,6.28),sp:rand(.8,1.4),sc:1});
}
function layoutBalloons(){
  const aspect=innerWidth/innerHeight, halfH=Math.tan(22.5*Math.PI/180)*9.8, halfW=halfH*aspect;
  const slots=[]; const cols=3, rows=4;
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) slots.push([c,r]);
  const skip=[2,9]; const use=slots.filter((s,i)=>skip.indexOf(i)<0).slice(0,10);
  const yTop=halfH*.36, yBot=-halfH*.5;
  balloons.forEach((b,i)=>{
    const [c,r]=use[i]; const stag=(r%2)*.5-.25;
    const x=((c+.5+stag)/cols-.5)*2*halfW*.76, y=yTop+(yBot-yTop)*(r/(rows-1));
    b.base.set(x+rand(-.15,.15),y+rand(-.12,.12),rand(-.8,.6));
    b.sc=clamp(halfW/1.9,.7,1.15);
  });
}

/* ---------- the cake ---------- */
const cakeG=new THREE.Group(); scene.add(cakeG); cakeG.visible=false;
const cm=(c,r,m)=>new THREE.MeshPhysicalMaterial({color:lin(c),roughness:r,metalness:m||0,clearcoat:.6,clearcoatRoughness:.2});
const cyl=(rt,rb,h,mat,y)=>{ const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,72),mat); m.position.y=y; cakeG.add(m); return m; };
cyl(2.05,2.15,.14,cm(0xFBF9FF,.2,.5),-.08);
cyl(1.55,1.55,.95,cm(0xFF4F8B,.35),.45);
cyl(1.08,1.08,.8,cm(0xFFE27A,.35),1.32);
[[1.55,.93],[1.08,1.72]].forEach(([r,y])=>{ const t=new THREE.Mesh(new THREE.TorusGeometry(r,.09,16,72),cm(0xFBF9FF,.3)); t.rotation.x=Math.PI/2; t.position.y=y; cakeG.add(t); });
for(let i=0;i<14;i++){ const a=i/14*Math.PI*2; const bead=new THREE.Mesh(new THREE.SphereGeometry(.1,16,12),cm(i%2?0x8FA8FF:0xFFE27A,.25,.2)); bead.position.set(Math.cos(a)*1.56,.9,Math.sin(a)*1.56); cakeG.add(bead); }
const flames=[], flameTex=glowTex('rgba(255,244,210,1)','rgba(255,170,60,.55)');
const CCOL=[0xFF4F8B,0xFBF9FF,0x8FA8FF,0xFBF9FF,0xB48CFF];
for(let i=0;i<5;i++){
  const a=i/5*Math.PI*2+.3, rr=.58, x=Math.cos(a)*rr, z=Math.sin(a)*rr;
  const c=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.6,16),cm(CCOL[i],.4)); c.position.set(x,2.5-.1,z); cakeG.add(c);
  const f=new THREE.Sprite(new THREE.SpriteMaterial({map:flameTex,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));
  f.scale.set(.7,.9,1); f.position.set(x,2.5+.42,z); cakeG.add(f); flames.push({s:f,x,z,ph:rand(0,6.28),k:1});
}
const candleLight=new THREE.PointLight(lin(0xffa84a),1.6,9); candleLight.position.set(0,3.1,0); cakeG.add(candleLight);
cakeG.position.y=-1.5;

/* ---------- camera rig, resize ---------- */
const cam={x:0,y:.9,z:9.8,lx:0,ly:.2,lz:0};
const POSE=[
  {x:0,y:.9,z:9.8,ly:.2},{x:0,y:0,z:10,ly:0},{x:0,y:0,z:10,ly:0},{x:0,y:0,z:10,ly:0},
  {x:0,y:0,z:9.8,ly:0},{x:0,y:1.3,z:9,ly:.5},{x:0,y:.2,z:10,ly:.3}
];
function camTo(i,d){ const p=POSE[i]; gsap.to(cam,{x:p.x,y:p.y,z:p.z,ly:p.ly,duration:d||1.4,ease:'power3.inOut',overwrite:true}); }
function resize(){
  const w=innerWidth,h=innerHeight; renderer.setSize(w,h,false); camera.aspect=w/h;
  camera.fov=w/h<.62?50:45; camera.updateProjectionMatrix();
  sparks.mat.uniforms.uScale.value=renderer.domElement.height/(2*Math.tan(camera.fov*Math.PI/360));
  layoutBalloons();
}
_on(window,'resize',resize); resize();
const par={x:0,y:0,tx:0,ty:0};
_on(window,'pointermove',e=>{ par.tx=(e.clientX/innerWidth-.5)*2; par.ty=(e.clientY/innerHeight-.5)*2; });

/* ---------- state + navigation ---------- */
const pages=$$('.page'), N=pages.length;
const S={pos:0,cur:0,opened:false,opening:false,game:{left:10,done:false},blown:false,intro:false};
const hold={p:0,down:false};
const next=$('#next');

const SCHEME=[['#120a24','#4a1a6b','#7a1f4f'],['#1b0f3a','#6b2a9e','#c23a78'],['#141036','#3a3fa0','#6b2a9e'],['#1a0f33','#9e2a6b','#3a3fa0'],
  ['#10163a','#2a5fb0','#8a2a9e'],['#0c0818','#2a1450','#5a1f3f'],['#1b0f3a','#8a2a7a','#2a4fb0']];
function tint(i){ const s=SCHEME[i]; gsap.to('#bg',{'--c0':s[0],'--c1':s[1],'--c2':s[2],duration:1.4,ease:'power1.inOut'}); }

function render(){
  const W=innerWidth;
  pages.forEach((el,i)=>{
    const p=i-S.pos, a=Math.min(Math.abs(p),1);
    if(a>=1){ el.style.visibility='hidden'; el.style.pointerEvents='none'; return; }
    el.style.visibility='visible'; el.style.pointerEvents=a<.5?'auto':'none';
    el.style.opacity=String(1-a*.9);
    el.style.transform='translate3d('+(p*W*.92)+'px,0,0) rotateY('+(-p*26)+'deg) scale('+(1-a*.1)+')';
  });
}
const segs=[];
(function(){ const pr=$('#progress'); for(let i=1;i<N;i++){ const s=document.createElement('span'); const f=document.createElement('i'); s.appendChild(f); pr.appendChild(s); segs.push(f); } })();
function updateUI(){
  $('#progress').classList.toggle('on',S.cur>0);
  segs.forEach((f,i)=>gsap.to(f,{scaleX:(i+1)<=S.cur?1:0,duration:.45,ease:'power2.out'}));
  next.classList.toggle('on',S.cur>0&&S.cur<N-1);
}
const minPos=()=>S.opened?1:0, maxPos=()=>S.opened?N-1:0;
function go(i){
  if(S.opening) return; i=clamp(i,minPos(),maxPos());
  const changed=i!==S.cur; S.cur=i;
  gsap.to(S,{pos:i,duration:.8,ease:'power3.out',overwrite:true,onUpdate:render});
  if(changed){ SFX.whoosh(); camTo(i); tint(i); updateUI(); _st(()=>{ if(S.cur===i) enter(i); },260); }
}

/* drag, tap, keys */
let ds=null;
const stage=$('#stage');
stage.addEventListener('pointerdown',e=>{
  audioInit();
  if(S.opening||e.target.closest('[data-lock],button,a')){ ds=null; return; }
  ds={x:e.clientX,y:e.clientY,t:performance.now(),pos:S.pos,drag:false,lx:e.clientX,lt:performance.now(),v:0,id:e.pointerId};
});
stage.addEventListener('pointermove',e=>{
  if(!ds||ds.id!==e.pointerId) return;
  const dx=e.clientX-ds.x, dy=e.clientY-ds.y;
  if(!ds.drag){ if(Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)*1.15){ ds.drag=true; try{ stage.setPointerCapture(e.pointerId); }catch(_){} gsap.killTweensOf(S); } else return; }
  const now=performance.now(); ds.v=(e.clientX-ds.lx)/Math.max(1,now-ds.lt); ds.lx=e.clientX; ds.lt=now;
  let target=ds.pos-dx/innerWidth, lo=minPos(), hi=maxPos();
  if(target<lo) target=lo-(lo-target)*.28; if(target>hi) target=hi+(target-hi)*.28;
  S.pos=target; render();
});
function endDrag(e){
  if(!ds||ds.id!==e.pointerId) return; const d=ds; ds=null;
  if(d.drag){
    const base=Math.round(d.pos); let to=base;
    if(Math.abs(d.v)>.45) to=base+(d.v<0?1:-1);
    else if(S.pos>base+.22) to=base+1; else if(S.pos<base-.22) to=base-1;
    to=clamp(to,minPos(),maxPos()); S.cur=base;
    if(to===base) gsap.to(S,{pos:base,duration:.6,ease:'back.out(1.5)',overwrite:true,onUpdate:render}); else go(to);
  } else if(performance.now()-d.t<450 && Math.abs(e.clientX-d.x)<12 && Math.abs(e.clientY-d.y)<12){
    if(S.cur===4) tapBalloon(e.clientX,e.clientY);
  }
}
stage.addEventListener('pointerup',endDrag); stage.addEventListener('pointercancel',endDrag);
next.addEventListener('click',()=>{ audioInit(); go(S.cur+1); });
_on(window,'keydown',e=>{ if(e.key==='ArrowRight'||e.key===' ') go(S.cur+1); if(e.key==='ArrowLeft') go(S.cur-1); });

/* ---------- page 0: hold to open ---------- */
const prog=$('#prog'), holdHint=$('#holdhint'), p0=pages[0];
function holdUpdate(){ prog.style.strokeDashoffset=String(326.7*(1-hold.p)); }
p0.addEventListener('pointerdown',()=>{
  audioInit(); if(S.opened||S.opening) return; hold.down=true; holdHint.textContent=tx('keepHolding','Keep holding');
  gsap.killTweensOf(hold); gsap.to(hold,{p:1,duration:1.5,ease:'power1.in',onUpdate:holdUpdate,onComplete:()=>{ if(hold.down) openGift(); }});
});
['pointerup','pointercancel','pointerleave'].forEach(ev=>p0.addEventListener(ev,()=>{
  if(!hold.down||S.opened||S.opening) return; hold.down=false; holdHint.textContent=tx('holdHint','Press and hold to open');
  gsap.killTweensOf(hold); gsap.to(hold,{p:0,duration:.5,ease:'back.out(2)',onUpdate:holdUpdate});
}));
const topPoint=new THREE.Vector3();
function openGift(){
  S.opening=true; hold.down=false; holdHint.textContent='';
  SFX.chime(); SFX.whoosh(); buzz(40);
  topPoint.set(0,giftG.position.y+.9,0);
  const tl=gsap.timeline();
  tl.to(lidG.position,{y:5.2,z:-2,duration:1.25,ease:'power3.out'},0)
    .to(lidG.rotation,{x:-1.3,z:.6,duration:1.25,ease:'power2.out'},0)
    .to(beamMat.uniforms.uA,{value:1,duration:.5},0)
    .to(glowM,{opacity:1,duration:.3},0)
    .to(disc.material,{opacity:.95,duration:.4},0)
    .to(hold,{p:0,duration:.4,onUpdate:holdUpdate},0)
    .call(()=>{ confetti.burst(topPoint,520,{speed:8,up:7.5,life:4}); sparks.puff(topPoint,160,0xFFE27A,6,.24); sparks.puff(topPoint,100,0xFF4F8B,5,.2); buzz(25); },null,.05)
    .to(cam,{z:4.4,y:1.7,ly:1.5,duration:.95,ease:'power2.in'},.95)
    .to('#flash',{opacity:1,duration:.22,ease:'power1.in'},1.6)
    .call(()=>{
      giftG.visible=false; shadow.visible=false; S.opened=true; S.opening=false; S.cur=1; S.pos=1; render();
      camTo(1,1.8); tint(1); updateUI(); enter(1);
    },null,1.85)
    .to('#flash',{opacity:0,duration:.9,ease:'power2.out'},1.9);
}

/* ---------- page entries ---------- */
let pageTl=null;
const ageObj={n:0};
function killTl(){ if(pageTl){ pageTl.kill(); pageTl=null; } }
function enter(i){
  killTl();
  fw.on=(i===6)||(i===5&&S.blown); if(fw.on) fwLoop();
  if(i===1){
    ageObj.n=0;
    pageTl=gsap.timeline();
    pageTl.fromTo('#p1 .ch',{yPercent:110,rotationX:-85,opacity:0},{yPercent:0,rotationX:0,opacity:1,duration:.9,ease:'back.out(1.6)',stagger:.035},.05)
      .fromTo('#heroName',{scale:.2,opacity:0,rotation:-8},{scale:1,opacity:1,rotation:0,duration:1.2,ease:'elastic.out(1,.55)'},.5)
      .fromTo('#age',{opacity:0,scale:.6},{opacity:1,scale:1,duration:.9,ease:'back.out(2)'},.85)
      .to(ageObj,{n:CONFIG.age,duration:1.6,ease:'power2.out',onUpdate:()=>{ $('#age').textContent=String(Math.round(ageObj.n)); }},.85)
      .fromTo('#p1 .from',{opacity:0,y:20},{opacity:1,y:0,duration:.8},1.7)
      .to('#age',{y:-12,rotation:-1.5,duration:2.2,yoyo:true,repeat:-1,ease:'sine.inOut'},2.6);
    confetti.burst(new THREE.Vector3(0,3,1),140,{speed:5,up:3,life:4.5}); SFX.chime();
    if(!S.intro){ S.intro=true; _st(()=>SFX.melody(),900); }
  }
  if(i===2){
    const full=CONFIG.letter.join('\n'), o={n:0}, el=$('#letter'); el.textContent='';
    pageTl=gsap.timeline().to(o,{n:full.length,duration:Math.max(2,full.length*.034),ease:'none',onUpdate:()=>{ el.textContent=full.slice(0,Math.round(o.n)); }},.3);
  }
  if(i===3){ introDeck(); }
  if(i===4){ if(FLOWER) introFlower(); else introBalloons(); }
  if(i===5){ introCake(); }
  if(i===6){
    pageTl=gsap.timeline();
    pageTl.fromTo('#p6 .fin',{y:40,opacity:0,scale:.9},{y:0,opacity:1,scale:1,duration:1,ease:'back.out(1.5)'},.1)
      .fromTo('#finale',{y:20,opacity:0},{y:0,opacity:1,duration:.8},.7)
      .fromTo('#replay',{y:20,opacity:0},{y:0,opacity:1,duration:.7},1)
      .fromTo('#p6 .badge',{y:30,opacity:0},{y:0,opacity:1,duration:.8},1.2);
    confetti.burst(new THREE.Vector3(0,3.5,1),200,{speed:6,up:4,life:5});
  }
}

/* ---------- page 3: photo deck ---------- */
const ART={
  sun:'<svg viewBox="0 0 100 130" preserveAspectRatio="xMidYMid slice"><circle cx="50" cy="58" r="22" fill="#FFE27A"/><path d="M0 92Q25 80 50 92T100 92V130H0Z" fill="#2A1B4D" opacity=".5"/><path d="M0 108Q25 98 50 108T100 108V130H0Z" fill="#2A1B4D" opacity=".6"/></svg>',
  slice:'<svg viewBox="0 0 100 130" preserveAspectRatio="xMidYMid slice"><path d="M50 108L20 40Q50 24 80 40Z" fill="#FFE27A"/><path d="M20 40Q50 24 80 40" fill="none" stroke="#FF9E7A" stroke-width="7" stroke-linecap="round"/><circle cx="44" cy="58" r="5" fill="#FF4F8B"/><circle cx="58" cy="52" r="4.5" fill="#FF4F8B"/><circle cx="50" cy="76" r="4.5" fill="#FF4F8B"/></svg>',
  wave:'<svg viewBox="0 0 100 130" preserveAspectRatio="xMidYMid slice"><circle cx="50" cy="52" r="26" fill="#FFF3C4"/><path d="M0 78Q20 66 40 78T80 78T120 78V130H0Z" fill="#2A1B4D" opacity=".45"/><path d="M0 98Q20 86 40 98T80 98T120 98V130H0Z" fill="#2A1B4D" opacity=".6"/></svg>',
  spark:'<svg viewBox="0 0 100 130" preserveAspectRatio="xMidYMid slice"><path d="M50 22L58 54L90 62L58 70L50 104L42 70L10 62L42 54Z" fill="#FFE27A"/><circle cx="20" cy="24" r="4" fill="#fff" opacity=".8"/><circle cx="82" cy="100" r="5" fill="#fff" opacity=".8"/></svg>'
};
function artHTML(a,tint,img){
  const bg=img?'background-image:url('+img+')':'background:linear-gradient(150deg,'+tint[0]+','+tint[1]+')';
  return '<div class="art" style="'+bg+'">'+(img?'':ART[a]+'<small>Your photo here</small>')+'</div>';
}
const deck=$('#deck'), order=[], flying=new Set();
CONFIG.memories.forEach(m=>{
  const c=document.createElement('div'); c.className='photo';
  c.innerHTML=artHTML(m.art,m.tint,m.img)+'<div class="cap"></div>'; $('.cap',c).textContent=m.title; deck.appendChild(c); order.push(c);
});
function layoutDeck(anim){
  order.forEach((c,d)=>{ if(flying.has(c)) return;
    const p={x:0,y:d*16,scale:1-d*.06,rotation:d===0?-2:(d%2?5:-5)*d*.7,opacity:d<3?1:0,zIndex:10-d};
    if(anim) gsap.to(c,Object.assign({duration:.55,ease:'back.out(1.4)',overwrite:'auto'},p)); else gsap.set(c,p);
  });
}
layoutDeck(false);
function introDeck(){
  order.forEach((c,d)=>gsap.fromTo(c,{y:d*16+420,rotation:(d%2?1:-1)*18,opacity:0},{y:d*16,rotation:d===0?-2:(d%2?5:-5)*d*.7,opacity:d<3?1:0,duration:.9,ease:'back.out(1.3)',delay:.1+d*.09}));
}
let dg=null;
deck.addEventListener('pointerdown',e=>{ audioInit(); dg={x:e.clientX,y:e.clientY,lx:e.clientX,lt:performance.now(),v:0,id:e.pointerId}; try{ deck.setPointerCapture(e.pointerId); }catch(_){} gsap.killTweensOf(order[0]); });
deck.addEventListener('pointermove',e=>{
  if(!dg||dg.id!==e.pointerId) return; const dx=e.clientX-dg.x, dy=e.clientY-dg.y, now=performance.now();
  dg.v=(e.clientX-dg.lx)/Math.max(1,now-dg.lt); dg.lx=e.clientX; dg.lt=now;
  gsap.set(order[0],{x:dx,y:dy*.4,rotation:dx/14});
});
function dEnd(e){
  if(!dg||dg.id!==e.pointerId) return; const d=dg; dg=null; const dx=e.clientX-d.x, top=order[0];
  if(Math.abs(dx)>80||Math.abs(d.v)>.6){
    const dir=(Math.abs(d.v)>.6?d.v:dx)>0?1:-1; SFX.whoosh(); buzz(10);
    flying.add(top); order.push(order.shift()); gsap.set(top,{zIndex:30});
    gsap.to(top,{x:dir*innerWidth,y:'+=40',rotation:dir*30,duration:.45,ease:'power2.in',onComplete:()=>{ flying.delete(top); gsap.set(top,{x:0,rotation:0,opacity:0}); layoutDeck(true); }});
    layoutDeck(true); gsap.to('#deckHint',{opacity:0,duration:.4});
  } else { gsap.to(top,{x:0,y:0,rotation:-2,duration:.5,ease:'back.out(2)'}); }
}
deck.addEventListener('pointerup',dEnd); deck.addEventListener('pointercancel',dEnd);

/* ---------- page 4: balloon game ---------- */
const dots=$('#dots'); for(let i=0;i<10;i++) dots.appendChild(document.createElement('i'));
let balloonsIn=false;
function introBalloons(){
  if(balloonsIn) return; balloonsIn=true;
  balloons.forEach((b,i)=>{ b.off.y=-9; gsap.to(b.off,{y:0,duration:1.5,ease:'elastic.out(1,.6)',delay:.1+i*.08}); });
}
const ray=new THREE.Raycaster(), ndc=new THREE.Vector2(), wp=new THREE.Vector3();
function tapBalloon(x,y){
  if(FLOWER||S.game.done) return;
  ndc.set(x/innerWidth*2-1,-(y/innerHeight)*2+1); ray.setFromCamera(ndc,camera);
  const live=balloons.filter(b=>!b.popped); const hits=ray.intersectObjects(live.map(b=>b.hit),false);
  if(!hits.length) return;
  const b=live.find(q=>q.hit===hits[0].object); popBalloon(b);
}
function popBalloon(b){
  b.popped=true; b.g.getWorldPosition(wp); wp.y+=.1;
  SFX.pop(); buzz(15);
  sparks.puff(wp,46,b.color,5.5,.22); confetti.burst(wp,26,{speed:4.5,up:1.5,life:2.8});
  sparks.emit(wp.x,wp.y,wp.z,0,0,0,.22,2.6,.8,1,1,1,0,0,false);
  const o={s:b.sc}; gsap.to(o,{s:b.sc*1.35,duration:.08,onUpdate:()=>{ b.g.scale.setScalar(o.s); },onComplete:()=>{ b.g.visible=false; }});
  S.game.left--; const done=10-S.game.left; $$('#dots i').forEach((d,i)=>d.classList.toggle('on',i<done));
  $('#count').textContent=S.game.left?S.game.left+' '+tx('leftWord','left'):tx('allPopped','All popped');
  if(!S.game.left) finishGame();
}
function finishGame(){
  S.game.done=true; SFX.chime();
  const mid=new THREE.Vector3(0,1,2); confetti.burst(mid,320,{speed:8,up:6,life:4.5}); sparks.puff(mid,120,0xFFE27A,6,.24);
  const pa=$('#polArt'); pa.outerHTML=artHTML('spark',['#FF4F8B','#8FA8FF'],CONFIG.polaroidImg).replace('class="art"','class="art" id="polArt"');
  $('#polCap').textContent=CONFIG.polaroidCaption;
  if(FLOWER){
    const m=$('#flowerMsg'); m.className='flowermsg final'; m.textContent=tx('finalLine','I always love you');
    gsap.fromTo(m,{opacity:0,scale:.6,y:10},{opacity:1,scale:1,y:0,duration:.9,ease:'elastic.out(1,.55)',overwrite:true});
    gsap.to('#flower',{opacity:0,y:24,duration:.8,delay:2.4});
  }
  const tl=gsap.timeline({delay:FLOWER?3.1:.7});
  tl.fromTo('#polaroid',{y:-innerHeight*.7,rotation:-18,scale:.7,opacity:0,visibility:'visible'},{y:0,rotation:3,scale:1,opacity:1,duration:1.3,ease:'bounce.out'})
    .call(()=>{ sparks.puff(new THREE.Vector3(0,.8,2.5),90,0xFBF9FF,4,.18); buzz(30); },null,.9)
    .fromTo('#secret',{y:24,opacity:0},{y:0,opacity:1,duration:.9,ease:'power3.out'},1.1);
}

/* ---------- page 4, flower variant: every petal says "I love you" ---------- */
const FLOWER=CONFIG.game==='flower', NP=10;
let flowerPetals=[], flowerIn=false;
$('#p4').classList.toggle('fl',FLOWER);
$('#count').textContent='10 '+tx('leftWord','left');
function buildFlower(){
  let petals='';
  for(let i=0;i<NP;i++) petals+='<g class="fall"><g transform="rotate('+(i*360/NP)+' 100 100)"><ellipse cx="100" cy="52" rx="15.5" ry="35" fill="url(#fpG)" stroke="#FF9EC0" stroke-width="1"/></g></g>';
  $('#flower').innerHTML='<svg viewBox="0 0 200 270" role="group" aria-label="Flower"><defs>'+
    '<linearGradient id="fpG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FF7AA8"/><stop offset="1" stop-color="#FFE3EF"/></linearGradient>'+
    '<radialGradient id="fcG" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#FFF3B0"/><stop offset="1" stop-color="#FFB020"/></radialGradient></defs>'+
    '<path d="M100 120 C100 170 96 215 100 270" stroke="#5FD38D" stroke-width="7" fill="none" stroke-linecap="round"/>'+
    '<path d="M99 205 C70 200 52 182 48 160 C74 160 94 178 99 205Z" fill="#46C07A"/>'+
    '<path d="M101 232 C130 226 150 208 154 186 C128 186 106 204 101 232Z" fill="#46C07A"/>'+
    petals+
    '<circle cx="100" cy="100" r="23" fill="url(#fcG)"/>'+
    '<circle cx="92" cy="94" r="2.6" fill="#E08A00" opacity=".6"/><circle cx="106" cy="92" r="2.2" fill="#E08A00" opacity=".6"/><circle cx="100" cy="106" r="2.8" fill="#E08A00" opacity=".6"/><circle cx="110" cy="104" r="2" fill="#E08A00" opacity=".6"/><circle cx="90" cy="107" r="2" fill="#E08A00" opacity=".6"/>'+
    '</svg>';
  flowerPetals=$$('#flower .fall').map((el,i)=>{
    const a=i*2*Math.PI/NP;
    el.addEventListener('click',()=>pickPetal(i));
    return {el,gone:false,o:(100+48*Math.sin(a)).toFixed(1)+' '+(100-48*Math.cos(a)).toFixed(1)};
  });
}
function introFlower(){
  if(flowerIn) return; flowerIn=true;
  const m=$('#flowerMsg'); m.className='flowermsg hint'; m.textContent=tx('petalHint','Tap a petal');
  gsap.fromTo('#flower',{opacity:0,scale:.7,y:30},{opacity:1,scale:1,y:0,duration:1.2,ease:'elastic.out(1,.6)'});
  gsap.fromTo(m,{opacity:0},{opacity:1,duration:.6,delay:.8});
}
function resetFlower(){
  flowerIn=false; buildFlower();
  const m=$('#flowerMsg'); m.className='flowermsg hint'; m.textContent='';
  gsap.set('#flower',{opacity:0,y:0,scale:1}); gsap.set(m,{opacity:1,y:0,scale:1});
}
function floatHeart(x,y){
  for(let k=0;k<3;k++){
    const h=document.createElement('span'); h.className='heart'; h.textContent='\u2665';
    h.style.left=(x-8+rand(-18,18))+'px'; h.style.top=(y-8)+'px'; $('#p4').appendChild(h);
    gsap.fromTo(h,{opacity:1,scale:.5},{opacity:0,scale:rand(.9,1.4),y:-rand(60,120),x:rand(-20,20),duration:rand(1,1.5),delay:k*.08,ease:'power1.out',onComplete:()=>h.remove()});
  }
}
function pickPetal(i){
  if(S.game.done||S.cur!==4) return;
  const p=flowerPetals[i]; if(!p||p.gone) return; p.gone=true;
  SFX.petal(NP-S.game.left); buzz(12);
  const r=p.el.getBoundingClientRect(), pr=$('#p4').getBoundingClientRect();
  floatHeart(r.left+r.width/2-pr.left, r.top+r.height/2-pr.top);
  const dir=(i%2?1:-1)*(Math.random()<.25?-1:1);
  gsap.timeline().to(p.el,{duration:.22,y:-10,scale:1.08,svgOrigin:p.o,ease:'power2.out'})
    .to(p.el,{duration:1.5,x:dir*rand(26,70),y:rand(250,330),rotation:dir*rand(70,200),opacity:0,ease:'power1.in'});
  const m=$('#flowerMsg'); m.className='flowermsg'; m.textContent=tx('petalLine','I love you');
  gsap.fromTo(m,{opacity:0,y:10,scale:.82},{opacity:1,y:0,scale:1,duration:.4,ease:'back.out(2.2)',overwrite:true});
  S.game.left--; const done=NP-S.game.left; $$('#dots i').forEach((d,k)=>d.classList.toggle('on',k<done));
  $('#count').textContent=S.game.left?S.game.left+' '+tx('leftWord','left'):tx('allPopped','All popped');
  if(!S.game.left) finishGame();
}
if(FLOWER){ buildFlower(); gsap.set('#flower',{opacity:0}); }

/* ---------- page 5: cake, wish, fireworks ---------- */
let cakeIn=false;
function introCake(){
  if(cakeIn) return; cakeIn=true;
  cakeG.scale.setScalar(.01); gsap.to(cakeG.scale,{x:1,y:1,z:1,duration:1.4,ease:'elastic.out(1,.6)',delay:.15});
  cakeG.position.y=-4; gsap.to(cakeG.position,{y:-1.5,duration:1.3,ease:'back.out(1.4)',delay:.15});
}
$('#blow').addEventListener('click',()=>{
  audioInit(); if(S.blown) return; S.blown=true; SFX.blow(); buzz(30);
  gsap.to('#blow',{opacity:0,y:20,duration:.4,onComplete:()=>{ $('#blow').style.display='none'; }});
  flames.forEach((f,i)=>{
    gsap.to(f,{k:0,duration:.35,delay:i*.09,ease:'power2.in',onComplete:()=>{
      const w=new THREE.Vector3(f.x,2.9,f.z); cakeG.localToWorld(w);
      for(let s=0;s<14;s++) sparks.emit(w.x+rand(-.04,.04),w.y,w.z,rand(-.2,.2),rand(.5,1),rand(-.2,.2),rand(1.6,2.6),rand(.25,.4),.22,.7,.68,.72,.6,-.15,false);
    }});
  });
  gsap.to(renderer,{toneMappingExposure:.5,duration:.9,delay:.5});
  gsap.to(candleLight,{intensity:0,duration:.6,delay:.4});
  _st(()=>{ fw.on=true; fwLoop(true); fireworkBarrage(); },1100);
  gsap.fromTo('#wishLine',{y:20,opacity:0},{y:0,opacity:1,duration:1,delay:1.5,ease:'power3.out'});
  $('#wishLine').textContent=CONFIG.wish; gsap.to('#wishTitle',{opacity:0,duration:.5});
  gsap.to(renderer,{toneMappingExposure:1,duration:1.4,delay:3.2});
});
const fw={on:false,t:null};
const FWC=[0xFF4F8B,0x8FA8FF,0xFFE27A,0xFBF9FF,0xB48CFF,0xFF9E7A];
function viewHalf(z){ const dist=cam.z-z, hh=Math.tan(camera.fov*Math.PI/360)*dist; return [hh*camera.aspect,hh]; }
function firework(x,y,z,hex){
  const c=new THREE.Color(hex);
  for(let i=0;i<180;i++){
    const u=rand(-1,1), th=rand(0,6.283), r=Math.sqrt(1-u*u), sp=rand(3.2,5.6);
    sparks.emit(x,y,z,r*Math.cos(th)*sp,u*sp,r*Math.sin(th)*sp,rand(1.5,2.2),.3,1,c.r,c.g,c.b,1.7,2.2,true);
  }
  for(let i=0;i<60;i++){
    const u=rand(-1,1), th=rand(0,6.283), r=Math.sqrt(1-u*u), sp=rand(.6,1.8);
    sparks.emit(x,y,z,r*Math.cos(th)*sp,u*sp,r*Math.sin(th)*sp,rand(1.8,2.8),.16,1,1,.95,.8,1.2,.8,true);
  }
  sparks.emit(x,y,z,0,0,0,.25,2.2,.8,1,.95,.8,0,0,false);
  SFX.thump(); _st(()=>SFX.crackle(),140);
}
function launch(){
  const [hw,hh]=viewHalf(-4), x=rand(-hw*.8,hw*.8), y=rand(hh*.12,hh*.7), z=-4+rand(-1,1), hex=FWC[(Math.random()*FWC.length)|0];
  const o={y:-hh*1.1}; SFX.whistle();
  gsap.to(o,{y:y,duration:.75,ease:'power2.out',onUpdate:()=>{ sparks.emit(x+rand(-.04,.04),o.y,z,0,-.7,0,.55,.14,.9,1,.8,.5,2,0,true); },onComplete:()=>firework(x,y,z,hex)});
}
function fwLoop(first){ clearTimeout(fw.t); const tick=()=>{ if(!fw.on) return; launch(); fw.t=_st(tick,rand(900,1900)); }; fw.t=_st(tick,first?2600:300); }
function fireworkBarrage(){ for(let i=0;i<4;i++) _st(()=>{ if(fw.on) launch(); },i*420); }

/* ---------- replay ---------- */
$('#replay').addEventListener('click',()=>{
  audioInit(); fw.on=false; clearTimeout(fw.t); killTl();
  const tl=gsap.timeline();
  tl.to('#flash',{opacity:1,duration:.35}).call(()=>{
    S.opened=false; S.opening=false; S.cur=0; S.pos=0; S.blown=false; S.game.left=10; S.game.done=false;
    hold.p=0; holdUpdate(); holdHint.textContent=tx('holdHint','Press and hold to open');
    giftG.visible=true; shadow.visible=true; lidG.position.set(0,.96,0); lidG.rotation.set(0,0,0); beamMat.uniforms.uA.value=0; glowM.opacity=0; disc.material.opacity=0;
    balloons.forEach((b,i)=>{ b.popped=false; b.g.visible=true; b.g.scale.setScalar(b.sc); b.off.y=-9; }); balloonsIn=false; layoutBalloons(); if(FLOWER) resetFlower();
    $$('#dots i').forEach(d=>d.classList.remove('on')); $('#count').textContent='10 '+tx('leftWord','left');
    gsap.set('#polaroid',{opacity:0,visibility:'hidden',y:0}); gsap.set('#secret',{opacity:0});
    flames.forEach(f=>f.k=1); candleLight.intensity=1.6; renderer.toneMappingExposure=1;
    $('#blow').style.display=''; gsap.set('#blow',{opacity:1,y:0}); gsap.set('#wishLine',{opacity:0}); gsap.set('#wishTitle',{opacity:1});
    cakeIn=false; cakeG.scale.setScalar(.01); gsap.set('#deckHint',{opacity:1});
    gsap.set(cam,{x:0,y:.9,z:9.8,ly:.2}); render(); updateUI(); tint(0);
  }).to('#flash',{opacity:0,duration:.6});
});

/* ---------- main loop ---------- */
let last=performance.now(), time=0, rainAcc=0;
function frame(now){
  const dt=Math.min((now-last)/1000,.05); last=now; time+=dt;
  par.x+=(par.tx-par.x)*.05; par.y+=(par.ty-par.y)*.05;
  const r=Math.round(S.pos);
  giftG.visible=(r===0&&!S.opened); shadow.visible=giftG.visible;
  balloonG.visible=(r===4&&!FLOWER); cakeG.visible=(r===5);

  // gift: float, spin, charge shake and glow
  if(giftG.visible){
    const hp=hold.p, sh=hp*hp*.05;
    giftG.position.y=-.3+Math.sin(time*1.4)*.12*(S.opening?0:1);
    giftG.position.x=(Math.random()-.5)*sh*2; giftG.position.z=(Math.random()-.5)*sh*2;
    giftG.rotation.y=time*.35+par.x*.4; giftG.rotation.z=(Math.random()-.5)*sh*.6; giftG.rotation.x=.12+par.y*.1;
    const sc=1+hp*.06+Math.sin(time*18)*hp*.012; giftG.scale.setScalar(sc);
    goldM.emissiveIntensity=hp*1.1+(S.opening?1:0); innerLight.intensity=hp*2.4+(S.opening?5:0);
    shadow.material.opacity=.45-Math.sin(time*1.4)*.06;
    if(!S.opening){
      if(Math.random()<.35+hp*1.8){ const a=rand(0,6.283), rr=1.3; sparks.emit(giftG.position.x+Math.cos(a)*rr,giftG.position.y+rand(-.3,1.1),Math.sin(a)*rr,Math.cos(a)*.6,rand(.6,1.6),Math.sin(a)*.6,rand(.8,1.4),rand(.1,.2),.9,1,.88,.5,1.2,-.5,true); }
    } else if(Math.random()<.9){ sparks.emit(rand(-.9,.9),giftG.position.y+.9,rand(-.9,.9),rand(-.3,.3),rand(2,5),rand(-.3,.3),rand(.8,1.5),rand(.12,.24),1,1,.9,.5,.6,0,true); }
  }
  // balloons: bob and sway
  if(balloonG.visible){
    balloons.forEach(b=>{ if(b.popped) return;
      b.g.position.set(b.base.x+Math.sin(time*b.sp+b.ph)*.1,b.base.y+b.off.y+Math.sin(time*b.sp*1.3+b.ph)*.16,b.base.z);
      b.g.rotation.z=Math.sin(time*b.sp*.9+b.ph)*.09; b.g.rotation.y=time*.5+b.ph; b.g.scale.setScalar(b.sc);
    });
  }
  // cake: spin and flicker
  if(cakeG.visible){
    cakeG.rotation.y=time*.28+par.x*.3;
    flames.forEach(f=>{ const fl=1+Math.sin(time*14+f.ph)*.1+Math.sin(time*23+f.ph*2)*.06; f.s.scale.set(.7*fl*f.k,.9*fl*f.k,1); f.s.material.opacity=f.k; });
    if(candleLight.intensity>0&&!S.blown) candleLight.intensity=1.5+Math.sin(time*13)*.2;
  }
  // ambient confetti rain and bokeh
  if(!RM&&S.opened&&!S.opening){
    const rate=[0,7,2,2,0,2,8][r]||0; rainAcc+=dt*rate;
    while(rainAcc>=1){ rainAcc-=1; const [hw,hh]=viewHalf(0); confetti.emit(rand(-hw*1.2,hw*1.2),hh*1.15,rand(-4,1.5),rand(-.3,.3),rand(-1.8,-.8),0,10); }
    if(Math.random()<.12) { const [hw,hh]=viewHalf(-3); sparks.emit(rand(-hw,hw),rand(-hh,hh),-3,rand(-.1,.1),rand(.15,.4),0,rand(5,8),rand(.9,1.8),.16,rand(.6,1),rand(.5,.8),1,0,0,false); }
  }
  confetti.update(dt,time); sparks.update(dt,time);
  camera.position.set(cam.x+par.x*.35,cam.y+par.y*-.2+Math.sin(time*.4)*.05,cam.z);
  camera.lookAt(cam.lx,cam.ly,cam.lz);
  renderer.render(scene,camera);
  if(dead) return;
  raf=requestAnimationFrame(frame);
}

/* richer color: calm the reflections on the solid objects */
scene.traverse(o=>{ if(o.material&&o.material.isMeshStandardMaterial) o.material.envMapIntensity=.5; });
confetti.mesh.material.envMapIntensity=.9; goldM.envMapIntensity=.95;

/* initial state */
gsap.set(['#p1 .ch','#heroName','#age','#p1 .from','#p6 .fin','#finale','#replay','#p6 .badge'],{opacity:0});
gsap.set('#wishLine',{opacity:0});
gsap.set('#polaroid',{xPercent:-50,yPercent:-50,opacity:0,visibility:'hidden'});
render(); updateUI(); tint(0);
raf=requestAnimationFrame(frame);
return destroy;
};
