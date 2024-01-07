class DashboardController < ApplicationController
  before_action :authenticate_user!
  def index
    # @boards = Board.all
    @boards = current_user.boards

    @assigned_boards = Board.assigned_boards(current_user)
  end
end
