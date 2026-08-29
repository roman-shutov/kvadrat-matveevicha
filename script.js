const header=document.querySelector('[data-header]');
const menu=document.querySelector('.menu-button');
const nav=document.querySelector('.nav');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

const setHeader=()=>header.classList.toggle('scrolled',scrollY>50);
addEventListener('scroll',setHeader,{passive:true});setHeader();

menu.addEventListener('click',()=>{
  const open=document.body.classList.toggle('menu-open');
  menu.setAttribute('aria-expanded',String(open));
});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  document.body.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');
}));

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
}),{threshold:.1,rootMargin:'0px 0px -5%'});
document.querySelectorAll('.reveal,.reveal-media').forEach(el=>observer.observe(el));

if(!reduced){
  const parallaxItems=[...document.querySelectorAll('.parallax')];
  let ticking=false;
  const paintParallax=()=>{
    parallaxItems.forEach(el=>{
      const rect=el.getBoundingClientRect();
      if(rect.bottom>0&&rect.top<innerHeight){
        const speed=Number(el.dataset.speed||.08);
        el.style.transform=`translate3d(0,${(rect.top-innerHeight/2)*speed}px,0) scale(1.08)`;
      }
    });
    ticking=false;
  };
  addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(paintParallax);ticking=true}},{passive:true});paintParallax();

  const cursor=document.querySelector('.cursor');
  addEventListener('pointermove',event=>{cursor.style.left=`${event.clientX}px`;cursor.style.top=`${event.clientY}px`;cursor.classList.add('on')});
  document.querySelectorAll('a,button,.transform-row,.project-media').forEach(el=>{
    el.addEventListener('pointerenter',()=>cursor.classList.add('active'));
    el.addEventListener('pointerleave',()=>cursor.classList.remove('active'));
  });

  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('pointermove',event=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(event.clientX-r.left-r.width/2)*.12}px,${(event.clientY-r.top-r.height/2)*.18}px)`});
    el.addEventListener('pointerleave',()=>el.style.transform='');
  });

  const preview=document.querySelector('.hover-preview');
  const previewImage=preview.querySelector('img');
  document.querySelectorAll('.transform-row').forEach(row=>{
    row.addEventListener('pointerenter',()=>{previewImage.src=row.dataset.image;preview.classList.add('show')});
    row.addEventListener('pointermove',event=>{preview.style.left=`${event.clientX}px`;preview.style.top=`${event.clientY}px`});
    row.addEventListener('pointerleave',()=>preview.classList.remove('show'));
  });
}

document.querySelector('[data-year]').textContent=new Date().getFullYear();
