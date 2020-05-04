
class Environment{

  constructor(board_length){
    this.board = [];
    this.board_length = board_length;
    this.p1 = 1;
    this.p2 = -1;
    this.winner = 0;
    this.ended = false;
    this.num_states = Math.pow(3,this.board_length*this.board_length);
    this.player_turn = 1;

    for(let i=0;i<Math.pow(this.board_length,2);i++){
      this.board.push(0);
    }
  }

  get_cell(i, j){
    return parseInt(this.board[(j*this.board_length)+i]);
  }

  set_cell(i, j, value){
    // console.log(i, j, value);
    this.board[(j*this.board_length)+i] = parseInt(value);
  }

  cell_is_empty(i, j){
    return this.get_cell(i, j) == 0;
  }

  grid_select(index, show_ui=true){

    if(this.board[index] != 0){
      return false;
    }

    this.board[index] = this.player_turn;

    if(show_ui){
      let thisid = "#btn_ttt_click"+index.toString();
      if(this.player_turn == 1){
        $(thisid).toggleClass('white red');
        $(thisid).text('O')
      }else{
        $(thisid).toggleClass('white green');
        $(thisid).text('X')
      }
    }

    if(this.is_game_over()){
      this.ended = true;
      // console.log('game ended, winner ', this.winner)

    }else{
      this.player_turn = this.player_turn * -1;
    }

  }

  reset_game(reset_player=true, show_ui=true){
    this.winner = 0;
    // this.board = [];

    for(let i=0;i<Math.pow(this.board_length,2);i++){
      // this.board.push(0);
      if(show_ui){
        let thisid = "#btn_ttt_click"+i.toString();
        // if(this.board[i] == 1){
        //   $(thisid).toggleClass('red white');
        // }else if(this.board[i] == -1){
        //   $(thisid).toggleClass('green white');
        // }
        $(thisid).removeClass("green");
        $(thisid).removeClass("red");
        $(thisid).addClass("white");
        $(thisid).text('.');
      }
      this.board[i] = 0;
    }

    this.ended = false;

    if(reset_player){
      this.player_turn = 1;
    }
  }

  get_reward(player){
    if(!this.is_game_over()){
      return 0;
    }
    if(this.winner == player){
      return 1;
    }else{
      return 0;
    }
  }

  get_state(){
    let v = 0;
    let k = 0;
    let hashnum = 0;

    for(let i=0;i<this.board_length;i++){
      for(let j=0;j<this.board_length;j++){
        if(this.get_cell(i,j) == 0){
          v = 0;
        }else if (this.get_cell(i,j) == this.p2){
          v = 1;
        }else if (this.get_cell(i,j) == this.p1){
          v = 2;
        }

        hashnum += Math.pow(3,k) * v;
        k++;

        // console.log(i, j, this.get_cell(i,j), v, h, k)
      }
    }
    return hashnum;
  }

  is_game_over(test_board=[]){

    if(test_board.length==0){
      test_board = this.board;
    }

    for(let i=0;i<(this.board_length*this.board_length);i+=this.board_length){
      let sum = 0;
      for(let j=i;j<i+this.board_length;j+=1){
        sum += test_board[j];
      }
      if(this.check_if_player_won(sum)){
        this.ended = true;
        return true;
      }
    }

    // columns
    for(let i=0;i<this.board_length;i+=1){
      let sum = 0;
      for(let j=i;j<i+7;j+=this.board_length){
        sum += test_board[j];
      }
      if(this.check_if_player_won(sum)){
        this.ended = true;
        return true;
      }
    }

    // diagonals
    if(
      this.check_if_player_won(test_board[0]+test_board[4]+test_board[8])
      ||
      this.check_if_player_won(test_board[2]+test_board[4]+test_board[6])
    ){
      this.ended = true;
      return true;
    }

    let has_no_zeros = true;
    for(let i=0;i<this.board_length*this.board_length;i+=1){
      if(test_board[i] == 0){
        has_no_zeros = false;
        break;
      }
    }
    if(has_no_zeros){
      this.ended = true;
      return true;
    }

    return false;
  }

  check_if_player_won(sum){
    if(sum==-3){
      this.winner = -1;
      return true;
    }else if(sum==3){
      this.winner = 1;
      return true;
    }
  }

}
