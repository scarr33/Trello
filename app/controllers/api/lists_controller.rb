class Api::ListsController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    @lists = board.lists.order(position: :asc)

    render json: ListSerializer.new(@lists).serializable_hash.to_json
  end

  def update
    lists = board.lists.to_a
    delete_index = lists.index {|list| list.id == params[:id].to_i}
    list = lists.delete_at(delete_index)
    lists.insert(params[:position].to_i, list)
    lists.each_with_index do |list, index|
      list.update(position: index)
    end

    render json: ListSerializer.new(lists).serializable_hash.to_json
  end

  private

  def board
    @board ||= Board.find(params[:board_id])
  end
end
