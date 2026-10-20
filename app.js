const $=(selector,context=document)=>context.querySelector(selector);
const $$=(selector,context=document)=>[...context.querySelectorAll(selector)];

const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer=matchMedia('(pointer: coarse)').matches;
const phone='5527998996151';

const treatmentData={
  medidas:{
    index:'01',
    title:'Medidas & contorno',
    subtitle:'corpo · definição · protocolo',
    text:'Para quem quer trabalhar gordura localizada, contorno corporal e redução de medidas com uma estratégia mais direcionada ao próprio corpo.',
    tags:['Criolipólise personalizada','Redufit','Diástase']
  },
  pele:{
    index:'02',
    title:'Pele & textura',
    subtitle:'limpeza · renovação · cuidado',
    text:'Para quem quer cuidar de textura, viço, limpeza, marcas e aparência da pele com procedimentos escolhidos de acordo com a necessidade do momento.',
    tags:['Limpeza de pele','Microagulhamento','Jato de plasma']
  },
  leveza:{
    index:'03',
    title:'Leveza & circulação',
    subtitle:'drenagem · detox · bem-estar',
    text:'Para quem procura aliviar a sensação de inchaço, estimular o cuidado corporal e transformar a rotina estética em um momento de bem-estar.',
    tags:['Drenagem linfática','Detox corporal','Ventosaterapia']
  },
  vasos:{
    index:'04',
    title:'Microvasos',
    subtitle:'PEIM · avaliação · acompanhamento',
    text:'Para quem deseja conversar sobre microvasos e entender se o PEIM faz sentido para o seu caso, sempre começando por avaliação e orientação individual.',
    tags:['PEIM','Avaliação','Acompanhamento']
  },
  piercing:{
    index:'05',
    title:'Furo humanizado',
    subtitle:'cuidado · orientação · body piercing',
    text:'Para quem busca uma perfuração conduzida com mais calma, orientação e atenção ao conforto, seja em um primeiro furo ou em um novo piercing.',
    tags:['Furo humanizado','Body piercing','Orientação']
  }
};

const state={
  goal:'redução de medidas e contorno corporal',
  time:'pela manhã',
  note:''
};

function revealOnScroll(){
  if(reduceMotion){$$('.reveal').forEach(el=>el.classList.add('visible'));return}
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  },{threshold:.1,rootMargin:'0px 0px -5%'});

  $$('.reveal').forEach(el=>{
    el.style.setProperty('--delay',`${el.dataset.delay||0}ms`);
    observer.observe(el);
  });
}

function pageProgress(){
  const bar=$('.progress span');
  const header=$('.header');
  const update=()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    bar.style.transform=`scaleX(${max?scrollY/max:0})`;
    header.classList.toggle('scrolled',scrollY>30);
  };
  addEventListener('scroll',update,{passive:true});
  update();
}

