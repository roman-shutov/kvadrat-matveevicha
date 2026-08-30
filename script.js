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

if(!reduced){
  const drifting=[...document.querySelectorAll('.drift')];
  let driftTick=false;
  const paintDrift=()=>{
    drifting.forEach(el=>{
      const rect=el.getBoundingClientRect();
      if(rect.bottom>0&&rect.top<innerHeight){
        const progress=(rect.top+rect.height/2-innerHeight/2)/innerHeight;
        el.style.transform=`translate3d(0,${progress*Number(el.dataset.drift||0)}px,0)`;
      }
    });
    driftTick=false;
  };
  addEventListener('scroll',()=>{if(!driftTick){requestAnimationFrame(paintDrift);driftTick=true}},{passive:true});
  paintDrift();
}


document.querySelector('[data-year]').textContent=new Date().getFullYear();

const contactDialog=document.querySelector('.contact-dialog');
const contactContext=document.querySelector('[data-contact-context]');
const openContact=(topic='Связаться с нами')=>{
  if(contactContext)contactContext.textContent=topic;
  if(contactDialog.open)return;
  contactDialog.showModal();
  document.body.classList.add('lead-open');
};
const closeContact=()=>{
  if(!contactDialog.open)return;
  contactDialog.close();
  document.body.classList.remove('lead-open');
};

document.querySelectorAll('[data-open-contact]').forEach(trigger=>{
  trigger.addEventListener('click',event=>{
    event.preventDefault();
    openContact(trigger.dataset.contactTopic);
  });
  if(trigger.matches('[role="button"]'))trigger.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){event.preventDefault();openContact(trigger.dataset.contactTopic)}
  });
});
document.querySelector('[data-close-contact]').addEventListener('click',closeContact);
contactDialog.addEventListener('click',event=>{if(event.target===contactDialog)closeContact()});
contactDialog.addEventListener('close',()=>document.body.classList.remove('lead-open'));

const setLeadTrigger=()=>document.body.classList.toggle('lead-ready',scrollY>innerHeight*.58);
addEventListener('scroll',setLeadTrigger,{passive:true});setLeadTrigger();

const craftHub=document.querySelector('.network-hub');
const craftImage=craftHub?.querySelector('.network-hub-image');
const craftTitle=craftHub?.querySelector('[data-hub-title]');
const craftNodes=[...document.querySelectorAll('[data-craft-image]')];
const showCraft=node=>{
  const title=node.querySelector('h3')?.textContent||'';
  const source=node.dataset.craftImage;
  if(!source)return;
  craftImage.src=source;
  craftImage.alt=`Пример работы: ${title}`;
  craftTitle.textContent=title;
  craftHub.classList.add('is-preview');
};
const resetCraft=()=>craftHub?.classList.remove('is-preview');

craftNodes.forEach(node=>{
  node.tabIndex=0;
  node.setAttribute('role','button');
  node.setAttribute('aria-label',`Показать пример: ${node.querySelector('h3')?.textContent||''}`);
  node.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')showCraft(node)});
  node.addEventListener('pointerleave',event=>{if(event.pointerType!=='touch')resetCraft()});
  node.addEventListener('focus',()=>showCraft(node));
  node.addEventListener('blur',resetCraft);
  node.addEventListener('click',()=>{
    showCraft(node);
    if(matchMedia('(max-width:700px)').matches)craftHub.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});
  });
  node.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();showCraft(node)}});
});

const audienceImages=[...document.querySelectorAll('.audience-image>img')];
const audienceItems=[...document.querySelectorAll('[data-audience-slide]')];
const audienceCurrent=document.querySelector('[data-audience-current]');
const audienceCta=document.querySelector('.audience-cta');
const audienceCtaText=document.querySelector('[data-audience-cta]');
const audienceTopics=['Обсудить частную резиденцию','Обсудить проект с дизайнером или архитектором','Обсудить интерьер ресторана или отеля','Обсудить бутик или галерею','Обсудить премиальный офис'];
let audienceIndex=0;
let audienceTimer;
const showAudience=index=>{
  audienceIndex=Number(index);
  audienceImages.forEach((image,i)=>image.classList.toggle('is-active',i===audienceIndex));
  audienceItems.forEach(item=>item.classList.toggle('is-active',Number(item.dataset.audienceSlide)===audienceIndex));
  if(audienceCurrent)audienceCurrent.textContent=String(audienceIndex+1).padStart(2,'0');
  if(audienceCta){audienceCta.dataset.contactTopic=audienceTopics[audienceIndex];audienceCtaText.textContent=audienceTopics[audienceIndex]}
};
const runAudience=()=>{
  clearInterval(audienceTimer);
  if(!reduced&&audienceImages.length>1)audienceTimer=setInterval(()=>showAudience((audienceIndex+1)%audienceImages.length),4800);
};
audienceItems.forEach(item=>{
  item.tabIndex=0;
  item.addEventListener('pointerenter',()=>{showAudience(item.dataset.audienceSlide);runAudience()});
  item.addEventListener('focus',()=>{showAudience(item.dataset.audienceSlide);runAudience()});
  item.addEventListener('click',()=>{showAudience(item.dataset.audienceSlide);runAudience()});
});
runAudience();
