class BoardsController < ApplicationController
  before_action :authenticate_user!

  def new
    @board = Board.new
  end

  def create
    @board = Board.new(board_params.merge(user: current_user))

    if @board.save
      create_default_lists
      redirect_to root_path
    else
      render :new
    end
  end

  def edit
    authorize board
  end

  def update
    authorize board
    if board.update(board_params)
      redirect_to root_path
    else
      render :edit
    end
  end

  def show
    authorize board
    @lists = board.lists
  end

  def destroy
    authorize board
    board.destroy
    redirect_to root_path
  end

  private
  def board_params
    params.require(:board).permit(:name)
  end

  def board
    @board ||= Board.find(params[:id])
  end

  def create_default_lists
    default_lists = ['To Do', 'In Progress', 'In Review', 'Done']

    default_lists.each_with_index do |list_title, index|
      @board.lists.create(title: list_title, position: index)
    end
  end
end