function navigation(){
  const links=$$('.nav a');
  const sections=links.map(link=>$(link.getAttribute('href'))).filter(Boolean);
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      links.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${entry.target.id}`));
    });
  },{rootMargin:'-34% 0px -56%'});
  sections.forEach(section=>observer.observe(section));
}

function mobileMenu(){
  const button=$('.menu-button');
  const menu=$('.mobile-menu');
  if(!button||!menu)return;

  const setOpen=open=>{
    button.classList.toggle('active',open);
    button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
    menu.classList.toggle('open',open);
    menu.setAttribute('aria-hidden',String(!open));
    document.body.classList.toggle('menu-open',open);
  };

  button.addEventListener('click',()=>setOpen(!menu.classList.contains('open')));
  $$('a',menu).forEach(link=>link.addEventListener('click',()=>setOpen(false)));
  addEventListener('keydown',event=>{if(event.key==='Escape')setOpen(false)});
}

function treatmentSelector(){
  const detail=$('#treatmentDetail');
  const title=$('#detailTitle');
  const subtitle=$('#detailSubtitle');
  const text=$('#detailText');
  const index=$('#detailIndex');
  const tags=$('#detailTags');
  const whatsapp=$('#detailWhatsapp');

  const select=button=>{
    const key=button.dataset.key;
    const data=treatmentData[key];
    $$('.treatment-item').forEach(item=>{
      const active=item===button;
      item.classList.toggle('active',active);
      item.setAttribute('aria-pressed',String(active));
    });

    detail.dataset.mode=key;
    index.textContent=data.index;
    title.textContent=data.title;
    subtitle.textContent=data.subtitle;
    text.textContent=data.text;
    tags.innerHTML=data.tags.map(tag=>`<span>${tag}</span>`).join('');

    const message=`Olá! Conheci o trabalho da Lorena Dias pelo site e gostaria de conversar sobre ${data.title.toLowerCase()}. Podem me orientar sobre o melhor caminho para começar?`;
    whatsapp.href=`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    if(!reduceMotion){
      [title,text,tags].forEach((element,i)=>element.animate([
        {opacity:.12,transform:'translateY(8px)'},
        {opacity:1,transform:'none'}
      ],{duration:360+i*70,easing:'cubic-bezier(.22,1,.36,1)'}));
    }
  };

  $$('.treatment-item').forEach(button=>button.addEventListener('click',()=>select(button)));
  const initial=$('.treatment-item.active');
  if(initial)select(initial);
}

function singleSelect(container,key){
  if(!container)return;
  $$('.option',container).forEach(button=>{
    button.addEventListener('click',()=>{
      $$('.option',container).forEach(item=>item.classList.remove('selected'));
      button.classList.add('selected');
      state[key]=button.dataset.value;
      updateMessage();
    });
  });
}

function updateMessage(){
  const preview=$('#messagePreview');
  const button=$('#whatsappButton');
  if(!preview||!button)return;

  const note=state.note.trim()?`\n\nQueria comentar também: ${state.note.trim()}`:'';
  const message=`Olá! Conheci o trabalho da Lorena Dias pelo site e gostaria de uma orientação.\n\nHoje eu gostaria de ${state.goal}.\nMeu melhor período costuma ser ${state.time}.${note}\n\nVocês conseguem me orientar sobre qual cuidado faz mais sentido para começar?`;
  preview.textContent=message;
  button.href=`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function diagnosticBuilder(){
  singleSelect($('#goalOptions'),'goal');
  singleSelect($('#timeOptions'),'time');

  const note=$('#note');
  if(note){
    note.addEventListener('input',()=>{
      state.note=note.value;
      $('#noteCount').textContent=note.value.length;
      updateMessage();
    });
  }
  updateMessage();
}

function parallax(){
  if(reduceMotion||coarsePointer)return;
  const photos=$$('.parallax-photo');
  const update=()=>{
    photos.forEach(photo=>{
      const image=$('img',photo);
      if(!image)return;
      const rect=photo.getBoundingClientRect();
      if(rect.bottom<0||rect.top>innerHeight)return;
      const center=rect.top+rect.height/2;
      const distance=(center-innerHeight/2)/innerHeight;
      image.style.transform=`translate3d(0,${distance*-30}px,0) scale(1.02)`;
    });
  };
  addEventListener('scroll',update,{passive:true});
  update();
}

function magnetic(){
  if(coarsePointer||reduceMotion)return;
  $$('.magnetic').forEach(element=>{
    element.addEventListener('pointermove',event=>{
      const rect=element.getBoundingClientRect();
      const x=event.clientX-(rect.left+rect.width/2);
      const y=event.clientY-(rect.top+rect.height/2);
      element.style.transform=`translate(${x*.07}px,${y*.07}px)`;
    });
    element.addEventListener('pointerleave',()=>{element.style.transform=''});
  });
}

function smoothAnchors(){
  $$('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',event=>{
      const target=$(link.getAttribute('href'));
      if(!target)return;
      event.preventDefault();
      target.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'});
    });
  });
}

$('#year').textContent=new Date().getFullYear();
revealOnScroll();
pageProgress();
navigation();
mobileMenu();
treatmentSelector();
diagnosticBuilder();
parallax();
magnetic();
smoothAnchors();
