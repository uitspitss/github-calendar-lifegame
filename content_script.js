window.addEventListener("DOMContentLoaded", function(){
  if(!document.querySelector('.js-calendar-graph-svg')) return;
  const nickname = document.querySelector('.p-nickname').innerHTML;

  const LIFE = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
  let board = [];

  const push_banpei = () => {
    let l = [];
    for(let i=0; i < 9; i++){
      l.push({
        life: 0,
      });
    }
    board.push(l);
  };

  // initialize board
  push_banpei();
  document.querySelectorAll('g > g').forEach(g => {
    let week_rects = [];
    week_rects.push({life: 0});
    g.querySelectorAll('rect').forEach(rect => {
      week_rects.push({
        life: LIFE.findIndex(life => life === rect.getAttribute('fill')),
        date: rect.dataset.date
      });
    });
    week_rects.push({life:0});
    board.push(week_rects);
  });
  for(let i=0; i < 6 - new Date().getDay(); i++){
    board[board.length-1].push({
      life: 0
    });
  }
  push_banpei();

  // console.log(board);

  const loop = () => {
    let past_board = JSON.parse(JSON.stringify(board));
    let alive_num = 0;

    for(let x=1; x < 54; x++){
      for(let y=1; y < 8; y++){
        const past_life = past_board[x][y].life;
        const date = past_board[x][y].date;

        let cnt = 0;
        if(past_board[x-1][y].life >= 1) cnt++;
        if(past_board[x+1][y].life >= 1) cnt++;
        if(past_board[x][y-1].life >= 1) cnt++;
        if(past_board[x][y+1].life >= 1) cnt++;
        if(past_board[x-1][y-1].life >= 1) cnt++;
        if(past_board[x+1][y-1].life >= 1) cnt++;
        if(past_board[x-1][y+1].life >= 1) cnt++;
        if(past_board[x+1][y+1].life >= 1) cnt++;

        if(past_life >= 1){
          alive_num++;
          if(cnt <= 1){
            // dies by under population
            board[x][y].life -= 1;
          }else if(cnt === 2 || cnt === 3){
            // lives
          }else{
            // dies by overpopulation
            board[x][y].life -= 1;
          }
        }else{
          if(cnt === 3){
            // reproduce
            board[x][y].life = 1;
          }
        }

        // console.log(past_board[x][y].life, board[x][y].life);
        if(board[x][y].date && past_board[x][y].life !== board[x][y].life){
          document.querySelector(`rect[data-date="${date}"]`).setAttribute('fill', LIFE[board[x][y].life]);
        }
      }
    }
    let is_changed = true;
    if(JSON.stringify(board) === JSON.stringify(past_board)){
      is_changed = false;
    }
    return [is_changed, alive_num];
  }

  let gen = 0;
  const timer = setInterval(() => {
    _ret = loop();
    const is_changed = _ret[0];
    const alive_num = _ret[1];
    if(!is_changed){
      clearInterval(timer);
      if(alive_num === 0){
        alert(`congratulations! ${nickname}'s calendar is alive to ${gen} generations.`);
      }else{
        alert(`congratulations! ${nickname}'s calendar is alive to ${gen} generations, and ${alive_num} cells are alive forever.`);
      }
    }
    gen++;
  }, 1000);
});
