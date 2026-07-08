(function(){
  "use strict";
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia('(pointer: coarse)').matches;
  if(reduce || coarse) return;
  document.documentElement.classList.add('has-cursor');
  var dot = document.createElement('div');
  dot.className = 'custom-cursor';
  document.body.appendChild(dot);
  var mx=0,my=0,x=0,y=0;
  window.addEventListener('mousemove', function(e){ mx=e.clientX; my=e.clientY; });
  function loop(){
    x += (mx-x)*0.18; y += (my-y)*0.18;
    dot.style.transform = 'translate('+x+'px,'+y+'px) translate(-50%,-50%)';
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  document.addEventListener('mouseover', function(e){
    if(e.target.closest('a,button,.filter-btn,.portfolio-item,input,summary')) dot.classList.add('grow');
  });
  document.addEventListener('mouseout', function(e){
    if(e.target.closest('a,button,.filter-btn,.portfolio-item,input,summary')) dot.classList.remove('grow');
  });
})();
